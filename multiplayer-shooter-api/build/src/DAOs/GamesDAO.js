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
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = require("../models/Game");
class GamesDAO {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const games = yield Game_1.Game.find().sort({ 'gameStartDatetime': 1 }).populate('gameMode').populate('gameMap');
            return games;
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Game_1.Game.findOne({
                _id: id,
            }).populate('gameMode').populate('gameMap');
            return result;
        });
    }
}
exports.default = GamesDAO;
