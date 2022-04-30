<template>
    <div class="lobbies-create-page d-block h-100">
        <div class="lobbies-page-title-bar">
            <div class="row h-100 no-gutters">
                <div class="col-7 align-self-center text-left px-3">
                    <h5 class="weight-600 m-0">Create a new lobby</h5>
                </div>
            </div>
        </div>
        <div class="lobbies-page-content">
            <b-alert class="my-3" :show="invalidMessage.length > 0" variant="danger">{{ invalidMessage }}</b-alert>
            <b-form id="createLobbyForm" @submit.stop.prevent="createGameFormHandler" class="p-4">
                <div class="row">
                    <div class="col-6">
                        <b-form-group label="Map Selection" description="Select which map in which this game should take place">
                            <b-form-select id="mapSelection" v-model="$v.createGameForm.gameMap.$model" :options="gameMaps" :state="validateFormFieldState('createGameForm', 'gameMap')"></b-form-select>
                        </b-form-group>
                    </div>
                    <div class="col-6">
                        <b-form-group label="Game Mode Selection" description="Select which game mode should be played on this map">
                            <b-form-select id="gameModeSelection" v-model="$v.createGameForm.gameMode.$model" :options="gameModes" :state="validateFormFieldState('createGameForm', 'gameMode')"></b-form-select>
                        </b-form-group>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <b-form-group id="startDate" label="Start Date" description="The game will start on this date. You must select a date in the future.">
                            <b-form-datepicker  v-model="$v.createGameForm.gameStartDate.$model" :min="minDate" :state="validateFormFieldState('createGameForm', 'gameStartDate')" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"></b-form-datepicker>
                        </b-form-group>
                    </div>
                    <div class="col-6">
                      <b-form-group id="startTime" label="Start Time" description="The game will start at this time. You must select a time in the future.">
                            <b-form-timepicker v-model="$v.createGameForm.gameStartTime.$model" :min="minDate" :state="validateFormFieldState('createGameForm', 'gameStartTime')"></b-form-timepicker>
                        </b-form-group>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <b-form-group label="Time Limit (minutes)" description="This lobby will close when the time limit has been reached">
                            <b-form-spinbutton min="1" max="60" v-model="$v.createGameForm.gameTimeLimit.$model" :state="validateFormFieldState('createGameForm', 'gameTimeLimit')"></b-form-spinbutton>
                        </b-form-group>
                    </div>
                    <div class="col-6">
                        <b-form-group label="Max Players" description="Select the maximum amount of players that can join this lobby">
                            <b-form-spinbutton min="2" max="20" v-model="$v.createGameForm.gameMaxPlayers.$model" :state="validateFormFieldState('createGameForm', 'gameMaxPlayers')"></b-form-spinbutton>
                        </b-form-group>
                    </div>
                </div>
                <b-button id="submitButton" class="mt-4" block variant="primary" type="submit">Create Lobby</b-button>
            </b-form>
            <b-alert class="my-3" :show="invalidMessage.length > 0" variant="danger">{{ invalidMessage }}</b-alert>
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
    import moment from "moment";

    
	/**
     * Create lobby Page
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
                invalidMessage: "",
                requestGameMapsCancelToken: cancelToken(),
                requestGameModesCancelToken: cancelToken(),
                requestGameMapsLoading: false,
                requestGameModesLoading: false,
                gameMaps: [],
                gameModes: [],
                minDate: moment().format('YYYY-MM-DD'),
                minTime: moment().format('HH:mm:ss'),
                createGameForm: {
					gameMap: null,
					gameMode: null,
					gameMaxPlayers: 12,
					gameTimeLimit: 10,
					gameStartCountdown: 1,
					gameStartDate: null,
					gameStartTime: null
                },            
            };
        },

		/**
		 * Register validators
		 */
		validations: {
			createGameForm: {
				gameMap: {
					required,
				},
				gameMode: {
					required,
                },
                gameMaxPlayers: {
					required,
                },
                gameTimeLimit: {
					required,
                },
                gameStartCountdown: {
					required,
                },
                gameStartDate: {
					required,
                },
                gameStartTime: {
                    required,
                    minDate (value) {
                        return !(value < moment().format('HH:mm:ss'));
                    }
                },
            },
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
			async createGameFormHandler () {

				// Check if form is valid and if not
				// then return out of function
				this.$v.createGameForm.$touch();
				if (this.$v.createGameForm.$invalid) {
					this.invalidMessage = "";
					return;
                }

                // Convert date time to utc
                var utcDate = new moment(this.createGameForm.gameStartDate + "T" + this.createGameForm.gameStartTime, "YYYY-MM-DDTHH:mm").utc();

                // Show loader
                this.$store.commit('showLoader', "Creating Lobby...");
                
				// Form was validated, so check with server
			    request({
					method: 'post',
					url: 'games',
					data: { 
                        gameMap: this.createGameForm.gameMap, 
                        gameMode: this.createGameForm.gameMode ,
                        gameMaxPlayers: this.createGameForm.gameMaxPlayers,
                        gameTimeLimit: this.createGameForm.gameTimeLimit * 60,
                        gameStartDatetime: utcDate.format(),
                    }
				}).then((res) => {
                    console.log(res);
					this.$router.push('/dashboard/lobbies');
				}).catch((res) => {
					if (res.statusCode === 400) {
						this.invalidMessage = res.json.errors[0].message;
					}
					console.log(res);
				}).finally(() => {
                    this.$store.commit('hideLoader');
				});

            },
        },

        /**
         * On mounted hook  
         */
        mounted: async function () {

            // Set default date and time
            this.createGameForm.gameStartDate = this.minDate;
            this.createGameForm.gameStartTime = this.minTime;

            // Is now loading data
            this.$store.commit('showLoader', "Loading...");

            // Get maps
            request({
				method: 'get',
				url: '/maps',
                cancelToken: this.requestGameMapsCancelToken.token
			}).then((res) => {
                this.gameMaps = res.json.data.map((m) => {
                    return { value: m._id, text: m.mapTitle }
                });
                this.gameMaps.unshift({ value: null, text: "Please select" });

                // Get modes
                request({
                    method: 'get',
                    url: '/gamemodes',
                    cancelToken: this.requestGameModesCancelToken.token
                }).then((res) => {
                    this.gameModes = res.json.data.map((m) => {
                        return { value: m._id, text: m.gameModeTitle }
                    });
                    this.gameModes.unshift({ value: null, text: "Please select" });

                    // Hide loader
                    this.$store.commit('hideLoader');

                }).catch((err) => {
                    console.warn(err);
                })

			}).catch((err) => {
                console.warn(err);
            })


        },

        /**
         * On destroyed hook
         */
        destroyed: function () {
            this.requestGameMapsCancelToken.cancel('Request Cancelled');
            this.requestGameModesCancelToken.cancel('Request Cancelled');
        },

        computed: {
           
        },

    }
</script>
<style lang="scss" scoped>
	@import '../scss/variables.scss';
   
    .lobbies-create-page {


        .lobbies-page-title-bar {
            position: relative;
            display: block;
            width: 100%;
            height: 52px;
            background-color: #FFF;
        }

        .lobbies-page-content {
            position: relative;
            display: block;
            width: 100%;
            height: calc(100% - 52px);
            padding: 12px;
            overflow-y: auto;
            overflow-x: hidden;
        }

    }

</style>