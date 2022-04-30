<template>
	<div class="full-screen-loader" :style="`pointer-events:${show ? 'initial' : 'none'}`">
        <transition name="slide-fade" mode="out-in">
            <div class="full-screen-loader-inner" :style="styles" v-if="show">
                <div class="row h-75 justify-content-center">
                    <div class="col-10 align-self-center text-center">
                        <p class="full-screen-loader-message mb-3 text-white">{{ message }}</p>
                        <b-spinner style="width: 3rem; height: 3rem;" variant="light" type="grow"></b-spinner>
                    </div>
                </div>
            </div>
        </transition>
	</div>
</template>

<script>


export default {
    name: 'full-screen-loader',
    props: {
        width: { type: Number, default: 720 },
        height: { type: Number, default: 576 },
        message: {type : String, default: "Loading..." },
        show: {type : Boolean, default: false },
    },
    computed: {
        styles () {
            return `width:${this.width}px;height:${this.height}px`;
        },
        
    },
}
</script>

<style scoped lang="scss">
    @import '../scss/variables.scss';

    .full-screen-loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: transparent;
        z-index: 9999999;
        text-align: center;

        &::before {
            content:"";
            position: relative;
            display: inline-block;
            vertical-align: middle;
            width:0px;
            height: 100%;
            z-index: 2;
        }

        .full-screen-loader-inner {
            position: relative;
            display: inline-block;
            vertical-align: middle;
            width: 720px;
            height: 576px;
            max-height:calc(100% - 60px);
            background-color:rgba(0,0,0,0.7);
            border-radius: 5px;
            overflow: hidden;
            box-shadow: $shadow-card-2;
            transition: all 0.1s cubic-bezier(.25,.8,.25,1);
            z-index: 2;

            &.slide-fade-enter-active {
                transition: opacity 100ms linear;
            }

            &.slide-fade-leave-active {
                transition: opacity 100ms linear;
            }

            &.slide-fade-enter {
                opacity: 0;
            }

            &.slide-fade-leave-to {
                opacity: 0;
            }
        }   
    }
</style>
