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
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const User = mongoose_1.default.model('User', new mongoose_1.default.Schema({
    userDisplayName: {
        type: String,
        trim: true,
        required: [true, "Display name is required."],
        minlength: [4, "Display name should be at least {MINLENGTH} chracters long."],
        maxlength: [255, "Display name should be a maximum of {MAXLENGTH} chracters long."],
        validate: {
            validator: function (userDisplayName) {
                return __awaiter(this, void 0, void 0, function* () {
                    const map = yield User.findOne({ userDisplayName: userDisplayName, _id: { $ne: this._id } });
                    return Promise.resolve(map == null ? true : false);
                });
            },
            message: (props) => `Display name must be unique.`
        },
    },
    userPassword: {
        type: String,
        trim: true,
        required: [true, "Password is required."],
        minlength: [6, "Password should be at least {MINLENGTH} chracters long."],
    },
    userRole: {
        type: String,
        trim: true,
        required: [true, "User role is required"],
        enum: ['user', 'admin'],
        default: 'user',
    }
}, {
    timestamps: {
        createdAt: 'userCreatedAt',
        updatedAt: 'userUpdatedAt'
    },
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: function (doc, ret) {
            return {
                _id: doc._id,
                userDisplayName: doc.userDisplayName,
                userCreatedAt: doc.userCreatedAt,
                userUpdatedAt: doc.userUpdatedAt,
                userRole: doc.userRole
            };
        }
    }
}));
exports.User = User;
