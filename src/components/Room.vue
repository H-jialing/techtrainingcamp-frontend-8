<template>
<div>
    <div v-if="!this.showGame">
        <div>房间号 :{{roomId}}</div>
        <br>
        <div>我的昵称 :{{myName}}</div>
        <br>
        <div>我的权限:
            <div v-if="this.power == 1"> 房主</div>
            <div v-else>房客</div>
        </div>
        <br>
        <div>
            <div v-if="mateName === ''">
                    正在对待对手...
            </div>
            <div v-else>
                    对手昵称: {{ mateName }}
            </div>
        </div>
        <br>
        <!-- 这里棋盘显示的逻辑可以再优化一下 -->
        <button @click="startGame">开始游戏</button>
        <br>
        <button v-if="this.power == 1 && !this.level" @click="changeLevel(1)">难度设置</button>
        <div v-if="this.level && !this.showGame">
            <!-- 这里可以给被选择的按钮加个高亮什么的 -->
            <button @click="changeLevel(1)">easy</button>
            <button @click="changeLevel(2)">middle</button>
            <button @click="changeLevel(3)">high</button>
        </div>
        <br>
        <button v-if="!this.showGame" @click="leaveRoom">退出房间</button>
    </div>
    
    <div v-if="this.showGame">
        <div class="roomTop">
            <div class="roomName">
                <p class="roomPstyle">房间名称：{{roomId}}</p>
            </div>
            <div class="Opponent">
                <div class="OpponentTop">
                    <div class="avatarOpponent">
                        <img src="../assets/img/boy.png" class="avatar">
                    </div>
                    <div class="messageOpponent">
                        <div class="commentOpp">
                            <input ref="inputBox" v-model="receiveText" autofocus class="inputOpp" readonly="true">
                        </div>
                    </div>
                </div>
                <div class="nameOpponent"> 
                    <p class="roomPstyle">对手昵称：{{mateName}}</p>
                </div>
                <div class="scoreOpponent">
                    <p class="roomPstyle">对手得分：{{mateScore}}</p>
                </div>
            </div>
        </div>
        <Gameboard v-if="this.showGame" :level="level" :changeScore="changeScore" :mateScore="mateScore"
            @scoreChange="punishment" @initchangeScore="initchangeScore"
            @newScore="sendScore"   @gameover="gameOver"> 
        
        </Gameboard>
        <div class="roomDown">
            <div class="my">
                <div class="avatarMy">
                    <img src="../assets/img/girl.png" class="avatar">
                </div>
                <div class="messageMy">
                    <div class="commentMy">
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
            <div class="nameMy"> 
                <p class="roomPstyle">我的昵称：{{myName}}</p>
            </div>
            <div class="scoreMy">
                <p class="roomPstyle">我的得分：{{myScore}}</p>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { alert, closewin } from '../assets/utils'
import Gameboard from '../components/Gameboard'
import io from 'socket.io-client'

// 建立socket.io通信
const socket = io.connect('http://127.0.0.1:8081')

