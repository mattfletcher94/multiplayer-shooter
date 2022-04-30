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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressAuthentication = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const JWTException_1 = __importDefault(require("../helpers/JWTException"));
function expressAuthentication(request, securityName, scopes) {
    if (securityName === "jwt") {
        const tokenHeader = request.body.token || request.query.token || request.headers["authorization"];
        return new Promise((resolve, reject) => {
            if (!tokenHeader) {
                reject(new JWTException_1.default("No token provided"));
            }
            const token = tokenHeader.split(' ')[1];
            jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
                if (err) {
                    reject(new JWTException_1.default("Invalid token"));
                }
                else {
                    // Check if JWT contains all required scopes
                    if (Array.isArray(scopes)) {
                        if (scopes.length > 0) {
                            if (!scopes.includes(decoded.userRole)) {
                                reject(new Error("JWT does not contain required scope."));
                            }
                        }
                    }
                    resolve(decoded);
                }
            });
        });
    }
    else {
        return Promise.reject({});
    }
}
exports.expressAuthentication = expressAuthentication;
