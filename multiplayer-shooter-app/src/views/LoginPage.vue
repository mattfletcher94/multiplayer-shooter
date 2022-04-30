<template>
    <div class="login-page">
        <div class="container h-100">
            <b-row class="justify-content-center h-100 no-gutters">
                <b-col class="col-10 col-md-5 align-self-center">
                    <div class="login-card">
                        <b-tabs active-nav-item-class="login-card-tab-active" justified>
                            <b-tab title="LOG IN" active>
                                <b-form id="LoginForm" @submit.stop.prevent="loginFormHandler" class="p-4">
                                    <b-alert class="my-3" :show="invalidCredentialsMessage.length > 0" variant="danger">{{ invalidCredentialsMessage }}</b-alert>
                                    <b-form-group label="Display Name">
                                        <b-form-input name="userDisplayName" v-model="$v.loginForm.userDisplayName.$model" :state="validateFormFieldState('loginForm', 'userDisplayName')" type="text"></b-form-input>
                                        <b-form-invalid-feedback id="userDisplayNameFeedback">This is a required field.</b-form-invalid-feedback>
                                    </b-form-group>
                                    <b-form-group label="Password">
                                        <b-form-input name="userPassword" v-model="$v.loginForm.userPassword.$model" :state="validateFormFieldState('loginForm', 'userPassword')" type="password"></b-form-input>
                                        <b-form-invalid-feedback id="userPasswordFeedback">This is a required field.</b-form-invalid-feedback>
                                    </b-form-group>
                                    <b-button class="loginSubmit mt-4" block variant="primary" type="submit">LOG IN</b-button>
                                </b-form>
                            </b-tab>
                            <b-tab title="REGISTER">
                                <b-form @submit.stop.prevent="registerFormHandler" class="p-4">
                                    <b-alert class="my-3" :show="invalidRegisterMessage.length > 0" variant="danger">{{ invalidRegisterMessage }}</b-alert>
                                    <b-form-group label="Display Name">
                                        <b-form-input name="registerUserDisplayName" v-model="$v.registerForm.userDisplayName.$model" :state="validateFormFieldState('registerForm', 'userDisplayName')" type="text"></b-form-input>
                                        <b-form-invalid-feedback id="registerUserDisplayNameFeedback">This is a required field.</b-form-invalid-feedback>
                                    </b-form-group>
                                    <b-form-group label="Password">
                                        <b-form-input name="registerUserPassword" v-model="$v.registerForm.userPassword.$model" :state="validateFormFieldState('registerForm', 'userPassword')" type="password"></b-form-input>
                                        <b-form-invalid-feedback id="registerUserPasswordFeedback">This is a required field and must be at least 6 characters long.</b-form-invalid-feedback>
                                    </b-form-group>
                                    <b-form-group label="Confirm Password">
                                        <b-form-input name="registerUserConfirmPassword" v-model="$v.registerForm.userPasswordConfirm.$model" :state="validateFormFieldState('registerForm', 'userPasswordConfirm')" type="password"></b-form-input>
                                        <b-form-invalid-feedback id="registerUserConfirmPasswordFeedback">Passwords must match.</b-form-invalid-feedback>
                                    </b-form-group>
                                    <b-button class="mt-4" block variant="primary" type="submit">Register</b-button>
                                </b-form>
                            </b-tab>
                        </b-tabs>
                    </div>
                </b-col>
            </b-row>
        </div>
    </div>
</template>
<script>

	/**
	 * Imports
	 */
	import { request } from './../helpers/request';
	import { validationMixin } from "vuelidate";
	import { required, minLength, sameAs } from "vuelidate/lib/validators";

	/**
     * Login Page
     * @version 1.0
     */
	export default {
        name: 'login-page',

		/**
		 * Apply validation mixin
		 */
  		mixins: [validationMixin],

		/**
		 * Data
		 */
		data: function () {
			return {
                invalidCredentialsMessage: "",
                invalidRegisterMessage: "",
				loginForm: {
					userDisplayName: null,
					userPassword: null
                },
                registerForm: {
					userDisplayName: null,
                    userPassword: null,
                    userPasswordConfirm: null,
				}
			}
		},

		/**
		 * Register validators
		 */
		validations: {
			loginForm: {
				userDisplayName: {
					required,
				},
				userPassword: {
					required,
				}
            },
            registerForm: {
                userDisplayName: {
                    required,
                },
                userPassword: {
                    required,
                    minLength: minLength(6)
                },
                userPasswordConfirm: {
                    sameAsPassword: sameAs('userPassword'),
                    minLength: minLength(6)
                }
            }
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

			/**
			 * Submit login form
			 */
			async loginFormHandler () {


				// Check if form is valid and if not
				// then return out of function
				this.$v.loginForm.$touch();
				if (this.$v.loginForm.$invalid) {
					this.invalidCredentialsMessage = "";
					return;
				}

                // Show loader
                this.$store.commit('showLoader', "Signing in...");

				// Form was validated, so check with server
			    request({
					method: 'post',
					url: 'users/login',
					data: { userDisplayName: this.loginForm.userDisplayName, userPassword: this.loginForm.userPassword }
				}).then((res) => {
                    window.localStorage.setItem('JWT', res.json.data.token);
                    window.localStorage.setItem('userId', res.json.data.user._id);
					this.$router.push('/dashboard/lobbies/');
				}).catch((res) => {
					if (res.statusCode === 400) {
						this.invalidCredentialsMessage = res.json.errors[0].message;
					}
					console.log(res);
				}).finally(() => {
                    this.$store.commit('hideLoader');
				});

            },
            
            async registerFormHandler () {


				// Check if form is valid and if not
				// then return out of function
				this.$v.registerForm.$touch();
				if (this.$v.registerForm.$invalid) {
					this.invalidRegisterMessage = "";
					return;
                }
                
                // Show loader
                this.$store.commit('showLoader', "Registering...");

                // Hide message
                this.invalidRegisterMessage = "";

				// Form was validated, so check with server
			    request({
					method: 'post',
					url: 'users/register',
					data: { userDisplayName: this.registerForm.userDisplayName, userPassword: this.registerForm.userPassword }
				}).then((res) => {
                    window.localStorage.setItem('JWT', res.json.data.token);
                    window.localStorage.setItem('userId', res.json.data._id);
					this.$router.push('/dashboard/lobbies');
				}).catch((res) => {
					if (res.statusCode === 400) {
						this.invalidRegisterMessage = res.json.errors[0].message;
					}
					console.log(res);
				}).finally(() => {
                    this.$store.commit('hideLoader');
                });
                
            }

		}
	}
</script>
<style lang="scss" >
	@import '../scss/variables.scss';

    .login-page {
        position: relative;
        display: block;
        width: 100%;
        height: 100%;
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
        }
    }

    .login-card {
        position: relative;
        display: block;
        width: 100%;
        background-color: #FFF;
        border-radius: 5px;
		overflow: hidden;
		box-shadow: $shadow-card-2;
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
        z-index: 2;

        .nav-tabs {
            border-bottom: 0px solid transparent;
        }

        .nav-tabs .nav-link {
            border: 0px solid transparent;
        }

        .nav-link {
            border-radius: 0px!important;
            padding: 1.5rem 1.5rem;
            font-weight: 600;
            background-color: #e1e1e1;
            color: $text-black!important;

            &.login-card-tab-active {
                background-color: #FFF;
            }
        }

    }


	#login-card {
		border-radius: 5px;
		overflow: hidden;
		box-shadow: $shadow-card-2;
		transition: all 0.3s cubic-bezier(.25,.8,.25,1);
	}
</style>