export default {
    data() {
        return {
            myName: '',
            mateName: '',
            roomId: '',
            power: null,     //1为房主，0为房客
            showGame: false,
            // ------ 用level作为选择难度的变量，这里直接用的父子组件间的传值
            // ---- 是只有房主有权利选择难度吗？
            level: 0,
            inputText: '',
            receiveText: '',
            mateScore: 0,
            myScore: 0,
            changeScore: 0  //接收对方的惩罚块
        }
    },
    components: {
        Gameboard
    },
    beforeRouterEnter(to, from, next) {
        if (!localStorage.nickName || !localStorage.roomId) {
        next('/')
        } else {
        next()
        }
    },
    mounted() {
        //加入房间
        socket.emit('joinRoom',
            { "playerName": this.myName, "roomId": this.roomId},
            (res) => {  //根据回调的power进入不同组件(房主/房客)
                res.permission === 1 
                ? this.power = 1
                : this.power = 0
            }
        ),

        //房间已满，无法加入
        socket.on("full", data => {
            
            this.$router.push({
                path: "/"   
            })
            alert(data.roomId + "房间已满，无法加入！")
        }),

        //房间内有两个人时，获取两个人的消息
        socket.on("findmate", data => {
            console.log("match！");
            if(this.power == 1){    //如果我是房主
                this.mateName = data.unholder
            }
            else {                  //如果我是房客
                this.mateName = data.holder
            }

        }),
        //房主接收房客离开房间的消息
        socket.on("memberleave", data => {
            if(this.power == 1){
                alert("你的对手离开了游戏")
                this.mateName = ''
            }
        }),

        //所有客户端都监听服务器发送的“开始游戏”信号
        socket.on("start", data => {
            this.showGame = 1
            alert("Game Start!")
        }),

        //接收服务器发来的对手的消息
        socket.on("partnerMsg", data => {
            this.receiveText = data.msg
        }),

        //接受服务器发送的对手分数的更新
        socket.on("updatescore", data =>{
            console.log(data.updatescore);
            this.mateScore = data.updatescore
        })

        //接受服务器传达的，来自对手的消块信息
        socket.on("score64", data => {
            this.changeScore = 64
        }),

        //接收服务端离开房间的信号，执行离开房间
        socket.on("quit", data => {
            if(data.power == 1){    //房主解散了房间
                
                this.$router.push({
                    path: "/"
                })
                alert("房主已解散该房间！")
            }
            else{   //房客退出了房间
                
                this.$router.push({
                    path: "/"
                })
                alert("退出了该房间！")
            }
        })

    },

    created() {
        //从vuex中拿到用户昵称和房间id
        this.myName = this.$store.state.nickName   
        this.roomId = this.$store.state.roomId  
    },

    computed: {
        clickable() {
            return this.inputText.length > 0
        }
    },

    methods: {
        //向服务器发送离开房间的请求
        leaveRoom() {
            socket.emit("leaveRoom",{"roomId": this.roomId, "playerName": this.myName, "power": this.power})
        },
        //只有房主才有此方法。点击开始游戏，让服务端向所有房间内客户端发送一个开始游戏的命令
        startGame() {
            socket.emit("startGame",{"roomId": this.roomId})
        },
        //改变游戏难度
        changeLevel(level) {
          this.level = level
        },

        //发送给对方自己的分数变化
        sendScore(score) {
            socket.emit("newscore",{"roomId": this.roomId, "score": score})
        },

        //A完成了一个大块，发送惩罚消息给B执行
        punishment(score) {
            console.log("惩罚");
            socket.emit("scorechange",{"roomId": this.roomId, "score": score})

        },
        //当完成一次惩罚后，重置changeScore
        initchangeScore() {
            this.changeScore = 0
        },

        //发送给对方消息
        sendMsg() {
            socket.emit("send",
                {"roomId": this.roomId, "msg": this.inputText},
                (res) => {
                    this.inputText = ''
                })
        },

        //游戏结束时，告诉服务器让用户离开
        gameOver() {
            socket.emit("gameover", {"roomId": this.roomId, "playerName": this.myName, "power": this.power})
        }
    }
    
}
</script>

<style scoped>
    /* 对方样式 */
    .roomPstyle{
        white-space: nowrap;
        color: #766E66;
    }
    .roomTop{
        width: 500px;
        height: 150px;
        margin: 0 auto;
    }
    .roomName{
        height: 20%;
        text-align: center;
    }
    .Opponent{
        height: 80%;
    }
    .OpponentTop{
        height:60%;
    }
    .avatarOpponent{
        height: 100%;
        width: 20%;
        float: left;
    }
    .avatar{
        height: 100%;
    }
    .messageOpponent{
    width: 75%;
    height: 100%;
    float: right; 
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
    .nameOpponent{
        height: 20%;
    }
    .scoreOpponent{
        height: 20%;
    }

    /* 己方样式 */
    .roomDown{
        width: 500px;
        height: 150px;
        margin: 0 auto;
    }
    .my{
        margin-top: 5%;
        height: 48%;
    }
    .avatarMy{
        height: 100%;
        float: right;
    }
    .messageMy{
        height: 100%;
        width: 80%;
    }
    .commentMy{
        position: relative;
        width: 50%;
        height: 65%;
        background: #8C7B69;
        border-radius: 5px;
        margin-top: 3%;
        float: right;
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
        margin-top: 8%;
        margin-left: 8%;
        width: 60%;
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
        margin-left: 2%;
    }
    .nameMy{
        margin-left: 80%;
        float: right;
    }
    .scoreMy{
        float: right;
    }
</style>