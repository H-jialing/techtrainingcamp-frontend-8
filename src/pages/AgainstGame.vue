<template>
    <div>
        <div>房间号: {{roomId}}</div>
        <!-- 11.28 对战模式，隐去开始游戏按钮 -->
        <button class="start" @click="startGame" v-if="!isStart">开始游戏</button>
        <button class="back" @click="() => this.$router.replace('/')">退出房间</button>
        
        <div class="mode-wrap">
            <div>难度设置</div>
            <ul>
                <li v-for="(item, index) in modeItem" :key="item.mode">
                    <button :class="{'active': item.isModeActive}" @click="modeClick(index)">{{item.mode}}</button>
                </li>
            </ul>
        </div>

        <div class="score-wrap">
            <div class="classic">
                <div class="classic-wrap my-score">
                    <p>我的分数</p>
                    <p v-if="inited">{{this.$refs.gameboard.myScore}}</p>
                </div>
                <div class="classic-wrap your-score">
                    <p>对方分数</p>
                    <p>{{yourScore}}</p>
                </div>
            </div>

            <div class="timer-wrap">
                <div v-if="!isStart" class="limit-clock">
                    <p>设置时间</p>
                    <input v-model="limitTime" type="text">
                </div>
                <div v-else class="limit-clock">
                    <p>剩余时间</p>
                    <p>{{this.$refs.gameboard.time}}</p>
                </div>
            </div>
        </div>

        <div class="player1">
            <div class="picture">
                <div class="character">{{character === 1 ? '房客' : '房主'}}</div>
            </div>
            <div class="nickname">{{myName}}</div>
        </div>

        <div class="player2">
            <div class="picture">
                <div class="character">{{character === 1 ? '房主' : '房客'}}</div>
            </div>
            <div class="nickname">{{myName}}</div>
            
        </div>

        <!-- <div>等待对手。。。</div> -->
        <!-- 11.28 删除监听事件 -->
        <GameBoard :level='mode' :type='1' :setTime='limitTime' @gameOver="gameOver" class="game" ref="gameboard" />

        <!-- <Room /> -->
        <!-- 11.28 未做：在gameover和succes函数中控制游戏结果显示变量 
        -->
        <div class="result-wrap" v-if="scoreShow">
            我的分数：{{this.$refs.gameboard.myScore}} VS 对手的分数：{{yourScore}}
            <div>
                <button @click="() => scoreShow = false">返回</button>
            </div>
        </div>
    </div>
</template>

<script>
import GameBoard from '../components/Gameboard'
import Room from '../components/Room'
export default {
    components: {
        GameBoard,
        Room
    },
    data () {
        return {
            roomId: 1,
            myName: 'nickname',
            character: 1,
            myScore: 0,
            yourScore: 0,
            limitTime: 10,
            isStart: false,
            modeItem: [
                {
                    mode: '简单模式',
                    isModeActive: false
                }, 
                {
                  // 11.28
                    mode: '正常模式',
                    isModeActive: true
                }, 
                {
                    mode: '困难模式',
                    isModeActive: false
                }
            ],
            // 11.28 不能在一开始就展示分数，否则 this.$ref 取不到
            scoreShow: false,
            // 11.28 模式选择
            mode: 1,
            inited: false
        }
    },
    mounted() {
        // this.myScore = this.$route.params.myScore
        // this.yourScore = this.$route.params.mateScore
        this.inited = true
    },
    methods: {
        startGame () {
            this.$refs.gameboard.init()
            this.isStart = true
        },
        modeClick (index) {
            this.modeItem.forEach((item, indx) => {
                if (index === indx) {
                    this.mode = index
                    item.isModeActive = true
                } else {
                    item.isModeActive = false
                }
            })
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
    margin: 5px 0;
}
%position-center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
.player1,
.player2 {
    position: absolute;
    box-sizing: border-box;
    border: 1px solid black;
    width: 70px;
    text-align: center;

    .picture {
        // box-sizing: border-box;
        width: 100%;
        height: 50px;
        border: 1px solid black;
    }
}
.player1 {
    top: 80px;
    left: 30px;
}
.player2 {
    bottom: 30px;
    right: 30px;
}
.start, 
.back {
    @extend %default-button;
    width: 80px;
    font-size: 16px;
    display: block;
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
    .active {
        color: red;
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
.my-score {
    right: 100px;
}
.your-score {
    right: 180px;
}
.limit-clock {
    right: 20px;
    input {
        width: 70px;
        text-align: center;
        font-size: 16px;
        color: red;
        border: 1px solid red;
        border-radius: 5px;
    }
}
.game {
    position: absolute;
    bottom: 136px;
    left: 19px;
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