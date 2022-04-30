"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JWTError extends Error {
    constructor(message) {
        super(message); // 'Error' breaks prototype chain here
        this.name = 'JWTError';
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}
exports.default = JWTError;
