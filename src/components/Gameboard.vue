<template>
  <div>
    <!-- <div>
      <button class="new-game" @click="init()">重新游戏</button>
      <p>score:<span>{{myScore}}</span></p>
      <p v-if="this.type==1">距离比赛结束还有：{{time}}</p>
      <p v-if="this.type==2">还有：{{count}}</p>
    </div> -->
    <div class="container grid-container">
      <div class="container number-container" ref='numberRef'>
      </div>
      <div class="cell grid-cell"></div>
      <div class="cell grid-cell"></div>
      <div class="cell grid-cell"></div>
      <div class="cell grid-cell"></div>
      <div class="cell grid-cell"></div>
      <div class="cell grid-cell"></div>
      <div class="cell grid-cell"></div>
      <div class="cell grid-cell"></div>
      <div class="cell grid-cell"></div>
      <div class="cell grid-cell"></div>
      <div class="cell grid-cell"></div>
      <div class="cell grid-cell"></div>
      <div class="cell grid-cell"></div>
      <div class="cell grid-cell"></div>
      <div class="cell grid-cell"></div>
      <div class="cell grid-cell"></div>
    </div>
  </div>
</template>

<script>
import { numberInit, clearPoint, getRandom, getNum, canMoveLeft, canMoveRight, canMoveUp, canMoveDown, noBlockHorizontal, noBlockVertical, generateOneNum, HorAnimation, VerAnimation } from '../assets/utils'
export default {
  name: 'drawing',
  props: ['level', 'type', 'setTime'],
  data: () => {
    return {
      numberRef: null,
      point: [],
      myScore: 0,
      scoreChange: 0,
      // 计时变量，设置计时时间
      time: 20,
      // 保存定时器
      timer: null,
      reg: new RegExp(' trans-scale'),
      anima: [],
      // 速度模式
      count: 5,
      timeOut: null,
    }
  },
  // 钩子函数
  mounted () {
    this.numberRef = this.$refs.numberRef
    // this.init()
  },
  watch: {
    // 限时模式
    type: {
      handler(type) {
        if (type == 1) {
          this.timer = setInterval(() => {
            this.time = this.time - 1
          }, 1000)
        }
      }
    },
    myScore: {
      handler(myScore) {
        this.$emit("newScore",myScore)
      }
    },
    scoreChange: {
      handler(scoreChange) {
        if(scoreChange == 4) {
          this.$emit('scoreChange', scoreChange)
        }
      }
    },
    time: {
      handler(time) {
        if(time <= 0) {
          this.$emit('gameOver')
          document.removeEventListener('keydown', this.keydown)
          clearInterval(this.timer)
          // ------ 这里考虑如何对比两个人的分数
          // 显示胜利／失败
          // ======= 添加动画
        }
      }
    },
    setTime: {
      handler(setTime) {
        this.time = this.setTime * 60
      }
    }
  },
  methods: {
    speedMode() {
      this.count = 5
      clearInterval(this.timeOut)
      this.timeOut = setInterval(() => {
        this.count--
        if(this.count == 0) {
          console.log('over')
          // 最后记得清除定时器，否则就算是服输也会一直计时
          clearInterval(this.timeOut)
          // ======== 游戏结束弹窗／动画
          this.$emit("gameOver")
        }
      }, 1000)
    },
    keydown (event) {
      if(this.type == 2) this.speedMode()
      event = event || window.event
      this.move(event)
    },
    init () {
      // 所有归零
      
      document.addEventListener("keydown", this.keydown)
      if(this.setTime) this.time = this.setTime * 60

      clearPoint(this.point, this.anima)
      numberInit(this.point, this.numberRef)
      // ----- 设置计时时间
      // this.time = 600000
      this.myScore = 0

      var x1 = getRandom()
      var y1 = getRandom()
      var x2 = getRandom()
      var y2 = getRandom()

      this.point[x1][y1] = getNum(1)
      this.point[x2][y2] = getNum(1)

      if (!(x1 === x2) || y1 !== y2) {
        //  注意：childNodes（NodeList类） 和 children（HTMLCollection） 的区别
        this.numberRef.children[x1 * 4 + y1].innerHTML = this.point[x1][y1]
        this.numberRef.children[x1 * 4 + y1].setAttribute('class', 'cell number-cell' + this.point[x1][y1])
        this.numberRef.children[x2 * 4 + y2].innerHTML = this.point[x2][y2]
        this.numberRef.children[x2 * 4 + y2].setAttribute('class', 'cell number-cell' + this.point[x2][y2])
        // ------ 开始计时
        if(this.type == 1) {
          this.timer = setInterval(() => {
            this.time = this.time - 1
          }, 1000)
        }
        
      } else {
        this.init()
      }
    },
    move (event) {
      event = event || window.event
      switch (event.which) {
        case 37:
          if (canMoveLeft(this.point)) {
            this.moveLeft()          
            this.interval()
            // ====== 新增一个值时，添加动画   
          } else {
            this.isGameOver()
          }
          break
        case 38:
          if (canMoveUp(this.point)) {
            this.moveUp()
            this.interval() 
          } else {
            this.isGameOver()
          }
          break
        case 39:
          if (canMoveRight(this.point)) {
            // 1. 同一列的要可以同时被加，如[2,2,2,2]
            this.moveRight()
            this.interval()
          } else {
            this.isGameOver()
          }
          break
        case 40:
          if (canMoveDown(this.point)) {
            this.moveDown()
            this.interval()
          } else {
            this.isGameOver()
          }
          break
        default: break
      }
    },
    moveLeft () {
      for (var i = 0; i < 4; i++) {
        let addable = true
        let lastPoint
        for (var j = 1; j < 4; j++) {
          if (this.point[i][j] !== 0) {
            for (var k = 0; k < j; k++) {
              if (this.point[i][j] !== 0 && this.point[i][k] === 0 && noBlockHorizontal(this.point, i, k, j)) {
                // move
                // ====== 添加从[i,j]移动到[i,k]的动画
                // 将[i，j]的值赋给[i,k]
                this.point[i][k] = this.point[i][j]
                // [i,j]的值归零
                this.point[i][j] = 0
                HorAnimation(this.numberRef, i, j, k)
                // 跳出这个点的移动循环，因为此时这个点已经移动过
                // 移动方式二：如果在[i,k]位置上的数字与[i,j]的数字相同，且从[i,k]到[i,j]之间没有障碍物
              } else if (this.point[i][j] !== 0 && this.point[i][k] === this.point[i][j] && noBlockHorizontal(this.point, i, k, j)) {
                // 这里还是有bug，继续调试
                // ====== 添加从[i,j]移动到[i,k]的动画
                HorAnimation(this.numberRef, i, j, k)
                if(addable || (this.point[i][j] != lastPoint)) {
                  this.myScore += this.point[i][j]
                  this.scoreChange = this.point[i][j]
                  this.point[i][k] += this.point[i][j]
                  this.point[i][j] = 0
                  addable = false
                  lastPoint = this.point[i][k]
                  this.anima[i][k] = true
                } else {
                  this.point[i][k+1] = this.point[i][j]
                  this.point[i][j] = 0
                }
                
              }
              continue
            }
          }
        }
      }
    },
    moveUp () {
      for (var j = 0; j < 4; j++) {
        let addable = true
        let lastPoint
        for (var i = 1; i < 4; i++) {
          if (this.point[i][j] !== 0) {
            for (var k = 0; k < i; k++) {
              if (this.point[i][j] !== 0 && this.point[k][j] === 0 && noBlockVertical(this.point, j, k, i)) {
                VerAnimation(this.numberRef, i, j, k)
                // move
                this.point[k][j] = this.point[i][j]
                this.point[i][j] = 0
                continue
              } else if (this.point[i][j] !== 0 && this.point[k][j] === this.point[i][j] && noBlockVertical(this.point, j, k, i)) {
                VerAnimation(this.numberRef, i, j, k)
                // move
                // add
                if(addable || (this.point[i][j] != lastPoint)) {
                  this.scoreChange = this.point[i][j]
                  this.myScore += this.point[i][j]
                  this.point[k][j] += this.point[i][j]
                  this.point[i][j] = 0
                  addable = false
                  lastPoint = this.point[k][j]
                  this.anima[k][j] = true
                } else {
                  this.point[k+1][j] = this.point[i][j]
                  this.point[i][j] = 0
                }
                
                continue
              }
            }
          }
        }
      }
    },
    moveRight () {
      for (var i = 0; i < 4; i++) {
        let addable = true
        let lastPoint
        for (var j = 2; j >= 0; j--) {
          if (this.point[i][j] !== 0) {
            for (var k = 3; k > j; k--) {
              if (this.point[i][j] !== 0 && this.point[i][j] !== 0 && this.point[i][k] === 0 && noBlockHorizontal(this.point, i, j, k)) { 
                this.point[i][k] = this.point[i][j]
                this.point[i][j] = 0
                HorAnimation(this.numberRef, i, j, k)
                continue
              } else if (this.point[i][j] !== 0 && this.point[i][j] !== 0 && this.point[i][k] === this.point[i][j] && noBlockHorizontal(this.point, i, j, k)) {
                HorAnimation(this.numberRef, i, j, k)
                if(addable || (this.point[i][j] != lastPoint)) {
                  this.scoreChange = this.point[i][j]
                  this.myScore += this.point[i][j]
                  this.point[i][k] += this.point[i][j]
                  this.point[i][j] = 0 
                  addable = false
                  lastPoint = this.point[i][k]
                  this.anima[i][k] = true
                } else {
                  this.point[i][k-1] += this.point[i][j]
                  this.point[i][j] = 0 
                }
                              
                continue
              }
            }
          }
        }
      }
    },
    moveDown () {
      for (var j = 0; j < 4; j++) {
        let addable = true
        let lastPoint
        for (var i = 2; i >= 0; i--) {
          if (this.point[i][j] !== 0) {
            for (var k = 3; k > i; k--) {
              if (this.point[i][j] !== 0 && this.point[k][j] === 0 && noBlockVertical(this.point, j, i, k)) {
                VerAnimation(this.numberRef, i, j, k)
                this.point[k][j] = this.point[i][j]
                this.point[i][j] = 0
                continue
              } else if (this.point[i][j] !== 0 && this.point[k][j] === this.point[i][j] && noBlockVertical(this.point, j, i, k)) {
                VerAnimation(this.numberRef, i, j, k)
                if(addable || (this.point[i][j] != lastPoint)) {
                  this.scoreChange = this.point[i][j]
                  this.myScore += this.point[i][j]
                  
                  this.point[k][j] += this.point[i][j]
                  this.point[i][j] = 0
                  addable = false
                  lastPoint = this.point[k][j]
                  this.anima[k][j] = true
                } else {
                  this.point[k-1][j] += this.point[i][j]
                  this.point[i][j] = 0
                }
                
                continue
              }
            }
          }
        }
      }
    },

    freshGrid () {
      this.numberRef.innerHTML = ''
      for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
          let el = document.createElement('div')
          if (this.point[i][j] === 0) {
            el.className = 'number-cell'
          } else {
            el.innerHTML = this.point[i][j]

            if(this.anima[i][j]) {
              el.className = 'cell number-cell' + this.point[i][j] + ' trans-scale'
              // grid.className = 'cell number-cell' + this.point[i][j] + ' trans-scale'            
              this.anima[i][j] = false
              
              el.addEventListener('animationend', () => {
                // 事件绑定，this指向绑定事件的元素，用箭头函数！           
                el.className = el.className.replace(this.reg, '')
              })
            } else {
              el.className = 'cell number-cell' + this.point[i][j]
            }
          }
          this.numberRef.appendChild(el)
        }
      }
    },
    isGameOver () {
      if(!canMoveLeft(this.point) && !canMoveRight(this.point) && !canMoveUp(this.point) && !canMoveDown(this.point)) {
        this.$emit("gameOver")
        // ====== 增加 游戏结束 动画
        // ------- 对战模式下，通知对方对战已结束，判定对方胜利
      }
    },
    interval () {
      setTimeout(() => {
        this.freshGrid()
      }, 200) 
      setTimeout(() => {
        if(this.level == 2) generateOneNum(this.point, this.numberRef, this.level)
        generateOneNum(this.point, this.numberRef, this.level)
      }, 300)
    }
  }
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
}
.container {
  width: 350px;
  height: 350px;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
   /* 让矩阵的多根轴线同样均匀分布 */
  align-content: space-between;
}
.number-container {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
}
.grid-container {
  margin: auto;
  background-color: #BBADA0;
  position: relative;
}
.cell {
  width: 80px;
  height: 80px;
  border-radius:5px;
  background-color: rgba(0,0,0,1);
  font-size: 50px;
  font-weight: 700;
  /* 文字居中 */
  text-align: center;
  line-height: 80px;
  transition: background-color 0.18s ease-in-out, font-size 0.18s ease-in-out, transform 0.18s linear;
}
.trans-scale {
  animation-name: overlap;
  animation-timing-function: linear;
  animation-iteration-count: 1;
  animation-duration: 0.5s;
}
@keyframes overlap {
  from {
    transform: scale(1);
  }
  20% {
    transform: scale(1.1);
  } 
  40% {
    transform: rotate(3deg);
  }
  60% {
    transform: rotate(-3deg);
  }
  80% {
    transform: rotate(0);
  }
  to {
    transform: scale(1);
  }

}
.grid-cell {
  background-color: #CDC1B4;
}
.number-cell {
  width: 80px;
  height: 80px;
  /* transition: transform 0.2s; */
  /* background-color: rgb(204, 238, 51); */
}
.number-cell2 {
  color: #776E66;
  background-color: #EEE4DA;
}
.number-cell4{
color: #776E66;
background-color: #EDE0C8;
}
.number-cell8{
color: #F9F6F2;
background-color: #F2B179;
}
.number-cell16 {
color: #F9F6F2;
background-color: #F59563;
}
.number-cell32 {
color: #F9F6F2;
background-color: #F67D60;
}
.number-cell64 {
color: #F9F6F2;
background-color: #F65E3B;
}
.number-cell128 {
color: #F9F6F2;
background-color: #ecd27b;
font-size: 35px;
}
.number-cell256 {
color: #F9F6F2;
background-color: #EDCD61;
font-size: 35px;
}
.number-cell512 {
color: #F9F6F2;
background-color:  #e4c049;
font-size: 35px;
}
.number-cell1024 {
color: #F9F6F2;
background-color: #dab22f;
font-size: 35px;
}
.number-cell2048 {
color: #F9F6F2;
background-color: rgb(255, 187, 85);
font-size: 35px;
}
</style>
