<template>
    <div class="game-page" tabindex="1"
        @keydown.w="wPressed = true"
        @keydown.d="dPressed = true"
        @keydown.s="sPressed = true"
        @keydown.a="aPressed = true"
        @keyup.w="wPressed = false"
        @keyup.d="dPressed = false"
        @keyup.s="sPressed = false"
        @keyup.a="aPressed = false">
        <div class="game-page-container">
            <div class="texture-alum"></div>
            <div id="gameCanvas" ref="gameCanvas" tabindex="1"
                @mousedown.left="leftMouseButtonPressed = true"
                @mouseup.left="leftMouseButtonPressed = false">
                <div class="lines"></div>
                <div class="xp-drops">
                    <div class="xp-drop" v-for="(playerKillXpDrop) in playerKillXpDrops" :key="playerKillXpDrop.id" >{{ playerKillXpDrop.text }}</div>
                </div>
                <div class="buff-drops">
                    <div class="buff-drop" v-for="(playerBuffDrop) in playerBuffDrops" :key="playerBuffDrop.id" >{{ playerBuffDrop.text }}</div>
                </div>
                <div class="respawning" ref="respawning" v-if="!hasEnded">
                    <p>Unlucky, you were killed.</p>
                    <h3 class="mb-0">Prepare to Respawn...</h3>
                </div>
                <div class="start-countdown" v-if="hasStarted === false">
                    <p>Game starting in:</p>
                    <h3 class="mb-3">{{ timeUntilStart ? timeUntilStart + ' seconds' : '' }}</h3>
                </div>
                <div class="end-game" ref="endGame" v-if="hasEnded">
                    <div class="row justify-content-center h-100">
                        <div class="col-8 align-self-center">
                            <div class="row no-gutters justify-content-center">
                                <div class="col-12">
                                    <p class="mb-2">Thanks for playing</p>
                                    <h4 class="mb-4">The game has finished.</h4>
                                </div>
                            </div>
                            <div class="row no-gutters justify-content-center scoreboard-row">
                                <div class="col-5">
                                    <p class="weight-600 text-center my-3">Name</p>
                                </div>
                                <div class="col-5">
                                    <p class="weight-600 text-center my-3">Kills</p>
                                </div>
                            </div>
                            <div class="row no-gutters justify-content-center scoreboard-row" v-for="item in scoreboard" :key="item.Name">
                                <div class="col-5">
                                    <p class="weight-400 text-center my-3">{{ item.Name }}</p>
                                </div>
                                <div class="col-5">
                                    <p class="weight-400 text-center my-3">{{ item.Kills }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="HUD">
                <div class="hud-game-info">
                    <div class="row no-gutters">
                        <div class="col-12">
                            <h5 class="weight-600 mt-3 mb-1" v-if="lobby">{{ lobby.gameMap.mapTitle }}</h5>
                        </div>
                    </div>
                    <div class="row no-gutters">
                        <div class="col-12">
                            <h6 class="weight-400 m-0" v-if="lobby">· {{ lobby.gameMode.gameModeTitle }} ·</h6>
                        </div>
                    </div>
                    <div class="row no-gutters">
                        <div class="col-12">
                            <hr class="my-3">
                        </div>
                    </div>
                    <div class="row no-gutters">
                        <div class="col-7 text-left">
                            <h6 class="weight-400 m-0 pl-3" v-if="hasStarted">Time remaining:</h6>
                        </div>
                        <div class="col-5 text-right">
                            <h6 class="weight-600 m-0 pr-3" v-if="hasStarted">{{ timeUntilEnd }}s</h6>
                        </div>
                    </div>
                    <div class="row no-gutters">
                        <div class="col-12">
                            <hr class="my-3">
                        </div>
                    </div>
                    <div class="row no-gutters">
                        <div class="col-7 text-left">
                            <h6 class="weight-400 m-0 pl-3">Health:</h6>
                        </div>
                        <div class="col-5 text-right">
                            <h6 class="weight-600 m-0 pr-3">{{ playerHealth }}</h6>
                        </div>
                    </div>
                    <div class="row no-gutters">
                        <div class="col-7 text-left">
                            <h6 class="weight-400 m-0 pl-3">Speed:</h6>
                        </div>
                        <div class="col-5 text-right">
                            <h6 class="weight-600 m-0 pr-3">{{ playerSpeed }}</h6>
                        </div>
                    </div>
                    <div class="row no-gutters">
                        <div class="col-7 text-left">
                            <h6 class="weight-400 m-0 pl-3">Fire Rate:</h6>
                        </div>
                        <div class="col-5 text-right">
                            <h6 class="weight-600 m-0 pr-3">{{ 10 - playerFireRate }}</h6>
                        </div>
                    </div>
                    <div class="row no-gutters">
                        <div class="col-7 text-left">
                            <h6 class="weight-400 m-0 pl-3">Damage:</h6>
                        </div>
                        <div class="col-5 text-right">
                            <h6 class="weight-600 m-0 pr-3">{{ playerFireDamage }}</h6>
                        </div>
                    </div>
                    <div class="row no-gutters">
                        <div class="col-12">
                            <hr class="my-3">
                        </div>
                    </div>
                    <div class="row no-gutters">
                        <div class="col-7 text-left">
                            <h6 class="weight-400 m-0 pl-3">Kills:</h6>
                        </div>
                        <div class="col-5 text-right">
                            <h6 class="weight-600 m-0 pr-3">{{ playerKills }}</h6>
                        </div>
                    </div>
                    <div class="row no-gutters">
                        <div class="col-7 text-left">
                            <h6 class="weight-400 m-0 pl-3">Kill Streak:</h6>
                        </div>
                        <div class="col-5 text-right">
                            <h6 class="weight-600 m-0 pr-3">{{ playerKillStreak }}</h6>
                        </div>
                    </div>
                    <div class="row no-gutters">
                        <div class="col-12">
                            <hr class="mt-3 mb-0">
                        </div>
                    </div>
                </div>
                <div class="hud-kill-history">
                    <div v-for="item in killHistory" :key="item.id">
                        <div class="row no-gutters">
                            <div class="col-5 text-left  align-self-center pl-3">
                                <p class="text-left m-0" :style="`color:${item.player1 == playerDisplayName ? '#212121' : '#ff4747'}`">{{ item.player1 }} ({{item.player1Ks}}ks)</p>
                            </div>
                            <div class="col-2 text-center align-self-center">
                                <p class="w-100 text-center m-0"><img src="@/assets/bullet-2.png" width="24"/></p>
                            </div>
                            <div class="col-5 text-right  align-self-center pr-3">
                                <p class="text-right m-0" :style="`color:${item.player2 == playerDisplayName ? '#212121' : '#ff4747'}`">{{ item.player2 }} ({{item.player2Ks}}ks)</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="hud-menu">
                    <div class="row no-gutters">
                        <div class="col-12">
                            <hr class="mt-0 mb-3">
                        </div>
                    </div>
                    <div class="row no-gutters">
                        <div class="col-12 text-left px-3">
                            <b-button class="m-0" block variant="outline-primary" v-on:click="controlsWindowOpen = true">Controls</b-button>
                        </div>
                    </div>
                    <div class="row no-gutters mt-3">
                        <div class="col-12 text-left px-3">
                            <b-button class="m-0" block variant="outline-danger" :to="`/dashboard/lobbies/`">Leave Game</b-button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="controls" v-if="controlsWindowOpen">
                <div class="row h-100 justify-content-center">
                    <div class="col-8 align-self-center">
                        <div class="row no-gutters text-center">
                            <div class="col-12">
                                <h5 class="weight-600 m-0">Move Your Player:</h5>
                            </div>
                            <div class="col-12 mt-2">
                                <h6 class="weight-400 m-0">Move your player using the W, A, S, D keys on your keyboard.</h6>
                            </div>
                        </div>
                        <div class="row no-gutters text-centers mt-4">
                            <div class="col-12">
                                <h5 class="weight-600 m-0">Aim and shoot:</h5>
                            </div>
                            <div class="col-12 mt-2">
                                <h6 class="weight-400 m-0">Aim by moving your mouse around the game window and shoot by holding down the left mouse button.</h6>
                            </div>
                        </div>
                        <div class="row no-gutters text-centers mt-5">
                            <div class="col-12">
                                <b-button class="m-0" variant="outline-danger" v-on:click="controlsWindowOpen = false">Close Window</b-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { request, cancelToken } from './../helpers/request';
import * as PIXI from 'pixi.js';
import GameLoop from 'mainloop.js';
import Impetus from '../helpers/impetus';
import io from 'socket.io-client';
import moment from 'moment';
import Vuex from 'vuex'

export default {
    
    /**
     * Data
     */
    data: function () {
        return {
            requestLobbyCancelToken: cancelToken(),
            lobby: null,
            hasStarted: null,
            timeUntilStart: null,
            hasEnded: false,
            timeUntilEnd: null,
            impetus: null,
            game: null,
            gameSize: { w: 720, h: 576 },
            gameRatio: 576 / 720,
            wPressed: false,
            dPressed: false,
            sPressed: false,
            aPressed: false,
            leftMouseButtonPressed: false,
            controlsWindowOpen: false,
            scoreboard: [],
            
            // World properties
            timer: null,
            respawning: false,

            // Player properties
            playerDisplayName: "",
            playerHealth: 100,
            playerSpeed: 6,
            playerFireRate: 6,
            playerFireDamage: 10,
            playerKills: 0,
            playerKillStreak: 0,
            playerKillXpDrops: [],
            playerKillXpDropsCount: 0,
            playerBuffDrops: [],
            playerBuffDropsCount: 0,
            killHistory: [],

        }
    },

    /**
     * Add the window resize event on element create.
     */
    created: function () {
        window.addEventListener("resize", this.resizeHandler);
    },

    /**
     * Called before the component is destroyed
     */
    beforeDestroy: function () {
        if (this.socket != null) {
            this.socket.disconnect();
        }
    },

    /**
     * When the element is destroyed, remove the
     * window resize event listener.
     */
    destroyed: function () {
        window.removeEventListener("resize", this.resizeHandler);
    },

    /**
     * On component mounted
     */
    mounted: function () {

        // Show loader
        this.$store.commit('showLoader', {
            message: "Joining lobby...",
            width: 920,
            height: 576,
        });

        // Make sure game lobby still exists
        request({
            method: 'get',
            url: 'games/' + this.$route.params.id,
            cancelToken: this.requestLobbyCancelToken.token
        }).then((res) => {

            // Set lobby data
            this.lobby = res.json.data;

            // If lobby has finished, kick user out
            if (moment().isAfter(res.json.data.gameEndDatetime)) {
                alert('Sorry, this lobby no longer exists. We will redirect you to the dashboard.');
                //this.$store.commit('hideLoader');
                this.$router.push('/dashboard/lobbies');
            }

            // The lobby does exist, now load pixi.js and assets
            this.$store.commit('showLoader', {
                message: "Loading assets...",
                width: 920,
                height: 576,
            });
            
            // Create game
            this.game = new PIXI.Application({
                width: this.gameSize.w, 
                height: this.gameSize.h,
                antialias: true,  
                transparent: false, 
                resolution: 1 
            });

            // Renderer options
            this.game.renderer.backgroundColor = 0x000000;
            this.game.renderer.autoResize = false;
            this.game.renderer.resize(this.gameSize.w, this.gameSize.h);

            // Add view to screen
            this.$refs.gameCanvas.append(this.game.view);
            this.$refs.gameCanvas.focus();


            // Set canvas height to fit 16:9 aspect ratio
            this.resizeHandler();

            // Load assets
            this.game.loader.reset()
            .add('soldier', require('../assets/soldier.png'))
            .add('enemySoldier', require('../assets/enemySoldier.png'))
            .add('bullet', require('../assets/bullet.png'))
            .add('map', this.lobby.gameMap.mapTexturePath)
            .load(this.onAssetsReady);

        }).catch((err) => {
            console.log(err);
            if (err.statusCode === 404) {
                alert('Sorry, this lobby no longer exists. We will redirect you to the dashboard');
            } else {
                alert('Sorry, there was an error. We will redirect you to the dashboard');
            }
            this.$store.commit('hideLoader');
            this.$router.push('/dashboard/lobbies');
        });
        
    },

    

    /**
     * Methods
     */
    methods: {

        /**
         * Assets have been loaded so now connect to socket
         */
        onAssetsReady: function () {

            // Connecting...
            this.$store.commit('showLoader', {
                message: "Connecting...",
                width: 920,
                height: 576,
            });

            // Connect using web sockets
            this.socket = io.connect(process.env.VUE_APP_API_BASE_URL + 'lobby', {
                forceNew: true,
                query: {
                    jwt: window.localStorage.getItem('JWT'),
                    lobbyId: this.$route.params.id,
                }
            });
            
            // User is successfully connected and ready to go
            this.socket.on('connect', () => {

                // Listen to ready event
                this.socket.on('worldReady', (data) => {

                    // Create text styles
                    const textStyleWhite = new PIXI.TextStyle({ fontSize: 14, fill: "white", strokeThickness: 2, letterSpacing: 1, });
                    const textStyleRed = new PIXI.TextStyle({ fontSize: 14, fill: 0xff4747, strokeThickness: 2, letterSpacing: 1, });

                    // Create pixi world
                    const WORLD = new PIXI.Container();
                    const WORLD_SIZE = { w: data.worldWidth, h: data.worldHeight };
                    const WORLD_SPRITE = new PIXI.Sprite(this.game.loader.resources["map"].texture);
                    WORLD.width = WORLD_SIZE.w;
                    WORLD.height = WORLD_SIZE.h;
                    WORLD_SPRITE.width = WORLD_SIZE.w;
                    WORLD_SPRITE.height = WORLD_SIZE.h;
                    WORLD.addChild(WORLD_SPRITE);
                    this.game.stage.addChild(WORLD);

                    // Get id of current user
                    var userId = window.localStorage.getItem("userId");
                    var userRespawning = false;

                    // Sprite references
                    var playerSprites = {};
                    var playerTextSprites = {};

                    // Listen to tick event
                    this.socket.on('tick', (data) => {

                        // Set the time left
                        this.hasStarted = data.hasStarted;
                        this.timeUntilStart = data.timeUntilStart;
                        this.hasEnded = data.hasEnded;
                        this.timeUntilEnd = data.timeUntilEnd;

                        // If there is new kill history, update ui
                        if (data.killHistory.length > this.killHistory.length) {
                            this.killHistory = data.killHistory;
                        }

                        // Iterate through all players in world
                        for (var i = 0; i < data.players.length; i++) {

                            if (!data.players[i])
                                continue;
                            
                            // If is current user in loop
                            if (data.players[i].id == userId) {

                                // If player has gained a kill
                                if (data.players[i].kills > this.playerKills) {
                                    var xpDrop = { id: this.playerKillXpDropsCount++, text: "+1 kill", }
                                    this.playerKillXpDrops.push(xpDrop);
                                    ((xpd) => {
                                        setTimeout(() => {
                                            this.playerKillXpDrops.splice(this.playerKillXpDrops.indexOf(xpd), 1);
                                        }, 1000);
                                    })(xpDrop);
                                }

                                // Buff exp drops
                                if (data.players[i].speed > this.playerSpeed) {
                                    setTimeout(() => {
                                        var xpDrop = { id: this.playerBuffDropsCount++, text: "+1 speed", }
                                        this.playerBuffDrops.push(xpDrop);
                                        ((xpd) => {
                                            setTimeout(() => {
                                                this.playerBuffDrops.splice(this.playerBuffDrops.indexOf(xpd), 1);
                                            }, 1000);
                                        })(xpDrop);
                                    }, 500);
                                } else if (data.players[i].fireDamage > this.playerFireDamage) {
                                    setTimeout(() => {
                                        var xpDrop = { id: this.playerBuffDropsCount++, text: "+5 damage", }
                                        this.playerBuffDrops.push(xpDrop);
                                        ((xpd) => {
                                            setTimeout(() => {
                                                this.playerBuffDrops.splice(this.playerBuffDrops.indexOf(xpd), 1);
                                            }, 1000);
                                        })(xpDrop);
                                    }, 500);
                                } else if (data.players[i].fireRate < this.playerFireRate) {
                                    setTimeout(() => {
                                        var xpDrop = { id: this.playerBuffDropsCount++, text: "+1 fire rate", }
                                        this.playerBuffDrops.push(xpDrop);
                                        ((xpd) => {
                                            setTimeout(() => {
                                                this.playerBuffDrops.splice(this.playerBuffDrops.indexOf(xpd), 1);
                                            }, 1000);
                                        })(xpDrop);
                                    }, 500);
                                } else if (data.players[i].health > this.playerHealth && !userRespawning) {
                                    var healthIncrease = (data.players[i].health - this.playerHealth);
                                    ((inc) => {
                                        setTimeout(() => {
                                            var xpDrop = { id: this.playerBuffDropsCount++, text: "+" + (inc) + " health" , }
                                            this.playerBuffDrops.push(xpDrop);
                                            ((xpd) => {
                                                setTimeout(() => {
                                                    this.playerBuffDrops.splice(this.playerBuffDrops.indexOf(xpd), 1);
                                                }, 1000);
                                            })(xpDrop);
                                        }, 500);
                                    })(healthIncrease);
                                }

                                // Update stats
                                this.playerDisplayName = data.players[i].displayName;
                                this.playerHealth = data.players[i].health;
                                this.playerSpeed = data.players[i].speed;
                                this.playerFireRate = data.players[i].fireRate;
                                this.playerKills = data.players[i].kills;
                                this.playerKillStreak = data.players[i].killStreak;
                                this.playerFireDamage = data.players[i].fireDamage;

                            }
                            
                            // if a bullet has been shot, show a yellow line for a small time period
                            if (data.players[i].bullet) {
                                let line = new PIXI.Graphics();
                                line.alpha = 0.5;
                                line.lineStyle(2, 0xf1c40f).moveTo(data.players[i].bullet.start.x, data.players[i].bullet.start.y).lineTo(data.players[i].bullet.end.x, data.players[i].bullet.end.y);
                                WORLD.addChild(line);
                                (function(l){ 
                                    setTimeout(() => {
                                        WORLD.removeChild(l);
                                    }, 20);
                                })(line);
                            }

                            // If this sprite doesn't exist, create it
                            if (!playerSprites[data.players[i].id]) {
                                if (data.players[i].id == userId) {
                                    playerSprites[data.players[i].id] = new PIXI.Sprite(this.game.loader.resources["soldier"].texture);
                                    playerTextSprites[data.players[i].id] = new PIXI.Text(data.players[i].displayName, textStyleWhite);
                                } else {
                                    playerSprites[data.players[i].id] = new PIXI.Sprite(this.game.loader.resources["enemySoldier"].texture);
                                    playerTextSprites[data.players[i].id] = new PIXI.Text(data.players[i].displayName, textStyleRed);
                                }
                                playerSprites[data.players[i].id].anchor.set(0.5, 0.5);
                                playerSprites[data.players[i].id].width = 40;
                                playerSprites[data.players[i].id].height = 40;
                                WORLD.addChild(playerSprites[data.players[i].id]);

                                playerTextSprites[data.players[i].id].anchor.set(0.5, 0.5);
                                WORLD.addChild(playerTextSprites[data.players[i].id]);

                            }

                            // If current player is dead hide sprite
                            if (data.players[i].dead) {
                                if (data.players[i].id == userId) {
                                    userRespawning = true;
                                }
                                playerSprites[data.players[i].id].visible = false;
                                playerTextSprites[data.players[i].id].visible = false;
                                continue; 
                            } else {
                                if (data.players[i].id == userId) {
                                    userRespawning = false;
                                }
                                playerSprites[data.players[i].id].visible = true;
                                playerTextSprites[data.players[i].id].visible = true;
                            }

                            // If is current player, move world
                            if (data.players[i].id == userId) {
                                WORLD.position.x = (this.gameSize.w - data.players[i].position.x) - (this.gameSize.w / 2);
                                WORLD.position.y = (this.gameSize.h - data.players[i].position.y) - (this.gameSize.h / 2);
                            } 

                            // Move and rotate player
                            playerSprites[data.players[i].id].rotation = data.players[i].angle;
                            playerSprites[data.players[i].id].position.set(data.players[i].position.x, data.players[i].position.y);
                            playerTextSprites[data.players[i].id].position.set(data.players[i].position.x, data.players[i].position.y - 25);
                           
                            // Show red tint if player has recently been hit
                            if (data.players[i].hit < 1) {
                                playerSprites[data.players[i].id].tint = "0xffffff";
                            } else {
                                playerSprites[data.players[i].id].tint = "0xff0000";
                            }

                        }

                        // Remove sprites whose players have left
                        for (var playerId in playerSprites) {
                            var isStillInGame = false;
                            for (var i = 0; i < data.players.length; i++) {
                                if (!data.players[i])
                                    continue;
                                if (data.players[i].id == playerId) {
                                    isStillInGame = true;
                                    break;
                                }
                            }
                            if (!isStillInGame) {
                                WORLD.removeChild(playerSprites[playerId]);
                                playerSprites[playerId] = null;
                                delete playerSprites[playerId];
                                WORLD.removeChild(playerTextSprites[playerId]);
                                playerTextSprites[playerId] = null;
                                delete playerTextSprites[playerId];
                            }
                        }

                        // Send updates back
                        if (this.hasStarted && !this.hasEnded) {
                            this.socket.emit('playerUpdate', {
                                deltaX: (this.aPressed ? 1 : 0) + (this.dPressed ? -1  : 0),
                                deltaY: (this.wPressed ? 1 : 0) + (this.sPressed ? -1  : 0),
                                angle: Math.atan2(this.game.renderer.plugins.interaction.mouse.global.y - this.gameSize.h / 2, this.game.renderer.plugins.interaction.mouse.global.x - this.gameSize.w / 2),
                                shooting: this.leftMouseButtonPressed
                            });
                        }

                        // If user is respawning...
                        if (userRespawning) {
                            this.$refs.respawning.style.visibility = 'visible';
                        } else {
                            this.$refs.respawning.style.visibility = 'hidden';
                        }
                        
                        // If game has now ended...
                        // get scores for all players
                        if (this.hasEnded) {
                            if (this.scoreboard.length == 0) {
                                for (var i = 0; i < data.players.length; i++) {
                                    this.scoreboard.push({
                                        "Name": data.players[i].displayName,
                                        "Kills": data.players[i].kills,
                                    });
                                    this.scoreboard = this.scoreboard.sort((a, b) => a.kills < b.kills);
                                }
                                console.log(this.scoreboard);
                            }
                            return;
                        }

                    });

                    // Hide loader
                    this.$store.commit('hideLoader');
                });
                

            });
            
            // On connection error, probably unauthorized
            this.socket.on('connect_error', (err) => {

                // Print message to console
                console.log(err.message);

                // Hide loader
                this.$store.commit('hideLoader');

                // JWT error
                if (err.message == "Invalid token") {
                    alert('Sorry, you are unauthoized. Please log in.');
                    window.localStorage.removeItem('JWT');
                    window.localStorage.removeItem('userId');
                    this.$router.push('/');
                }

                // Does not exist
                else if (err.message == "The lobby does not exist") {
                    alert('Sorry, this lobby no longer exists. We will redirect you to the dashboard.');
                    this.$router.push('/dashboard/lobbies');
                }

                // Full
                else if (err.message == "Lobby Full") {
                    alert("Sorry this lobby is full. Please try again later. We will redirect you to the dashboard.");
                    this.$router.push('/dashboard/lobbies');
                }

                // Already joined
                else if (err.message == "Already Joined") {
                    alert("You have already joined this lobby in another session. We will redirect you to the dashboard.");
                    this.$router.push('/dashboard/lobbies');
                }

                // General error
                else {
                    alert('Sorry, there was an error. We will redirect you to the dashboard.');
                    this.$router.push('/dashboard/lobbies');
                }

            });

        },


        /**
         * Handle screen resize
         */
        resizeHandler(e) {
            this.$refs.gameCanvas.style.height = (this.$refs.gameCanvas.offsetWidth * this.gameRatio) + "px";
        }

    }
 
}
</script>

<style lang="scss">
    @import '../scss/variables.scss';

    .game-page {
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

        .game-page-container {
            position: relative;
            display: inline-block;
            vertical-align: middle;
            width: 920px;
            height: 576px;
            max-height:calc(100% - 60px);
            background-color: #FFF;
            border-radius: 5px;
            overflow: hidden;
            box-shadow: $shadow-card-2;
            transition: all 0.3s cubic-bezier(.25,.8,.25,1);
            z-index: 2;

            #gameCanvas {
                position: relative;
                float: left;
                width: 720px;
                height: 576px;
                overflow: hidden;
                cursor: url("~@/assets/crosshair.png") 16 16, auto;
                z-index: 10;
                background-color: black;

                canvas {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%!important;
                    height: 100%!important;
                }

                .xp-drops {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 100;

                    .xp-drop {
                        position: absolute;
                        top: calc(50% - 100px);
                        left: calc(50% - 100px);
                        height: 100px;
                        width: 200px;
                        line-height: 100px;
                        color: #f1c40f;
                        font-size: 16px;
                        font-weight: 600;
                        animation-duration:1000ms;
                        animation-iteration-count:1;
                        animation-timing-function: ease-out;
                        animation-fill-mode:forwards;
                        animation-name: xpDropAnimation;

                        @keyframes xpDropAnimation{
                            0% {
                                opacity: 1;
                                transform:translateY(0%)
                            } 100% {
                                opacity: 0;
                                transform:translateY(-30px);
                            }
                        }
                    }
                }

                .buff-drops {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 100;

                    .buff-drop {
                        position: absolute;
                        top: calc(50% - 100px);
                        left: calc(50% - 100px);
                        height: 100px;
                        width: 200px;
                        line-height: 100px;
                        color: #2ecc71;
                        font-size: 16px;
                        font-weight: 600;
                        animation-duration:1000ms;
                        animation-iteration-count:1;
                        animation-timing-function: ease-out;
                        animation-fill-mode:forwards;
                        animation-name: xpDropAnimation;

                        @keyframes xpDropAnimation{
                            0% {
                                opacity: 1;
                                transform:translateY(0%)
                            } 100% {
                                opacity: 0;
                                transform:translateY(-30px);
                            }
                        }
                    }
                }
            }

            #HUD {
                position: relative;
                float: left;
                width: calc(100% - 720px);
                height: 576px;
                overflow: hidden;
                font-size: 13px;

                .hud-game-info {
                    position: relative;
                    display: block;
                    width: 100%;
                    height: 255px;
                    overflow: hidden;
                }

                .hud-kill-history {
                    position: relative;
                    display: block;
                    width: 100%;
                    height: 120px;
                    overflow: hidden;
                    font-size: 12px;

                    p {
                        font-weight: 500;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                }

                .hud-menu {
                    position: relative;
                    display: block;
                    width: 100%;
                    height: calc(100% - 120px - 255px);
                }
            }

            #controls {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.9);
                z-index: 999;
                color: #e1e1e1;
            }

            .start-countdown {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                padding-top: 220px;
                z-index: 101;
                pointer-events: none;
                font-size: 13px;
                color: #FFF;
                background-color:rgba(0,0,0,0.75);
            }
            
            .end-game {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 101;
                pointer-events: none;
                font-size: 13px;
                color: #e1e1e1;
                background-color:rgba(0,0,0,0.75);
                visibility: visible!important;

                .scoreboard-row {
                    border-bottom: 1px solid #e1e1e1;
                }
            }

            .respawning {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                padding-top: 220px;
                z-index: 101;
                pointer-events: none;
                font-size: 12px;
                color: #FFF;
                background-color:rgba(0,0,0,0.5);
                visibility: hidden;
            }

            .lines {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 100;
                pointer-events: none;
                display: none;

                &::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: calc(50% - 1px);
                    width: 2px;
                    height: 100%;
                    background-color: yellow;
                }
                
                &::after {
                    content: "";
                    position: absolute;
                    left: 0;
                    top: calc(50% - 1px);
                    height: 2px;
                    width: 100%;
                    background-color: yellow;
                }
            }
        
        }
    }

</style>