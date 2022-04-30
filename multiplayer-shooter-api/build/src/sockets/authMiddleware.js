"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
const jwt = __importStar(require("jsonwebtoken"));
const User_1 = require("../models/User");
const JWTException_1 = __importDefault(require("../helpers/JWTException"));
function default_1(socket, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (socket.handshake.query && socket.handshake.query.jwt) {
            jwt.verify(socket.handshake.query.jwt, process.env.TOKEN_SECRET, function (err, decoded) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        return next(new JWTException_1.default("Invalid token"));
                    }
                    else {
                        const user = yield User_1.User.findById(decoded.userId);
                        socket.user = user === null || user === void 0 ? void 0 : user.toJSON();
                        next();
                    }
                });
            });
        }
        else {
            return next(new Error("Invalid token"));
        }
    });
}
exports.default = default_1;
