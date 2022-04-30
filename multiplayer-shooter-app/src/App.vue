<template>
    <div class="row no-gutters h-100">
        <div class="col-12 align-self-center h-100">
            <div id="app">
                <transition name="slide-fade" mode="out-in">
                    <router-view id="main-router-view"></router-view>
                </transition>
                <full-screen-loader 
                    :width.sync="this.$store.state.fullScreenLoaderWidth"
                    :height.sync="this.$store.state.fullScreenloaderHeight"
                    :message.sync="this.$store.state.fullScreenLoaderMessage"
                    :show.sync="this.$store.state.fullScreenLoaderShowing"
                ></full-screen-loader>
            </div>
	    </div>
    </div>
</template>

<style lang="scss">


// Import vue bootstrap
@import 'scss/bootstrap-overrides.scss';
@import 'scss/variables.scss';
@import '../node_modules/bootstrap/scss/bootstrap';
@import '../node_modules/bootstrap-vue/src/index.scss';


html {
    position: relative;
	display: block;
	width: 100%;
    height: 100vh;
    overflow: hidden;
    font-size: 13px;
    -webkit-user-select: none;
    -moz-user-select: none;

}
body {
    position: relative;
	display: block;
	width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: 'Exo 2', sans-serif;
    color: $text-black;
    background-color: #fff;
}
#app {
	position: relative;
	display: block;
	//width: 750px;
    //height: 540px;
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0 auto;
    background-color: #212121;

    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url("~@/assets/map.png");
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        opacity: 0.4;
        z-index: 1;
        pointer-events: none;
    }

    .weight-300 {
        font-weight: 300;
    }

    .weight-400 {
        font-weight: 400;
    }

    .weight-500 {
        font-weight: 500;
    }

    .weight-600  {
        font-weight: 600;
    }

    .weight-700 {
        font-weight: 700;
    }

    .texture-alum {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url("~@/assets/texture-alum.png");
        background-position: center;
        background-repeat: no-repeat;
        background-size: 1000px 1000px;
        pointer-events: none;
    }
}
#app #main-router-view {
    &.slide-fade-enter-active {
        transition: opacity 200ms linear, transform 200ms cubic-bezier(.2,.5,.1,1);
    }

    &.slide-fade-leave-active {
        transition: opacity 200ms linear, transform 200ms cubic-bezier(.5,0,.7,.4);
    }

    &.slide-fade-enter {
        transform-origin: 50% 50%;
        transform: translateY(6px);
        opacity: 0;
    }

    &.slide-fade-leave-to {
        transform-origin: 50% 50%;
        transform: translateY(6px);
        opacity: 0;
    }
}
.btn {
    font-weight: 400;
}
</style>
