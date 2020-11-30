<template>
    <div class="wrapper">
        <h1 class="title">2048</h1>
        <div class="btn-wrap" :class="{'blur': dialog || showAbout}">
            <button class="indexButton" @click="showDialog">联机游戏</button>
            <button class="indexButton" @click="startGame">单人游戏</button>
            <button class="indexButton" @click="() => showAbout = true">About</button>
        </div>

        <transition name="slide-fade">
            <div class="pop-up" v-show="dialog" key="fade">
                <div class="pop-wrap">
                    <input class="menu-input"  v-model="nickName" placeholder="请输入个人昵称">
                    <input class="menu-input" v-model="roomId" placeholder="请输入房间名">
                    <div class="menu-btn-wrap">
                        <button class="menu-btn" :class="{'clickable': clickable}" @click="enterRoom">确定</button>
                        <button class="menu-btn" @click="dialogClose">关闭</button>
                    </div>
                </div>
            </div>
        </transition>

        <transition name="slide-fade">
            <div class="pop-up" v-show="showAbout" key="fade2">
                <div class="pop-wrap show-about-wrap">
                    <div class="text-wrap">
                        <p class="about-title">小组成员：</p>
                        <p class="about-content">jkhllfkjalkljal</p>
                        <p class="about-title">职责：</p>
                        <p class="about-content">jlakjfdf</p>
                        <p class="about-content">kfjlajfafjlf</p>
                        <p class="about-content">kjdnflajflfjsa</p>
                        <p class="about-content">kjdnflajflfjsa</p>
                    </div>
                    <button class="about-btn" @click="() => showAbout = false">返回</button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import { alert, closewin } from '../assets/utils'  

export default {
    data() {
        return{
            nickName:'',
            roomId: '',
            dialog: false,
            showAbout: false
        }
    },
    methods: {
        
        enterRoom() {
            if(!this.nickName || !this.roomId){
                alert("请补充完整信息！")
                return
            }
            
            localStorage.nickName = this.nickName
            localStorage.roomId = this.roomId
            this.$store.commit('setNickname', this.nickName)
            this.$store.commit('setRoomid', this.roomId)

            this.$router.push({
                path: "/against-game"
            })
        },

        showDialog() {
            this.dialog = true
            this.show = true
        },

        startGame() {
            this.$store.state.single = true
            this.$router.push('/single-game')
        },

        dialogClose () {
            this.dialog = false
            this.nickName = ''
            this.roomId = ''
        }
    },
 
    computed: {
        clickable() {
            return this.nickName!=undefined && this.roomId!=undefined && this.nickName.length>0 && this.roomId.length > 0
        }
    }

}
</script>

<style lang="scss" scoped>

    $content-width: 30vw;
    %position-center {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .wrapper {
        overflow:hidden;
         //  ========11.29=======   修改为固定定位
        position: fixed;
        width: 100%;
        height: 100%;
    }
    .title {
      // 11.29  修改题目的顶部距离
        margin-top: 60px;
        height: 100%;
        text-align: center;
        font-size: 72px;
        color: #766E66;
    }
    .btn-wrap {
        @extend %position-center;
        width: $content-width;
    }
    .blur {
        filter: blur(5px);
    }
    .indexButton {
        width: 100%;
        height: 45px;
        line-height: 45px;
        font-size: 2rem;
        background-color: #8C7B69;
        color: #F9F6F3;
        border-radius: 10px;
        border-width: 0;
        margin: 20px 0;
        cursor: pointer;
    }
    .indexButton:hover {
        background-color: #EBE0CB;
        color: #766E66;
        font-weight: bolder;
    }
    .pop-up {
        @extend %position-center;
        z-index: 999;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.3);
        // filter: blur(5px);
    }
    .pop-wrap {
        @extend %position-center;
        width: $content-width;
    }
    .show-about-wrap {
        font-size: 20px;
        color: #EBE0CB;
        font-weight: bold;
        font-style: italic;
        width: 80%;
        background-color: rgba(255,255,255,0.1);
        box-shadow: 2px 3px 28px 16px;
    }
    .menu-input {
        width: 100%;
        height: 45px;
        font-size: 14px;
        border-radius: 10px;
        margin: 10px 0;
        border: 3px solid #E9CF7F;
        box-sizing: border-box;
        color: #d7920e;
        padding: 0 5px;
    }
    .menu-btn-wrap {
        display: flex;
        justify-content: space-between; 
    }
    .menu-btn {
        padding: 0 10px;
        height: 35px;
        line-height: 35px;
        font-size: 16px;
        background-color: #8C7B69;
        color: #F9F6F3;
        border-radius: 10px;
        border-width: 0;
        width: 45%;
    }
    .text-wrap {
        padding:10px 10px;
    }
    .about-title {
        border-bottom: 1px solid #efdbaa;
        padding: 5px;
        margin-bottom: 10px;
    }
    .about-btn {
        float: right;
        background: transparent;
        color: #766E66;
        margin: 10px;
        font-size: 16px;
    }
    .about-btn::before {
        content: '';
        display: inline-block;
        width: 0;
        height: 0;
        border: 5px solid #766E66;
        border-color: transparent transparent transparent #766E66;
    }
    .slide-fade-enter-active {
        transition: all .3s ease;
    }
    .slide-fade-leave-active {
        transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to {
        transform: translateX(10px);
        opacity: 0;
    }
</style>