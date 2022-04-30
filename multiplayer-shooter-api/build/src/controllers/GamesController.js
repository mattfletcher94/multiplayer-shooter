"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.GamesController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const moment_1 = __importDefault(require("moment"));
const tsoa_1 = require("tsoa");
const Game_1 = require("../models/Game");
let GamesController = class GamesController extends tsoa_1.Controller {
    getGameModes(request, success, serverError) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const games = yield Game_1.Game.find().sort({ 'gameStartDatetime': 1 }).populate('gameMode').populate('gameMap');
                return success(200, {
                    message: "The items were found successfully",
                    data: games.map((item) => {
                        return item.toJSON();
                    })
                });
            }
            catch (err) {
                return serverError(500, err);
            }
        });
    }
    getGameById(gameId, req, success, error, serverError) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield Game_1.Game.findOne({
                    _id: gameId,
                }).populate('gameMode').populate('gameMap');
                if (result) {
                    return success(200, {
                        message: "The item was found successfully",
                        data: result.toJSON()
                    });
                }
                else {
                    return error(404, {
                        message: "The item does not exist"
                    });
                }
            }
            catch (err) {
                return serverError(500, err);
            }
        });
    }
    postGameMode(request, body, success, error, serverError) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // If user already has a lobby, only allow max of 1. Unless admin
                if (request.user.userRole != "admin") {
                    const currentLobbies = yield Game_1.Game.find({
                        gameUser: request.user.userId,
                    });
                    if (currentLobbies.length > 0) {
                        return error(400, {
                            message: "Validation errors in your request.",
                            errors: [
                                { field: "", message: "Sorry, you can only create one lobby at a time." }
                            ]
                        });
                    }
                }
                // Calculate datetimes
                var startDatetime = moment_1.default(body.gameStartDatetime, "YYYY-MM-DDTHH:mm").utc();
                var endDatetime = moment_1.default(body.gameStartDatetime, "YYYY-MM-DDTHH:mm").add(body.gameTimeLimit, "seconds").utc();
                // Create a new mongo game mode
                const game = new Game_1.Game({
                    gameUser: request.user.userId,
                    gameMode: body.gameMode ? mongoose_1.default.Types.ObjectId(body.gameMode) : null,
                    gameMap: body.gameMap ? mongoose_1.default.Types.ObjectId(body.gameMap) : null,
                    gameMaxPlayers: body.gameMaxPlayers,
                    gameTimeLimit: body.gameTimeLimit,
                    gameStartDatetime: startDatetime,
                    gameEndDatetime: endDatetime
                });
                // Is game mode valid?
                yield game.validate();
                // Save user
                const savedGame = yield game.save();
                yield savedGame.populate('gameMode').populate('gameMap').execPopulate();
                // Emit event
                if (global.ioLobbies) {
                    global.ioLobbies.emit('created', savedGame.toJSON());
                }
                // Return response
                return success(201, {
                    message: "The item was created successfully.",
                    data: savedGame.toJSON()
                });
            }
            catch (err) {
                if (err && err.name === 'ValidationError') {
                    return error(400, {
                        message: "Validation errors in your request.",
                        errors: Object.keys(err.errors).map((k) => {
                            return { field: err.errors[k].properties.path, message: err.errors[k].properties.message };
                        })
                    });
                }
                else {
                    return serverError(500, err);
                }
            }
        });
    }
    updateMap(gameId, req, body, success, errorValidation, errorNotFound, serverError) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const game = yield Game_1.Game.findOne({ _id: gameId });
                if (game) {
                    // Set new attributes
                    game.gameOver = body.gameOver == undefined ? game.gameOver : body.gameOver;
                    // Attempt to validate
                    yield game.validate();
                    // Now attempt to save
                    yield game.save();
                    // Save is okay so populate map image for returning
                    yield game.populate('gameMode').populate('gameMap').execPopulate();
                    // Return new map
                    return success(200, {
                        message: "The item was updated successfully",
                        data: game.toJSON()
                    });
                }
                else {
                    return errorNotFound(404, {
                        message: "The item does not exist"
                    });
                }
            }
            catch (err) {
                if (err && err.name === 'ValidationError') {
                    return errorValidation(400, {
                        message: "Validation errors in your request. first",
                        errors: Object.keys(err.errors).map((k) => {
                            return { field: err.errors[k].properties.path, message: err.errors[k].properties.message };
                        })
                    });
                }
                else {
                    return serverError(500, err);
                }
            }
        });
    }
    deleteMap(gameId, req, success, error, serverError) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield Game_1.Game.deleteOne({
                    _id: gameId,
                });
                global.ioLobbies.emit('deleted', gameId);
                if (result.deletedCount && result.deletedCount > 0) {
                    return success(201, {
                        message: "The item was deleted successfully"
                    });
                }
                else {
                    return error(404, {
                        message: 'The item does not exist'
                    });
                }
            }
            catch (err) {
                return serverError(500, err);
            }
        });
    }
};
__decorate([
    tsoa_1.Get(),
    tsoa_1.Security("jwt"),
    __param(0, tsoa_1.Request()),
    __param(1, tsoa_1.Res()),
    __param(2, tsoa_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function, Function]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "getGameModes", null);
__decorate([
    tsoa_1.Get("/{gameId}"),
    tsoa_1.Security("jwt"),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Request()),
    __param(2, tsoa_1.Res()),
    __param(3, tsoa_1.Res()),
    __param(4, tsoa_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Function, Function, Function]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "getGameById", null);
__decorate([
    tsoa_1.Post(),
    tsoa_1.Security("jwt"),
    __param(0, tsoa_1.Request()),
    __param(1, tsoa_1.Body()),
    __param(2, tsoa_1.Res()),
    __param(3, tsoa_1.Res()),
    __param(4, tsoa_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function, Function, Function]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "postGameMode", null);
__decorate([
    tsoa_1.Patch("/{gameId}"),
    tsoa_1.Security("jwt", ["admin"]),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Request()),
    __param(2, tsoa_1.Body()),
    __param(3, tsoa_1.Res()),
    __param(4, tsoa_1.Res()),
    __param(5, tsoa_1.Res()),
    __param(6, tsoa_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Function, Function, Function, Function]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "updateMap", null);
__decorate([
    tsoa_1.Delete("/{gameId}"),
    tsoa_1.Security("jwt", ["admin"]),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Request()),
    __param(2, tsoa_1.Res()),
    __param(3, tsoa_1.Res()),
    __param(4, tsoa_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Function, Function, Function]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "deleteMap", null);
GamesController = __decorate([
    tsoa_1.Route("games")
], GamesController);
exports.GamesController = GamesController;
