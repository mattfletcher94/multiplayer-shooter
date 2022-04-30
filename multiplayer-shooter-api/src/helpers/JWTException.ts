export default class JWTError extends Error {
    constructor(message?: string) {
        super(message); // 'Error' breaks prototype chain here
        this.name = 'JWTError';
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}