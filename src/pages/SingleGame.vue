<template>
    <div>
        <div class="mode-wrap">
            <div>模式选择</div>
            <ul>
                <li v-for="(item, index) in modeItem" :key="item.mode">
                    <button :class="{'active': item.isModeActive}" @click="modeClick(index)">{{item.mode}}</button>
                </li>
            </ul>
        </div>
        <!-- 11.28 开始游戏，已具备重新游戏的功能 -->
        <button class="start" @click="startGame">开始游戏</button>
        <button class="back" @click="() => this.$router.replace('/')">返回菜单</button>
        
        <div class="score-wrap">
            <div class="classic">
                <div class="classic-wrap score">
                    <p>分数</p>
                    <p v-if="inited">{{this.$refs.gameboard.myScore}}</p>
                </div>
                <div class="classic-wrap best-score">
                    <p>历史最高</p>
                    <p>{{bestScore}}</p>
                </div>
            </div>

            <div class="timer-wrap">
                <div v-if="modeItem[1].isModeActive" class="limit-clock">
                    <p>限时时间</p>
                    <p>{{this.$refs.gameboard.time}}</p>
                </div>
                <div v-if="modeItem[2].isModeActive" class="clock">
                    <p>计时时间</p>
                    <p>{{this.$refs.gameboard.count}}</p>
                </div>
            </div>
        </div>
        <!-- 11.28 删除一些监听事件 -->
        <GameBoard :type="type" class="game" @gameOver="gameOver" ref="gameboard" />
        <!-- 11.28 未做：在gameover和succes函数中控制游戏结果显示变量 
        -->
        <div v-if="scoreShow" class="result-wrap">
            我的分数：{{this.$refs.gameboard.myScore}} 
            <div>
                <button @click="() => scoreShow = false">返回</button>
            </div>
        </div>
    </div>
</template>

<script>
import GameBoard from '../components/Gameboard'
export default {
    components: {
        GameBoard
    },
    data () {
        return {
            modeItem: [
                {
                  // 11.28 默认经典模式
                    mode: '经典模式',
                    isModeActive: true
                }, 
                {
                    mode: '限时模式',
                    isModeActive: false
                }, 
                {
                  // 11.28 
                    mode: '速度模式',
                    isModeActive: false
                }
            ],
            // 11.28 用不到的变量
            // score: 0,
            bestScore: 0,
            // limitTime: 0,
            // clockTime: 0,
            isGameover: true,
            // 11.28 不能在一开始就展示分数，否则 this.$ref 取不到
            scoreShow: false,
            // 11.28 新增变量
            type: 0,
            inited: false
        }
    },
    mounted() {
      // 11.28 这里 params是空对象
        // this.score = this.$route.params.myScore
        console.log(this.$refs)
        this.inited = true
        // this.score = this.$refs.gameboard.myScore
        // this.limitTime = this.$refs.gameboard.time
        // this.clockTime = this.$refs.gameboard.count
    },
    methods: {
        modeClick (index) {
            this.modeItem.forEach((item, indx) => {
                if (index === indx) {
                    this.type = index
                    console.log(this.type)
                    item.isModeActive = true
                } else {
                    item.isModeActive = false
                }
            })
        },
        startGame () {
            this.$refs.gameboard.init()
        }, 
        gameOver () {
          // 11.28 加上游戏结束动画／弹窗
          this.scoreShow = true
        }
    }
}
</script>

<style lang="scss" scoped>

%default-button {
    // width: 100%;
    // height: 45px;
    // line-height: 45px;
    font-size: 24px;
    background-color: #8C7B69;
    color: #F9F6F3;
    border-radius: 10px;
    border-width: 0;
    margin: 20px 0;
}
%position-center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
$button-background: #8C7B69;
// .menu-icon {
//     width: 30px;
//     height: 5px;
//     border-top: 5px solid #DD575C;
//     border-bottom: 5px solid #DD575C;
//     background-color: #DD575C;
//     padding: 5px 0;
//     background-clip:content-box;
// }
// {
//     border: 1px solid black;
//     border-radius: 10px;
//     padding: 0 5px;
// }

.start, 
.back {
    @extend %default-button;
    width: 80px;
    font-size: 16px;
}

.mode-wrap:hover{
    height: 100px;
}
.mode-wrap {
    position: absolute;
    top: 0;
    right: 20px;
    overflow: hidden;
    height: 20px;
    cursor: pointer; 
    transition: all 0.35s;
    font-size: 14px;
    background-color: #8C7B69;
    color: #F9F6F3;
    padding: 0px 5px;
    border-radius: 8px;
    border: 3px solid #E9CF7F;
    z-index: 999;

    div {
        box-sizing: border-box;
        height: 20px;
        padding: 0px 5px;
    }
    ul > li {
        box-sizing: border-box;
        height: 20px;
        margin: 5px 0;
        button {
            font-size: 14px;
            background: #766553;
            color: #EBE0CB;
            padding: 0px 5px;
        }
        button:hover {
            cursor: pointer;
            background-color: #EBE0CB;
            color: #766E66;
            font-weight: bolder;
        }
    }
    // 11.28 更改按钮样式
    .active {
        font-weight: 700;
        color: #F67D60;
    }
}
.limit-clock,
.clock,
.classic-wrap {
    position: absolute;
    border-radius: 8px;
    border: 3px solid #E9CF7F;
    top: 40px;
    text-align: center;
}
.score {
    right: 100px;
}
.best-score {
    right: 20px;
}
.limit-clock,
.clock {
    right: 150px;
}
.game {
    position: absolute;
    bottom: 42px;
    left: 20px;
}
.result-wrap {
    @extend %position-center;
    width: 200px;
    height: 200px;
    border: 1px solid black;
    background-color: rgba(0,0,0,0.5);
    z-index:10000;
    color: #fff;
}
</style>