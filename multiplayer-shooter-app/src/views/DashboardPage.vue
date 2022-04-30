<template>
    <div class="dashboard-page">
        <div class="dashboard-page-container">
            <div class="texture-alum"></div>
            <div class="dashboard-page-side-panel text-left">
                <div class="dashboard-page-side-panel-title">
                    <div class="texture-alum"></div>
                    <div class="icon"></div>
                    <div class="name h5 weight-600">2D Shooter</div>
                </div>
                <b-list-group class="dashboard-page-side-panel-nav">
                    <b-list-group-item class="item">
                        <b-link to="/dashboard/lobbies"><i class="fas fa-play mr-3"></i> Lobbies</b-link>
                    </b-list-group-item>
                    <b-list-group-item>
                        <b-link to="/dashboard/account"><i class="fas fa-user mr-3"></i> {{ this.user ? this.user.userDisplayName : '' }}</b-link>
                    </b-list-group-item>
                </b-list-group>
            </div>
            <div class="dashboard-page-content">
                <transition name="zoom-fade" mode="out-in">
                    <router-view class="router-view"></router-view>
                </transition>
            </div>
        </div>
    </div>
</template>
<script>

	/**
	 * Imports
	 */
	import { request, cancelToken } from './../helpers/request';
	import { validationMixin } from "vuelidate";
	import { required, minLength, sameAs } from "vuelidate/lib/validators";

	/**
     * Login Page
     * @version 1.0
     */
	export default {

		/**
		 * Apply validation mixin
		 */
  		mixins: [validationMixin],

		/**
		 * Data
		 */
		data: function () {
			return {
                user: null,
                requestUserCancelToken: cancelToken(),
			}
        },
        
        mounted: function () {

            // Get self
            request({
				method: 'get',
				url: 'users/self',
                cancelToken: this.requestUserCancelToken.token
			}).then((res) => {
                console.log(res);
                this.user = res.json.data;
			}).catch((err) => {
                console.warn(err);
            });

        },

        destroyed: function () {
            this.requestUserCancelToken.cancel('Request Cancelled');
        },

		/**
		 * Register validators
		 */
		validations: {
			
		},


		/**
		 * Methods
		 */
		methods: {

			/**
			 * Validate a form control
			 */
			validateFormFieldState(form, field) {
				const { $dirty, $error } = this.$v[form][field];
				return $dirty ? !$error : null;
			},

		}
	}
</script>
<style lang="scss" >
	@import '../scss/variables.scss';

    .dashboard-page {
        position: relative;
        display: block;
        width: 100%;
        height: 100%;
        font-size: 0px;
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

    }

    .dashboard-page-container {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        width: 720px;
        height: 576px;
        max-height:calc(100% - 60px);
        background-color: #FFF;
        border-radius: 5px;
		overflow: hidden;
		box-shadow: $shadow-card-2;
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
        z-index: 2;
        font-size: 13px;
        text-align: left;
        
        .dashboard-page-side-panel {
            position: relative;
            float: left;
            width: 200px;
            height: 100%;
            background-color:$game-cream;

            .dashboard-page-side-panel-title {
                position: relative;
                display: block;
                width: calc(100% - 12px);
                height: 42px;
                margin: 6px;
                padding: 0 12px 0 18px;
                background-color: #FFF;
                z-index: 2;
                border-radius: 5px;

                &::before,
                &::after {
                    content:"";
                    position: absolute;
                    top: calc(50% - 4px);
                    left: 4px;
                    width: 8px;
                    height: 8px;
                    background-color: $game-cream;
                    border-radius: 50%;
                }

                &::after {
                    left: auto;
                    right: 4px;
                }

                .icon {
                    position: relative;
                    float: left;
                    width: 42px;
                    height: inherit;
                    background-image: url("~@/assets/logo-black.png");
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: 24px;
                }

                .name {
                    position: relative;
                    float: left;
                    width: calc(100% - 42px);
                    height: inherit;
                    line-height: 42px;

                    
                }
            }

            .dashboard-page-side-panel-nav {
                position: relative;
                display: block;
                width: 100%;
                height: calc(100% - 54px);
                padding: 0px 0px 6px 0px;
                border-radius: 0px;
                border: none;
                background-color: transparent;

                .list-group-item {
                    background-color: transparent;
                    border: none;
                    padding: 3px 6px;

                    a {
                        position: relative;
                        display: block;
                        width: 100%;
                        height: 42px;
                        line-height: 42px;
                        padding: 0px 12px;
                        color: #333333;
                        text-decoration: none;
                        background-color: transparent;
                        transition: background-color 200ms, color 200ms;
                        font-weight: 500;
                        font-size:14px;
                        border-radius: 5px;
                        background-color: darken($game-cream, 12.5%);
                        overflow: hidden;

                        &::before {
                            content: "";
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 4px;
                            height: 100%;
                            background-color: $game-red;
                            opacity: 0;
                            transition: opacity 100ms;
                        }

                        i {
                            font-size: 14px;
                        }

                        &:hover {
                            background-color: darken($game-cream, 15%);

                            &::before {
                                opacity: 1;
                            }
                        }

                        &.router-link-active {
                            background-color: darken($game-cream, 15%);

                            &::before {
                                opacity: 1;
                            }
                        }
                    }
                }
            }

        }

        .dashboard-page-content {
            position: relative;
            float: left;
            width: calc(100% - 200px);
            height: 100%;
            
            .router-view {
                position: relative;
                display: block; 
                width: 100%;
                height: 100%;

                &.zoom-fade-enter-active {
                    transition: opacity 200ms linear, transform 200ms cubic-bezier(.2,.5,.1,1);
                }

                &.zoom-fade-leave-active {
                    transition: opacity 200ms linear, transform 200ms cubic-bezier(.5,0,.7,.4);
                }

                &.zoom-fade-enter {
                    transform-origin: 50% 50%;
                    transform: translateY(6px);
                    opacity: 0;
                }

                &.zoom-fade-leave-to {
                    transform-origin: 50% 50%;
                    transform: translateY(6px);
                    opacity: 0;
                }

            }
        }

    }

</style>
