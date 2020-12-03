<template>
  <div class="wrapper">
    <div class="container grid-container" ref='gridRef'>
      <div class="container number-container" ref='numberRef'></div>
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
import { clearPoint, getRandom, getNum, canMoveLeft, canMoveRight, canMoveUp, canMoveDown, noBlockHorizontal, noBlockVertical, generateOneNum, HorAnimation, VerAnimation, EventUtil, } from '../assets/utils'
export default {
  name: 'gameBoard',
  props: ['level', 'type', 'setTime', 'changeScore'],
  data: () => {
    return {
      // 保存的dom元素
      numberRef: null,
      gridRef: null,
      // 初始化矩阵和积分板
      point: [],
      myScore: 0,
      scoreChange: 0,
      // 定义定时器
      time: 200,
      timer: null,
      count: 5,
      timeOut: null,
      total: 0,
      totalTime: null,
      // 其他辅助参数和变量
      reg: new RegExp(' trans-scale'),
      anima: [],
      isStart: false,
      eventUtil: null,
      touchEvent: null,
      keyEvent: null,
      rich: 0,
      winFlag: false,
      pointMap: null,
    }
  },
  // 要绑定的键盘时间和滑动事件初始化
  created () {
    this.eventUtil = new EventUtil(this.move)
    this.touchEvent = this.eventUtil.handleTouchEvent.bind(this.eventUtil)
    this.keyEvent = this.eventUtil.handleKeyEvent.bind(this.eventUtil)
  },
  // 得到要挂载的dom元素
  mounted () {
    this.numberRef = this.$refs.numberRef
    this.gridRef = this.$refs.gridRef
    this.rich = (this.gridRef.children[0].clientWidth - this.gridRef.children[1].clientWidth*4)/5 + this.gridRef.children[1].clientWidth
  },
  watch: {
    // 模式转换的时候，清除上一个模式遗留的计时器并恢复变量
    type: {
      handler (type) {
        if (this.point.length > 0) {
          this.myScore = 0
          this.total = 0
          if(this.setTime) this.time = this.setTime * 60
          else this.time = 200            
          this.count = 5
          clearPoint(this.point, this.anima)
          this.freshGrid()
        }
        this.clearTime()
      },
    },
    myScore: {
      handler (myScore) {
        this.$emit("newScore", myScore)
      }
    },
    scoreChange: {
      handler (scoreChange) {
        if (scoreChange >= 8) {
          this.$emit('scoreChange', scoreChange)
        }
      }
    },
    changeScore: {
      handler (newval, oldval) {
        if (newval === 8 && this.pointMap.has(newval*2)) {
          const l = this.pointMap.get(newval)
          this.numberRef.children[l[0] * 4 + l[1]].innerHTML = newval
          this.point[l[0]][l[1]] = newval
        }
        this.$emit('initchangeScore')
      }
    },
    // 限时模式和pk模式中，时间耗尽，发送游戏结束事件，移除事件绑定，清除计时器
    time: {
      handler (time) {
        if (time <= 0) {
          this.sendOver()
        }
      }
    },
    // pk模式下设置时间
    setTime: {
      handler (setTime) {
        if (setTime !== '') {
          this.time = this.setTime * 60
        }
      }
    }
  },
  methods: {
    // 速度模式的计时器
    speedMode () {
      this.count = 5
      clearInterval(this.timeOut)
      this.timeOut = setInterval(() => {
        this.count--
        if (this.count == 0) {
          this.sendOver()
        }
      }, 1000)
    },
    // 初始化函数
    init () {
      // 重置所有变量
      if(this.type === 1) this.isStart = true
      this.myScore = 0
      this.winFlag = false
      this.pointMap = new Map()  
      this.count = 5
      if(this.setTime) this.time = this.setTime * 60
      else this.time = 200            
      this.clearTime()
      clearPoint(this.point, this.anima)
      this.freshGrid()
      // 监听事件
      document.addEventListener("touchstart",  this.touchEvent, { passive: false })
      document.addEventListener("touchend", this.touchEvent, { passive: false })  
      document.addEventListener("touchmove", this.touchEvent, { passive: false }) 
      document.addEventListener("keydown", this.keyEvent, { passive: false })
      // 生成两个初始随机数
      const x1 = getRandom()
      const y1 = getRandom()
      const x2 = getRandom()
      const y2 = getRandom()
      this.point[x1][y1] = getNum(1)
      this.point[x2][y2] = getNum(1)
      if (!(x1 === x2) || y1 !== y2) {
        // 开启全局计时
        this.totalTime = setInterval(() => {
          this.total += 1
        }, 1000)
        this.numberRef.children[x1 * 4 + y1].innerHTML = this.point[x1][y1]
        this.numberRef.children[x1 * 4 + y1].setAttribute('class', 'cell number-cell' + this.point[x1][y1])
        this.numberRef.children[x2 * 4 + y2].innerHTML = this.point[x2][y2]
        this.numberRef.children[x2 * 4 + y2].setAttribute('class', 'cell number-cell' + this.point[x2][y2])
        // 开启限时计时
        if (this.type == 1 && this.isStart) {
          this.timer = setInterval(() => {
            this.time = this.time - 1
          }, 1000)
        }
        if (this.isStart) this.isStart = false
      } else {
        this.init()
      }
    },
    // 根据移动方向调用不同的函数
    move (direction) {
      switch (direction) {
        case 'left':
          if (canMoveLeft(this.point)) {
            this.moveLeft()          
            this.freshMove() 
          } else {
            this.isGameOver()
          }
          break
        case 'up':
          if (canMoveUp(this.point)) {
            this.moveUp()
            this.freshMove() 
          } else {
            this.isGameOver()
          }
          break
        case 'right':
          if (canMoveRight(this.point)) {
            this.moveRight()
            this.freshMove()
          } else {
            this.isGameOver()
          }
          break
        case 'down':
          if (canMoveDown(this.point)) {
            this.moveDown()
            this.freshMove()
          } else {
            this.isGameOver()
          }
          break
        default: break
      }
    },
    moveLeft () {
      for (let i = 0; i < 4; i++) {
        let addable = true
        let lastPoint
        for (let j = 1; j < 4; j++) {
          if (this.point[i][j] !== 0) {
            for (let k = 0; k < j; k++) {
              if (this.point[i][j] !== 0 && this.point[i][k] === 0 && noBlockHorizontal(this.point, i, k, j)) {
                this.point[i][k] = this.point[i][j]
                this.point[i][j] = 0
                HorAnimation(this.rich, this.numberRef, i, j, k)
              } else if (this.point[i][j] !== 0 && this.point[i][k] === this.point[i][j] && noBlockHorizontal(this.point, i, k, j)) {
                HorAnimation(this.rich, this.numberRef, i, j, k)
                if (addable || (this.point[i][j] != lastPoint)) {
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
      for (let j = 0; j < 4; j++) {
        let addable = true
        let lastPoint
        for (let i = 1; i < 4; i++) {
          if (this.point[i][j] !== 0) {
            for (let k = 0; k < i; k++) {
              if (this.point[i][j] !== 0 && this.point[k][j] === 0 && noBlockVertical(this.point, j, k, i)) {
                VerAnimation(this.rich, this.numberRef, i, j, k)
                this.point[k][j] = this.point[i][j]
                this.point[i][j] = 0
                continue
              } else if (this.point[i][j] !== 0 && this.point[k][j] === this.point[i][j] && noBlockVertical(this.point, j, k, i)) {
                VerAnimation(this.rich, this.numberRef, i, j, k)
                if (addable || (this.point[i][j] != lastPoint)) {
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
      for (let i = 0; i < 4; i++) {
        let addable = true
        let lastPoint
        for (let j = 2; j >= 0; j--) {
          if (this.point[i][j] !== 0) {
            for (let k = 3; k > j; k--) {
              if (this.point[i][j] !== 0 && this.point[i][j] !== 0 && this.point[i][k] === 0 && noBlockHorizontal(this.point, i, j, k)) { 
                this.point[i][k] = this.point[i][j]
                this.point[i][j] = 0
                HorAnimation(this.rich, this.numberRef, i, j, k)
                continue
              } else if (this.point[i][j] !== 0 && this.point[i][j] !== 0 && this.point[i][k] === this.point[i][j] && noBlockHorizontal(this.point, i, j, k)) {
                HorAnimation(this.rich, this.numberRef, i, j, k)
                if (addable || (this.point[i][j] != lastPoint)) {
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
      for (let j = 0; j < 4; j++) {
        let addable = true
        let lastPoint
        for (let i = 2; i >= 0; i--) {
          if (this.point[i][j] !== 0) {
            for (let k = 3; k > i; k--) {
              if (this.point[i][j] !== 0 && this.point[k][j] === 0 && noBlockVertical(this.point, j, i, k)) {
                VerAnimation(this.rich, this.numberRef, i, j, k)
                this.point[k][j] = this.point[i][j]
                this.point[i][j] = 0
                continue
              } else if (this.point[i][j] !== 0 && this.point[k][j] === this.point[i][j] && noBlockVertical(this.point, j, i, k)) {
                VerAnimation(this.rich, this.numberRef, i, j, k)
                if (addable || (this.point[i][j] != lastPoint)) {
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
    // 每次都更新格子
    freshGrid () {
      this.pointMap.clear()
      this.numberRef.innerHTML = ''
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          const el = document.createElement('div')
          if (this.point[i][j] === 0) {
            el.className = 'number-cell'
          } else {
            if (this.point[i][j] === 2048) this.winFlag = true
            if (this.point[i][j] >= 64) this.pointMap.set(this.point[i][j], [i, j])
            // 给新合成的数字格子添加合成效果动画
            if (this.anima[i][j]) {
              el.className = 'cell number-cell' + this.point[i][j] + ' trans-scale'
              this.anima[i][j] = false
              // 监听动画结束事件，在动画结束后，去除添加的合成动画
              el.addEventListener('animationend', () => {          
                el.className = el.className.replace(this.reg, '')
              })
            } else {
              el.className = 'cell number-cell' + this.point[i][j]
            }
            el.innerHTML = this.point[i][j]
          }
          this.numberRef.appendChild(el)
        }
      }
      if (this.winFlag) this.sendOver()
    },
    // 给合成动画添加时延，使动画能够顺利展示
    freshMove () {
      if (this.type == 2) this.speedMode()
      setTimeout(() => {
        this.freshGrid()
      }, 220) 
      setTimeout(() => {
        if (this.level == 2) generateOneNum(this.point, this.numberRef, this.level)
        generateOneNum(this.point, this.numberRef, this.level)
      }, 300)
    },
    // 没有可移动的地方时，宣布游戏结束
    isGameOver () {
      if (!canMoveLeft(this.point) && !canMoveRight(this.point) && !canMoveUp(this.point) && !canMoveDown(this.point)) {
        this.sendOver()
      }
    },
    // 游戏结束后要调用的一系列函数，清除定时器、移除绑定事件
    sendOver () {
      this.$emit("gameOver")
      this.clearTime()
      this.removeEvent()
    },
    removeEvent () {
      document.removeEventListener("touchstart",  this.touchEvent, { passive: false })
      document.removeEventListener("touchend", this.touchEvent, { passive: false })
      document.removeEventListener("touchmove", this.touchEvent, { passive: false })  
      document.removeEventListener("keydown", this.keyEvent, { passive: false }) 
    },
    clearTime () {
      if (this.timer) clearInterval(this.timer)
      if (this.timeOut) clearInterval(this.timeOut)
      if (this.totalTime) clearInterval(this.totalTime)
    }
  }
}
</script>
<style lang="scss">
$container-width: 85vw;
$container-height: 85vw;
$cell-width: 18vw;
$cell-height: 18vw;
$typical-font: 2.4rem;

.wrapper {
    .container {
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
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
      background-color: rgba(0,0,0,1);
      font-weight: 700;
      text-align: center;
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
    font-size: $typical-font;
    }
    .number-cell256 {
    color: #F9F6F2;
    background-color: #EDCD61;
    font-size: $typical-font;
    }
    .number-cell512 {
    color: #F9F6F2;
    background-color:  #e4c049;
    font-size: $typical-font;
    }
    .number-cell1024 {
    color: #F9F6F2;
    background-color: #dab22f;
    font-size: $typical-font;
    }
    .number-cell2048 {
    color: #F9F6F2;
    background-color: rgb(255, 187, 85);
    font-size: $typical-font;
    }
  }

@media only screen and (max-width: 466px){ 
  .wrapper {
    .container {
      width: $container-width;
      height: $container-height;
      max-width: 484.5px;
      max-height: 484.5px;
      min-width: 272px;
      min-height: 272px;
      padding: 9px;
      @supports (padding: calc(calc(100% - 4 * 18vw) / 5)) {
        padding: calc(calc(100% - 4 * 18vw) / 5);
      }
      @supports (padding: clamp(8.3px, calc(calc(100% - 4 * 18vw) / 5), 15.3px)) {
        padding: clamp(8.3px, calc(calc(100% - 4 * 18vw) / 5), 15.3px);
      }
      border-radius: 1rem;
    }
    .cell {
      width: $cell-width;
      height: $cell-height;
      max-width: 102px;
      max-height: 102px;
      min-width: 58px;
      min-height: 58px;
      border-radius: 1rem;
      font-size: 3.5rem;
      line-height: $cell-height;
      @supports (line-height: clamp(58px, $cell-height, 102px)) {
        line-height: clamp(58px, $cell-height, 102px);
      }
    }
    .number-cell {
      width: $cell-width;
      height: $cell-width;
      max-width: 102px;
      max-height: 102px;
      min-width: 58px;
      min-height: 58px;
    }
  }
}

@media only screen and (min-width: 466px){
  .wrapper {
    .container {
      width: 410px;
      height: 410px;
      padding: 10px;
      border-radius: 10px;
    }
    .cell {
      width: 90px;
      height: 90px;
      border-radius: 10px;
      font-size: 50px;
      line-height: 90px;
    }
    .number-cell {
      width: 90px;
      height: 90px;
    }
  }
}
</style>
