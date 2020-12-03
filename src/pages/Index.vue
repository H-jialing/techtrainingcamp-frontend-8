<template>
    <div class="wrapper">
        <div class="index-wrap">
            <h1 class="title">2048</h1>
            <div class="btn-wrap" :class="{'blur': dialog || showAbout}">
                <button class="indexButton" @click="showDialog">联机游戏</button>
                <button class="indexButton" @click="startGame">单人游戏</button>
                <button class="indexButton" @click="() => showAbout = true">About</button>
            </div>
        </div>

        <transition name="slide-fade">
            <div class="pop-up" v-show="dialog" key="fade">
                <div class="pop-wrap">
                    <input class="menu-input" v-model="nickName" placeholder="请输入个人昵称">
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
                        <template v-for="item of aboutInfo">
                            <div :key="item.title">
                                <p class="about-title">{{item.title}}</p>
                                <template v-for="value of item.content">
                                    <p class="about-content" :key="value">{{value}}</p>
                                </template>
                            </div>
                        </template>
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
            showAbout: false,
            aboutInfo: [
                {
                    title: '小组成员：',
                    content: ['谭惟予、张开心、赵文涵、黄佳玲']
                },
                {
                    title: '游戏介绍：',
                    content: [
                        '2048是一款风靡全球的经典小游戏，最初的开发者是20岁的Gabriele Cirulli。初衷就是觉得好玩，在将其开源版本放到Github上后，意外走红。这款游戏的玩法很简单，每次可以选择上下左右滑动，每滑动一次，所有的数字方块都会往滑动的方向靠拢，系统也会在空白的地方乱数出现一个数字方块，相同数字的方块在靠拢、相撞时会相加。不断的叠加最终拼凑出2048这个数字就算成功。',
                        '本项目在经典2048小游戏基础上，又增加了限时模式、速度模式，同时还具备双人对战模式，满足不同场景下的娱乐需求。话不多说，赶紧试玩一下吧~'
                    ]
                }
            ]
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
$content-width: 40vw;
%position-center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
%triangle-tip {
    content: '';
    display: inline-block;
    width: 0;
    height: 0;
    border: 5px solid #bcae9f;
    border-color: transparent transparent transparent #bcae9f;
}
.wrapper {
    position: fixed;
    width: 100%;
    height: 100%;

    .index-wrap {
        width: 60%;
        height: 80%;
        position: relative;
        @extend %position-center;
        display: flex;
        justify-content: center;
        align-content: center;

        .title {
            position: absolute;
            font-size: 8rem;
            color: #766E66;
        }

        .btn-wrap {
            @extend %position-center;
            width: $content-width;

            .indexButton {
                width: 100%;
                padding: 0.6rem 0;
                font-size: 2rem;
                background-color: #8C7B69;
                color: #F9F6F3;
                border-radius: 1rem;
                border-width: 0;
                margin: 1.5rem 0;
                cursor: pointer;
            }
            .indexButton:hover {
                background-color: #EBE0CB;
                color: #766E66;
                font-weight: bolder;
            }
        }
        .blur {
            filter: blur(5px);
        }
    }
}

.pop-up {
    @extend %position-center;
    z-index: 999;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.3);
    // filter: blur(5px);

    .pop-wrap {
        @extend %position-center;
        width: $content-width;
    }

    .show-about-wrap {
        font-size: 2rem;
        color: #EBE0CB;
        font-weight: bold;
        font-style: italic;
        width: 80%;
        background-color: rgba(255,255,255,0.1);
        box-shadow: 2px 3px 28px 16px;
    }
}

.pop-wrap {

    .menu-input {
        width: 100%;
        height: 45px;
        font-size: 1rem;
        border-radius: 10px;
        margin: 1rem 0;
        border: 0.4rem solid #E9CF7F;
        box-sizing: border-box;
        color: #d7920e;
        padding: 0 1rem;
    }
    .menu-btn-wrap {
        display: flex;
        justify-content: space-between;

        .menu-btn {
            padding: 0 10px;
            padding: 0.5rem;
            font-size: 1.3rem;
            background-color: #8C7B69;
            color: #F9F6F3;
            border-radius: 10px;
            border-width: 0;
            width: 45%;
        }
    }
}

.pop-wrap {

    .text-wrap {
        padding:10px 10px;

        .about-title {
            border-bottom: 1px solid #efdbaa;
            padding: 5px;
            margin-bottom: 10px;
        }
        .about-content {
            font-size: 1rem;
            font-weight: normal;
        }
        .about-content::before {
            @extend %triangle-tip;
        }
    }
    .about-btn {
        float: right;
        background: transparent;
        color: #bcae9f;
        margin: 1rem;
        font-size: 1.3rem;
    }
    .about-btn::before {
        @extend %triangle-tip;
    }
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