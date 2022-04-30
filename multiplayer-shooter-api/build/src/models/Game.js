"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Game = mongoose_1.default.model('Game', new mongoose_1.default.Schema({
    gameUser: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Game user is a required field."],
    },
    gameMap: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Map',
        required: [true, "Game map is a required field."],
    },
    gameMode: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'GameMode',
        required: [true, "Game mode is a required field."],
    },
    gameStartDatetime: {
        type: Date,
        required: [true, "Game start date-time is a required field."],
    },
    gameEndDatetime: {
        type: Date,
        default: Date.now,
        expires: '1m',
        required: [true, "Game end date-time is a required field."],
    },
    gameTimeLimit: {
        type: Number,
        default: 300,
        required: [true, "Game time limit is a required field."],
        min: [60, 'Game time limit must be a minimum of 60 seconds (1 min).'],
        max: [3600, 'Game time limit must be a maximum of 3600 seconds (60 min).']
    },
    gameMaxPlayers: {
        type: Number,
        default: 12,
        required: [true, "Game max players is a required field."],
        min: [2, 'Game max players must be a minimum of 2'],
        max: [20, 'Game max players must be a maximum of 20']
    },
}, {
    timestamps: {
        createdAt: 'gameCreatedAt',
        updatedAt: 'gameUpdatedAt'
    },
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: function (doc, ret) {
            return {
                _id: doc._id,
                gameUser: doc.gameUser,
                gameMap: doc.gameMap || null,
                gameMode: doc.gameMode || null,
                gameStartDatetime: doc.gameStartDatetime,
                gameEndDatetime: doc.gameEndDatetime,
                gameOver: doc.gameOver,
                gameTimeLimit: doc.gameTimeLimit,
                gameMaxPlayers: doc.gameMaxPlayers,
                gameCreatedAt: doc.gameCreatedAt,
                gameUpdatedAt: doc.gameUpdatedAt
            };
        }
    },
}));
exports.Game = Game;
