"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const Game_1 = require("../models/Game");
const socket_1 = require("../socket");
const authMiddleware_1 = __importDefault(require("./authMiddleware"));
const getPixels = require("get-pixels");
const gameloop = require('node-gameloop');
// Create LOBBY_IO
const LOBBY_IO = socket_1.io.of('/lobby');
const rooms = {};
const killHistories = {};
const FPS = 30;
const BULLET_DISTANCE = 300;
const DEFAULT_MOVEMENT_SPEED = 6;
const MAX_MOVEMENT_SPEED = 10;
const DEFAULT_FIRE_RATE = 6;
const MAX_FIRE_RATE = 2;
const DEFAULT_HEALTH = 100;
const MAX_HEALTH = 100;
const DEFAULT_DAMAGE = 10;
const MAX_DAMAGE = 20;
const POSSIBLE_BUFFS = ['speed', 'damage', 'firerate', 'health'];
// Use the JWT function
LOBBY_IO.use(authMiddleware_1.default).use(function (socket, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Make sure lobby still exists before connecting
        const lobby = yield Game_1.Game.findOne({
            _id: socket.handshake.query.lobbyId,
        }).populate('gameMode').populate('gameMap');
        if (lobby) {
            // Set lobby
            socket.lobby = lobby;
            // Some extra checks
            if (rooms[socket.lobby._id]) {
                // Check if lobby is full
                if (rooms[socket.lobby._id].length >= socket.lobby.gameMaxPlayers) {
                    return next(new Error("Lobby Full"));
                }
                // Check if user is already in he lobby
                var players = rooms[socket.lobby._id].filter((s) => {
                    return socket.user._id.toString() === s.user._id.toString();
                });
                if (players.length > 0) {
                    return next(new Error("Already Joined"));
                }
            }
            // Everything is okay
            return next();
        }
        else {
            // Lobby does not exist
            return next(new Error("The lobby does not exist"));
        }
    });
}).on('connection', function (socket) {
    // Join the room
    //socket.join("room-"+ socket.lobby._id);
    if (!rooms[socket.lobby._id]) {
        rooms[socket.lobby._id] = [];
        killHistories[socket.lobby._id] = [];
    }
    // Add socket to room
    rooms[socket.lobby._id].push(socket);
    // Game loop id
    var gameLoopId = -1;
    // Read the maps collision detection image
    getPixels(socket.lobby.gameMap.mapCollisionTexturePath, function (err, pixels) {
        // Get the image width and height,
        // which gets translated to world width and height.
        const worldWidth = pixels.shape[0];
        const worldHeight = pixels.shape[1];
        // Set some extra lobby details
        socket.lobby.hasStarted = false;
        socket.lobby.hasEnded = false;
        socket.lobby.timeUntilStart = 0;
        socket.lobby.timeUntilEnd = 0;
        socket.lobby.killHistory = [];
        // Set the initial player details
        socket.player = {
            id: socket.user._id,
            displayName: socket.user.userDisplayName,
            position: randomPosition(worldWidth, worldHeight, pixels),
            health: DEFAULT_HEALTH,
            speed: DEFAULT_MOVEMENT_SPEED,
            angle: 0,
            shooting: false,
            fireRate: DEFAULT_FIRE_RATE,
            fireRateTimer: DEFAULT_FIRE_RATE,
            fireDamage: DEFAULT_DAMAGE,
            hit: 0,
            dead: false,
            spawnRate: 60,
            spawnTimer: 0,
            kills: 0,
            killStreak: 0,
        };
        // World has been loaded and is ready,
        // emit back to user
        socket.emit("worldReady", {
            worldWidth: worldWidth,
            worldHeight: worldHeight,
        });
        var players = Array();
        // Create the game loop
        gameLoopId = gameloop.setGameLoop(function (delta) {
            // If game has ended, do nothing
            if (socket.lobby.hasEnded) {
                killHistories[socket.lobby._id] = [];
                delete killHistories[socket.lobby._id];
                return;
            }
            // If lobby hasn't started yet,
            // check how long is left
            if (!socket.lobby.hasStarted) {
                // If game has now started
                if (moment_1.default().isAfter(socket.lobby.gameStartDatetime)) {
                    socket.lobby.hasStarted = true;
                }
                // Calculate time until start
                socket.lobby.timeUntilStart = Math.abs(moment_1.default().diff(socket.lobby.gameStartDatetime, 'seconds')).toString();
            }
            // Else game has started
            else {
                // Increment Timers
                socket.player.fireRateTimer++;
                socket.player.hit--;
                // If player is dead, countdown the spawn timer
                if (socket.player.dead) {
                    socket.player.spawnTimer++;
                    if (socket.player.spawnTimer >= socket.player.spawnRate) {
                        socket.player.dead = false;
                        socket.player.spawnTimer = 0;
                        socket.player.killStreak = 0;
                        socket.player.position = randomPosition(worldWidth, worldHeight, pixels);
                        socket.player.health = DEFAULT_HEALTH;
                        socket.player.speed = DEFAULT_MOVEMENT_SPEED;
                        socket.player.fireRate = DEFAULT_FIRE_RATE;
                        socket.player.fireRateTimer = DEFAULT_FIRE_RATE;
                        socket.player.fireDamage = DEFAULT_DAMAGE;
                    }
                }
            }
            // Get players
            players = rooms[socket.lobby._id].map((s) => {
                return s.player;
            });
            // If game has ended
            if (moment_1.default().isAfter(socket.lobby.gameEndDatetime)) {
                socket.lobby.hasEnded = true;
            }
            // Calculate time until end
            socket.lobby.timeUntilEnd = Math.abs(moment_1.default().diff(socket.lobby.gameEndDatetime, 'seconds')).toString();
            // Emit tick event back to client
            socket.emit('tick', {
                hasStarted: socket.lobby.hasStarted,
                timeUntilStart: socket.lobby.timeUntilStart,
                hasEnded: socket.lobby.hasEnded,
                timeUntilEnd: socket.lobby.timeUntilEnd,
                players: players,
                killHistory: killHistories[socket.lobby._id],
            });
        }, 1000 / FPS);
        // On move
        socket.on('playerUpdate', (payload) => {
            // If lobby hasn't started, don't allow player to be updated
            if (!socket.lobby.hasStarted)
                return;
            // If player is dead, do not allow player to be updated
            if (socket.player.dead)
                return;
            // Calculate new player position
            socket.player.position = calculatePosition(worldWidth, worldHeight, pixels, socket.player.position.x, socket.player.position.y, payload.deltaX, payload.deltaY, socket.player.speed);
            ;
            // Calculate new player angle
            socket.player.angle = payload.angle;
            // Set bullet to null
            socket.player.bullet = null;
            // If is shooting
            if (payload.shooting) {
                // Ready to fire
                if (socket.player.fireRateTimer >= socket.player.fireRate) {
                    // Reset fire rate timer
                    socket.player.fireRateTimer = 0;
                    // Calculate bullet end position
                    var bulletStartX = socket.player.position.x;
                    var bulletStartY = socket.player.position.y;
                    var bulletEndX = Math.floor(bulletStartX + (Math.cos(payload.angle) * BULLET_DISTANCE));
                    var bulletEndY = Math.floor(bulletStartY + (Math.sin(payload.angle) * BULLET_DISTANCE));
                    var bulletCollisionBarrierPosition = { x: bulletEndX, y: bulletEndY };
                    var bulletCollisionPlayerPosition = null;
                    var hitPlayer = null;
                    // Check if bullet hit barrier
                    var points = 100;
                    for (var i = 0; i <= points; i++) {
                        var pointBetween = calculatePointBetween(bulletStartX, bulletStartY, bulletEndX, bulletEndY, (i / points));
                        if (pixels.get(Math.floor(pointBetween.x), Math.floor(pointBetween.y), 0) === 255) {
                            bulletCollisionBarrierPosition = pointBetween;
                            break;
                        }
                    }
                    // Check if bullet hit player
                    for (var i = 0; i <= points; i++) {
                        var pointBetween = calculatePointBetween(bulletStartX, bulletStartY, bulletEndX, bulletEndY, (i / points));
                        var hasBeenHit = false;
                        for (var j = 0; j < players.length; j++) {
                            if (players[j].id != socket.player.id && !players[j].dead) {
                                if (checkCollision(players[j].position.x - 40, players[j].position.y - 40, 60, 60, pointBetween.x, pointBetween.y, 1, 1)) {
                                    hasBeenHit = true;
                                    hitPlayer = players[j];
                                    bulletCollisionPlayerPosition = pointBetween;
                                    break;
                                }
                                ;
                            }
                        }
                        if (hasBeenHit) {
                            break;
                        }
                    }
                    // If a player was hit, check distances
                    // And if player is closer than barrier, hit the player.
                    if (bulletCollisionPlayerPosition != null) {
                        var distanceToPlayer = calculateDistance(bulletStartX, bulletStartY, bulletCollisionPlayerPosition.x, bulletCollisionPlayerPosition.y);
                        var distanceToBarrier = calculateDistance(bulletStartX, bulletStartY, bulletCollisionBarrierPosition.x, bulletCollisionBarrierPosition.y);
                        if (distanceToPlayer < distanceToBarrier) {
                            hitPlayer.health -= socket.player.fireDamage;
                            hitPlayer.hit = 5;
                            // If player is now dead
                            if (hitPlayer.health <= 0) {
                                hitPlayer.dead = true;
                                socket.player.kills++;
                                socket.player.killStreak++;
                                // Select a random buff
                                var buff = POSSIBLE_BUFFS[Math.floor(Math.random() * POSSIBLE_BUFFS.length)];
                                if (buff === "speed") {
                                    if (socket.player.speed < MAX_MOVEMENT_SPEED)
                                        socket.player.speed++;
                                }
                                else if (buff === 'firerate') {
                                    if (socket.player.fireRate > MAX_FIRE_RATE)
                                        socket.player.fireRate--;
                                }
                                else if (buff === 'damage') {
                                    if (socket.player.fireDamage < MAX_DAMAGE)
                                        socket.player.fireDamage += 5;
                                }
                                else if (buff === 'health') {
                                    socket.player.health += 20;
                                    if (socket.player.health > MAX_HEALTH) {
                                        socket.player.health = MAX_HEALTH;
                                    }
                                }
                                killHistories[socket.lobby._id].unshift({
                                    id: killHistories[socket.lobby._id].length,
                                    player1: socket.player.displayName,
                                    player1Ks: socket.player.killStreak,
                                    player2: hitPlayer.displayName,
                                    player2Ks: hitPlayer.killStreak,
                                });
                            }
                            socket.player.bullet = {
                                start: {
                                    x: bulletStartX,
                                    y: bulletStartY,
                                },
                                end: {
                                    x: bulletCollisionPlayerPosition.x,
                                    y: bulletCollisionPlayerPosition.y,
                                }
                            };
                        }
                    }
                    // If bullet is stil null, a player wasn't hit but a barrier was
                    if (socket.player.bullet == null) {
                        socket.player.bullet = {
                            start: {
                                x: bulletStartX,
                                y: bulletStartY,
                            },
                            end: {
                                x: bulletCollisionBarrierPosition.x,
                                y: bulletCollisionBarrierPosition.y,
                            }
                        };
                    }
                }
            }
        });
    });
    // On disconnect, remove socket from room
    socket.on('disconnect', function () {
        if (rooms[socket.lobby._id]) {
            var i = rooms[socket.lobby._id].indexOf(socket);
            rooms[socket.lobby._id].splice(i, 1);
        }
        gameloop.clearGameLoop(gameLoopId);
    });
});
function calculatePosition(worldWidth, worldHeight, pixels, x, y, deltaX, deltaY, speed) {
    var newX = x;
    var newY = y;
    // Calculate player movement
    if (deltaX < 0)
        newX += speed;
    else if (deltaX > 0)
        newX -= speed;
    if (deltaY < 0)
        newY += speed;
    else if (deltaY > 0)
        newY -= speed;
    // Lock into bounds of map
    if (newX < 0)
        newX = 0;
    if (newX > worldWidth)
        newX = worldWidth;
    if (newY < 0)
        newY = 0;
    if (newY > worldHeight)
        newY = worldHeight;
    // If player cannot move here, don't move it
    if (pixels.get(Math.floor(newX), Math.floor(newY), 0) == 255) {
        return {
            x: x,
            y: y,
        };
    }
    else {
        return {
            x: newX,
            y: newY
        };
    }
}
function calculateBulletPosition(worldWidth, worldHeight, pixels, x, y, deltaX, deltaY) {
    var newX = x + deltaX;
    var newY = y + deltaY;
    // Lock into bounds of map
    if (newX < 0)
        newX = 0;
    if (newX > worldWidth)
        newX = worldWidth;
    if (newY < 0)
        newY = 0;
    if (newY > worldHeight)
        newY = worldHeight;
    // If player cannot move here, don't move it
    if (pixels.get(Math.floor(newX), Math.floor(newY), 0) == 255) {
        return {
            x: x,
            y: y,
        };
    }
    else {
        return {
            x: newX,
            y: newY
        };
    }
}
function randomPosition(worldWidth, worldHeight, pixels) {
    var randX = Math.floor(Math.random() * (worldWidth - 0 + 1)) + 0;
    var randY = Math.floor(Math.random() * (worldHeight - 0 + 1)) + 0;
    const pixelColorR = pixels.get(randX, randY, 0);
    if (pixelColorR == 255) {
        return randomPosition(worldWidth, worldHeight, pixels);
    }
    else {
        return {
            x: randX,
            y: randY,
        };
    }
}
function calculatePointBetween(x, y, x2, y2, percentage) {
    return {
        x: x + (x2 - x) * percentage,
        y: y + (y2 - y) * percentage
    };
}
function checkCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    if (x1 + w1 > x2 && x1 < x2 + w2 &&
        y1 + h1 > y2 && y1 < y2 + h2) {
        return true;
    }
    return false;
}
function calculateDistance(x1, y1, x2, y2) {
    var a = x1 - x2;
    var b = y1 - y2;
    return Math.sqrt(a * a + b * b);
}
//socket.broadcast.to("room-"+ socket.lobby._id).emit('opponentPlayerLeave', socket.player);
// Emit that this user has joined to the rest of the room
//socket.broadcast.to("room-"+ socket.lobby._id).emit('opponentPlayerJoin', socket.player);
exports.default = { LOBBY_IO };
