<template>
    <div class="lobbies-page d-block h-100">
        <div class="lobbies-page-title-bar">
            <div class="row h-100 no-gutters">
                <div class="col-7 align-self-center text-left px-3">
                    <h5 class="weight-600 m-0">Lobbies</h5>
                </div>
                 <div class="col-5 align-self-center text-right px-3">
                    <b-button variant="outline-danger m-0" :to="`/dashboard/lobbies/create`">CREATE LOBBY</b-button>
                </div>
            </div>
        </div>
        <div class="lobbies-list">
            <div class="lobbies-list-group-title" v-b-toggle.collapse-1>My Lobbies <i class="fas fa-chevron-down"></i></div>
            <b-collapse id="collapse-1" class="mt-2" visible>
                <lobby-card v-for="item in userLobbies" v-bind:key="item._id" :lobby="item" v-on:expired="expireLobby"></lobby-card>
            </b-collapse>
            <div class="lobbies-list-group-title" v-b-toggle.collapse-2>Other Lobbies <i class="fas fa-chevron-down"></i></div>
            <b-collapse id="collapse-2" class="mt-2" visible>
                <lobby-card v-for="item in otherLobbies" v-bind:key="item._id" :lobby="item" v-on:expired="expireLobby"></lobby-card>
            </b-collapse>
            
        </div>
    </div>
</template>
<script>
	import { request, cancelToken } from './../helpers/request';
    import io from 'socket.io-client';

    export default {
        data: function () {
            return {
                userLobbies: [],
                otherLobbies: [],
                requestLobbiesCancelToken: cancelToken(),
                socket: null,
            };
        },
        mounted: async function () {

            // Show loader
            this.$store.commit('showLoader', "Loading lobbies...");
            
            // get initial lobby list
            request({
                method: 'get',
                url: 'games',
                cancelToken: this.requestLobbiesCancelToken.token
            }).then((res) => {
                this.userLobbies = res.json.data.filter((lobby) => {
                    return lobby.gameUser == window.localStorage.getItem('userId');
                });
                this.otherLobbies = res.json.data.filter((lobby) => {
                    return lobby.gameUser != window.localStorage.getItem('userId');
                });
            }).catch((err) => {
                console.log(err);
            }).finally(() => {
                this.$store.commit('hideLoader');
            });

            // Create a new socket to connect to lobbies
            this.socket = io.connect(process.env.VUE_APP_API_BASE_URL + 'lobbies', {
                forceNew: true,
                query: {
                    jwt: window.localStorage.getItem('JWT'),
                }
            });

            // User is successfully connected
            this.socket.on('connect', () => {
                //console.log('successfull handshake');
            });
            
            // On connection error, probably unauthorized
            this.socket.on('connect_error', (err) => {
                if (err.message == "Invalid token") {
                    alert('Sorry, you are unauthoized. Please log in.');
                    window.localStorage.removeItem('JWT');
                    window.localStorage.removeItem('userId');
                    this.$router.push('/');
                }
            });

            // On lobby created
            this.socket.on('created', (lobby) => {
                if (lobby.gameUser == window.localStorage.getItem('userId')) {
                    this.userLobbies.push(lobby);
                    this.userLobbies.sort((a, b) => {
                        return a.gameStartDatetime < b.gameStartDatetime ? -1 : 1;
                    });
                } else {
                    this.otherLobbies.push(lobby);
                    this.otherLobbies.sort((a, b) => {
                        return a.gameStartDatetime < b.gameStartDatetime ? -1 : 1;
                    });
                }
            });

            //this.socket.on('error', (err) => {
            //    console.log(err);
                //alert('Sorry, you are unauthoized. Please log in.');
                //window.localStorage.removeItem('JWT');
                //window.localStorage.removeItem('userId');
                //this.$router.push('/');
           // })

            

            // On connection callback
            /*this.socket.on('connect', () => {
                    
                this.socket.on('created', (lobby) => {
                    if (lobby.gameUser == window.localStorage.getItem('userId')) {
                        this.userLobbies.push(lobby);
                        this.userLobbies.sort((a, b) => {
                            return a.gameStartDatetime < b.gameStartDatetime ? -1 : 1;
                        });
                    } else {
                        this.otherLobbies.push(lobby);
                        this.otherLobbies.sort((a, b) => {
                            return a.gameStartDatetime < b.gameStartDatetime ? -1 : 1;
                        });
                    }
                });

                this.socket.on('deleted', (lobbyId) => {
                    this.userLobbies = this.userLobbies.filter((lobby) => {
                        return lobbyId == lobby._id ? false : true;
                    });
                    this.otherLobbies = this.otherLobbies.filter((lobby) => {
                        return lobbyId == lobby._id ? false : true;
                    });
                });


            });*/



                // Get maps
                /*setTimeout(() => {
                    request({
                        method: 'get',
                        url: 'games',
                        cancelToken: this.requestLobbiesCancelToken.token
                    }).then((res) => {
                        this.userLobbies = res.json.data.filter((lobby) => {
                            return lobby.gameUser == window.localStorage.getItem('userId');
                        });
                        this.otherLobbies = res.json.data.filter((lobby) => {
                            return lobby.gameUser != window.localStorage.getItem('userId');
                        });
                    }).catch((err) => {
                        console.log(err);
                    }).finally(() => {
                        this.$store.commit('hideLoader');
                    });
                }, 1000);*/

        },

        beforeDestroy() {
            if (this.socket != null) {
                this.socket.disconnect();
            }
        },
        destroyed: function () {
            this.requestLobbiesCancelToken.cancel('Request Cancelled');
        },
        computed: {
           
        },
        methods: {
            expireLobby (lobbyId) {
                this.userLobbies = this.userLobbies.filter((lobby) => {
                    return lobbyId == lobby._id ? false : true;
                });
                this.otherLobbies = this.otherLobbies.filter((lobby) => {
                    return lobbyId == lobby._id ? false : true;
                });
            }
        }
    }
</script>
<style lang="scss" scoped>
   
    .lobbies-page {

        .lobbies-page-title-bar {
            position: relative;
            display: block;
            width: 100%;
            height: 52px;
            background-color: #FFF;
        }

        .lobbies-list {
            position: relative;
            display: block;
            width: 100%;
            height: calc(100% - 52px);
            padding: 12px;
            overflow-y: auto;
            overflow-x: hidden;

            .lobbies-list-group-title {
                outline: none!important;
                
                i {
                    transition: transform 200ms;
                    transform-origin: 50% 50%;
                }
                &.collapsed {

                    i {
                        transform: rotate(-180deg);
                    }
                }
            }

            
        }
    }

</style>