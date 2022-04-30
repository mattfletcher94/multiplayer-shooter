import * as jwt from "jsonwebtoken";
import { User } from "../models/User";
import JWTError from "../helpers/JWTException";

export default async function(socket : any, next : any) {
    if (socket.handshake.query && socket.handshake.query.jwt){
        jwt.verify(socket.handshake.query.jwt, process.env.TOKEN_SECRET as string, async function (err: any, decoded: any) {
            if (err) {
                return next(new JWTError("Invalid token"));
            } else {
                const user = await User.findById(decoded.userId);
                socket.user = user?.toJSON()
                next();
            }
        });
    }
    else {
        return next(new Error("Invalid token"));
    }
}