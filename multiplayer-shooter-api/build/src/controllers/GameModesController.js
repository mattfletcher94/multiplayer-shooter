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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameModesController = void 0;
const tsoa_1 = require("tsoa");
const GameMode_1 = require("./../models/GameMode");
let GameModesController = class GameModesController extends tsoa_1.Controller {
    getGameModes(request, success, serverError) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const images = yield GameMode_1.GameMode.find().sort({ '_id': -1 });
                return success(200, {
                    message: "The items were found successfully",
                    data: images.map((item) => {
                        return item.toJSON();
                    })
                });
            }
            catch (err) {
                return serverError(500, err);
            }
        });
    }
    postGameMode(request, body, success, error, serverError) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Create a new mongo game mode
                const gameMode = new GameMode_1.GameMode({
                    gameModeTitle: body.gameModeTitle
                });
                // Is game mode valid?
                yield gameMode.validate();
                // Save user
                const savedGameMode = yield gameMode.save();
                // Return response
                return success(201, {
                    message: "The item was created successfully.",
                    data: savedGameMode.toJSON()
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
};
__decorate([
    tsoa_1.Get(),
    tsoa_1.Security("jwt", ["user", "admin"]),
    __param(0, tsoa_1.Request()),
    __param(1, tsoa_1.Res()),
    __param(2, tsoa_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function, Function]),
    __metadata("design:returntype", Promise)
], GameModesController.prototype, "getGameModes", null);
__decorate([
    tsoa_1.Post(),
    tsoa_1.Security("jwt", ["user", "admin"]),
    __param(0, tsoa_1.Request()),
    __param(1, tsoa_1.Body()),
    __param(2, tsoa_1.Res()),
    __param(3, tsoa_1.Res()),
    __param(4, tsoa_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function, Function, Function]),
    __metadata("design:returntype", Promise)
], GameModesController.prototype, "postGameMode", null);
GameModesController = __decorate([
    tsoa_1.Route("gamemodes")
], GameModesController);
exports.GameModesController = GameModesController;
