import * as express from "express";
import * as jwt from "jsonwebtoken";
import JWTError from "../helpers/JWTException";

export function expressAuthentication(request: express.Request, securityName: string, scopes?: string[]): Promise<any> {

    if (securityName === "jwt") {
        const tokenHeader = request.body.token || request.query.token || request.headers["authorization"];
        return new Promise((resolve, reject) => {
            if (!tokenHeader) {
                reject(new JWTError("No token provided"));
            }
            const token = tokenHeader.split(' ')[1];
            jwt.verify(token, process.env.TOKEN_SECRET as string, function (err: any, decoded: any) {
                if (err) {
                    reject(new JWTError("Invalid token"));
                } else {
           
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