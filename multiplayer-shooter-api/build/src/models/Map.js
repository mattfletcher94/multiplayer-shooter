"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Map = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Map = mongoose_1.default.model('Map', new mongoose_1.default.Schema({
    mapTitle: {
        type: String,
        trim: true,
        required: [true, "Map title is required."],
        minlength: [4, "Display name should be at least {MINLENGTH} chracters long."],
        maxlength: [255, "Display name should be a maximum of {MAXLENGTH} chracters long."],
    },
    mapTexturePath: {
        type: String,
        trim: true,
        required: [true, "Map texture is required."],
    },
    mapCollisionTexturePath: {
        type: String,
        trim: true,
        required: [true, "Map texture is required."],
    }
}, {
    timestamps: {
        createdAt: 'mapCreatedAt',
        updatedAt: 'mapUpdatedAt'
    },
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: function (doc, ret) {
            return {
                _id: doc._id,
                mapTitle: doc.mapTitle,
                mapTexturePath: process.env.BASE_URL + '/' + doc.mapTexturePath,
                mapCollisionTexturePath: process.env.BASE_URL + '/' + doc.mapCollisionTexturePath,
                mapCreatedAt: doc.mapCreatedAt,
                mapUpdatedAt: doc.mapUpdatedAt
            };
        }
    }
}));
exports.Map = Map;
