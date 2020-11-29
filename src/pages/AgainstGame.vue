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

        <div class="playerTop">
            <div class="player1">
                <div class="picture">
                    <div class="character">{{character === 1 ? '房客' : '房主'}}</div>
                    <div class="avatarOpponent">
                        <img src="../assets/img/boy.png" class="avatar">
                    </div>
                </div>
                <div class="nickname">{{myName}}</div>
            </div>
            <div class="messageOpponent">
                <div class="commentOpp">
                      <input ref="inputBox" v-model="receiveText" autofocus class="inputOpp" readonly="true">
                </div>
            </div>
        </div>

        <!-- <div>等待对手。。。</div> -->
        <!-- 11.28 删除监听事件 -->
        <GameBoard :level='mode' :type='1' :setTime='limitTime' @gameOver="gameOver" class="game" ref="gameboard" />

        <!-- <Room /> -->
        <!-- 11.28 未做：在gameover和succes函数中控制游戏结果显示变量 
        -->

        <div class="playerDown">
            <div class="player2">
                <div class="picture">
                    <div class="character">{{character === 1 ? '房主' : '房客'}}</div>
                    <div class="avatarMy">
                        <img src="../assets/img/girl.png" class="avatar">
                    </div>
                </div>
                <div class="nickname">{{myName}}</div>
            </div>
            <div class="messageMy">
                <div class="commentMy">
                    <transition name="slide-bottom">
                        <div v-show="isShowEmoji" class="emoji-display">
                            <ul>
                                <li @click="insertText(item)" v-for="item of emojis">{{item}}</li>
                            </ul>
                        </div>
                    </transition>
                    <div class="emoji">
                        <i @click="showEmoji(isShowEmoji=!isShowEmoji);" class="icon-emoji"></i>
                    </div>
                        <input ref="inputBox"
                        v-model="inputText"
                        @keyup.enter="sendMsg"
                        placeholder="请输入聊天内容"
                        autofocus
                        class="inputMy">
                        <button
                        :class="{'clickable': clickable}"
                        @click="sendMsg" class="buttonInput"
                        >发送</button>
                    </div>
                </div>
        </div>

        
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
            emojis: ['😂', '🙏', '😄', '😏', '😇', '😅', '😌', '😘', '😍', '🤓', '😜', '😎', '😊', '😳', '🙄', '😱', '😒', '😔', '😷', '👿', '🤗', '😩', '😤', '😣', '😰', '😴', '😬', '😭', '👻', '👍', '✌️', '👉', '👀', '🐶', '🐷', '😹', '⚡️', '🔥', '🌈', '🍏', '⚽️', '❤️', '🇨🇳'],
            isShowEmoji: false,
            oTextarea: {},
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
        this.isShowEmoji = false
        this.oTextarea = document.querySelector('input');
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
        },
        
        // 表情
        showEmoji(flag) {
            this.isShowEmoji = flag;
            alert(this.isShowEmoji)           
        },
        insertText(str) {
            str = str + ` `;
            const oTextarea = this.$refs.inputBox;

            if (document.selection) {
                let sel = document.selection.createRange();
                sel.text = str;
            } else if (typeof oTextarea.selectionStart === 'number' && typeof oTextarea.selectionEnd ==='number') {
                let startPos = oTextarea.selectionStart;
                let endPos = oTextarea.selectionEnd;
                let cursorPos = startPos;
                let tempVal = oTextarea.value;
                this.inputContent = tempVal.substring(0, startPos) + str + tempVal.substring(startPos, tempVal.length)
                cursorPos += str.length;
                oTextarea.selectionStart = oTextarea.selectionEnd = cursorPos;

            } else {
                oTextarea.value += str;
            }
            this.newLine();
        },
        newLine() {
            setTimeout(() => this.oTextarea.scrollTop = this.oTextarea.scrollHeight, 0);
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
.playerTop{
    width: 100%;
}
.playerDown{
    position: absolute;
    bottom: 30px;
    right: 0px;
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
    bottom: 0px;
    right: 0px;
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
.avatarOpponent{
    height: 31px;
}
.avatar{
   height: 85%;
}
.avatarMy{
    height: 31px;
}
.messageOpponent{
    width: 75%;
    height: 100%;
    margin-left: 150px; 
}
.commentOpp {
    position: relative;
    width: 200px;
    height: 50px;
    background: #8C7B69;
    border-radius: 5px;
    margin-top: 16px;
} 
.commentOpp:before {
    content: '';
    position:absolute;
    top: 16px;
    left: -4px;
    width: 16px;
    height: 16px;
    transform: rotate(45deg);
    background-color: #8C7B69;
}
.inputOpp{
    background:none;  
    outline:none;  
    border:none;
    width: 100%;
    margin-top: 5%;
    margin-left: 8%;
    height: 60%;
    color:#F9F6F3;
    font-size: 16px; 
}
.messageMy{
    margin-right: 100px;
    margin-bottom: 70px;   
}
.commentMy{
    position: relative;
    width: 260px;
    background: #8C7B69;
    border-radius: 5px;
    margin-top: 3%;
    float: right;
    height: 50px;
}
.commentMy:before {
    content: '';
    position:absolute;
    top: 16px;
    right: -4px;
    width: 16px;
    height: 16px;
    transform: rotate(45deg);
    background-color: #8C7B69;
}
.inputMy{
    background:none;
    border:none;
    outline:none;
    color:#F9F6F3;
    margin-top: 7%;
    width: 50%;
    font-size: 16px;
}
.inputMy::placeholder{
    color: #F9F6F3;
}
.buttonInput{
    padding: 0 3%;
    height: 60%;
    font-size: 14px;
    background-color: #F9F6F3;
    color: #8C7B69;
    border-radius: 10px;
    border-width: 0;
}
.emoji-display {
    position: absolute;
    width: 100%;
    height: 210px;
    background-color: white;
    top: -210px;
    left: 0;
      overflow-y: auto;
    ul {
        display: flex;
        flex-wrap: wrap;
        li {
            padding: 2px 3px;
            font-size: 2.2rem;
          }
        }
      }
.emoji {
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 5px;
    margin-top: 10px;
    width: 30px;
    height: 30px;
    background-color: #8C7B69;
    .icon-emoji {
        width: 40px;
        height: 100%;
        background: url('../assets/icons/icon-emoji.svg') no-repeat;
        background-size: contain;
        }
      }
</style>