"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameMode = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const GameMode = mongoose_1.default.model('GameMode', new mongoose_1.default.Schema({
    gameModeTitle: {
        type: String,
        trim: true,
        required: [true, "Game mode title is required."],
        minlength: [1, "Game mode title should be at least {MINLENGTH} chracters long."],
        maxlength: [255, "Game mode title should be a maximum of {MAXLENGTH} chracters long."],
    },
}, {
    timestamps: {
        createdAt: 'gameModeCreatedAt',
        updatedAt: 'gameModeUpdatedAt'
    },
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: function (doc, ret) {
            return {
                _id: doc._id,
                gameModeTitle: doc.gameModeTitle,
                gameModeCreatedAt: doc.gameModeCreatedAt,
                gameModeUpdatedAt: doc.gameModeUpdatedAt
            };
        }
    }
}));
exports.GameMode = GameMode;
