/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute, HttpStatusCodeLiteral, TsoaResponse } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { GameModesController } from './controllers/GameModesController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { GamesController } from './controllers/GamesController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MapsController } from './controllers/MapsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UsersController } from './controllers/UsersController';
import { expressAuthentication } from './middleware/authentication';
import * as express from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "IGameModeJSON": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string","required":true},
            "gameModeTitle": {"dataType":"string","required":true},
            "gameModeCreatedAt": {"dataType":"string","required":true},
            "gameModeUpdatedAt": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_Array_IGameModeJSON__": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"array","array":{"ref":"IGameModeJSON"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponseServerError": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "error": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"string"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGameModeCreate": {
        "dataType": "refObject",
        "properties": {
            "gameModeTitle": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_IGameModeJSON_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "data": {"ref":"IGameModeJSON"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponseErrors": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "errors": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"message":{"dataType":"string","required":true},"field":{"dataType":"string","required":true}}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IMap": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string","required":true},
            "mapTitle": {"dataType":"string","required":true},
            "mapTexturePath": {"dataType":"string","required":true},
            "mapCollisionTexturePath": {"dataType":"string","required":true},
            "mapCreatedAt": {"dataType":"string","required":true},
            "mapUpdatedAt": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGameMode": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string","required":true},
            "gameModeTitle": {"dataType":"string","required":true},
            "gameModeCreatedAt": {"dataType":"string","required":true},
            "gameModeUpdatedAt": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGameJSON": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string","required":true},
            "gameUser": {"dataType":"string","required":true},
            "gameMap": {"ref":"IMap","required":true},
            "gameMode": {"ref":"IGameMode","required":true},
            "gameStartDatetime": {"dataType":"string","required":true},
            "gameEndDatetime": {"dataType":"string","required":true},
            "gameOver": {"dataType":"boolean","required":true},
            "gameTimeLimit": {"dataType":"double","required":true},
            "gameMaxPlayers": {"dataType":"double","required":true},
            "gameCreatedAt": {"dataType":"string","required":true},
            "gameUpdatedAt": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_Array_IGameJSON__": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"array","array":{"ref":"IGameJSON"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_IGameJSON_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "data": {"ref":"IGameJSON"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"enum","enums":[null]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGameCreate": {
        "dataType": "refObject",
        "properties": {
            "gameUser": {"dataType":"string"},
            "gameMap": {"dataType":"string"},
            "gameMode": {"dataType":"string"},
            "gameTimeLimit": {"dataType":"double"},
            "gameMaxPlayers": {"dataType":"double"},
            "gameStartDatetime": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_null_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"enum","enums":[null]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGameUpdate": {
        "dataType": "refObject",
        "properties": {
            "gameStarted": {"dataType":"boolean","required":true},
            "gameOver": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IMapJSON": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string","required":true},
            "mapTitle": {"dataType":"string","required":true},
            "mapTexturePath": {"dataType":"string","required":true},
            "mapCollisionTexturePath": {"dataType":"string","required":true},
            "mapCreatedAt": {"dataType":"string","required":true},
            "mapUpdatedAt": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_Array_IMapJSON__": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"array","array":{"ref":"IMapJSON"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IMapCreate": {
        "dataType": "refObject",
        "properties": {
            "mapTitle": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_IMapJSON_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "data": {"ref":"IMapJSON"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_IUser.Exclude_keyofIUser.userPassword__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"userCreatedAt":{"dataType":"string","required":true},"userUpdatedAt":{"dataType":"string","required":true},"_id":{"dataType":"string","required":true},"userDisplayName":{"dataType":"string","required":true},"userRole":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserJSON": {
        "dataType": "refObject",
        "properties": {
            "userCreatedAt": {"dataType":"string","required":true},
            "userUpdatedAt": {"dataType":"string","required":true},
            "_id": {"dataType":"string","required":true},
            "userDisplayName": {"dataType":"string","required":true},
            "userRole": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse_IUserJSON_": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "data": {"ref":"IUserJSON"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserLogin": {
        "dataType": "refObject",
        "properties": {
            "userDisplayName": {"dataType":"string"},
            "userPassword": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponse__token-string.user-IUserJSON__": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"user":{"ref":"IUserJSON","required":true},"token":{"dataType":"string","required":true}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserCreate": {
        "dataType": "refObject",
        "properties": {
            "userDisplayName": {"dataType":"string"},
            "userPassword": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: express.Router) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
        app.get('/gamemodes',
            authenticateMiddleware([{"jwt":["user","admin"]}]),
            function (request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    success: {"in":"res","name":"200","required":true,"ref":"IResponse_Array_IGameModeJSON__"},
                    serverError: {"in":"res","name":"500","required":true,"ref":"IResponseServerError"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller = new GameModesController();


            const promise = controller.getGameModes.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/gamemodes',
            authenticateMiddleware([{"jwt":["user","admin"]}]),
            function (request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    body: {"in":"body","name":"body","required":true,"ref":"IGameModeCreate"},
                    success: {"in":"res","name":"201","required":true,"ref":"IResponse_IGameModeJSON_"},
                    error: {"in":"res","name":"400","required":true,"ref":"IResponseErrors"},
                    serverError: {"in":"res","name":"500","required":true,"ref":"IResponseServerError"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller = new GameModesController();


            const promise = controller.postGameMode.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/games',
            authenticateMiddleware([{"jwt":[]}]),
            function (request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    success: {"in":"res","name":"200","required":true,"ref":"IResponse_Array_IGameJSON__"},
                    serverError: {"in":"res","name":"500","required":true,"ref":"IResponseServerError"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller = new GamesController();


            const promise = controller.getGameModes.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/games/:gameId',
            authenticateMiddleware([{"jwt":[]}]),
            function (request: any, response: any, next: any) {
            const args = {
                    gameId: {"in":"path","name":"gameId","required":true,"dataType":"string"},
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
                    success: {"in":"res","name":"200","required":true,"ref":"IResponse_IGameJSON_"},
                    error: {"in":"res","name":"404","required":true,"ref":"IResponse"},
                    serverError: {"in":"res","name":"500","required":true,"ref":"IResponseServerError"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller = new GamesController();


            const promise = controller.getGameById.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/games',
            authenticateMiddleware([{"jwt":[]}]),
            function (request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    body: {"in":"body","name":"body","required":true,"ref":"IGameCreate"},
                    success: {"in":"res","name":"201","required":true,"ref":"IResponse_null_"},
                    error: {"in":"res","name":"400","required":true,"ref":"IResponseErrors"},
                    serverError: {"in":"res","name":"500","required":true,"ref":"IResponseServerError"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller = new GamesController();


            const promise = controller.postGameMode.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.patch('/games/:gameId',
            authenticateMiddleware([{"jwt":["admin"]}]),
            function (request: any, response: any, next: any) {
            const args = {
                    gameId: {"in":"path","name":"gameId","required":true,"dataType":"string"},
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
                    body: {"in":"body","name":"body","required":true,"ref":"IGameUpdate"},
                    success: {"in":"res","name":"200","required":true,"ref":"IResponse_IGameJSON_"},
                    errorValidation: {"in":"res","name":"400","required":true,"ref":"IResponseErrors"},
                    errorNotFound: {"in":"res","name":"404","required":true,"ref":"IResponse"},
                    serverError: {"in":"res","name":"500","required":true,"ref":"IResponseServerError"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller = new GamesController();


            const promise = controller.updateMap.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/games/:gameId',
            authenticateMiddleware([{"jwt":["admin"]}]),
            function (request: any, response: any, next: any) {
            const args = {
                    gameId: {"in":"path","name":"gameId","required":true,"dataType":"string"},
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
                    success: {"in":"res","name":"201","required":true,"ref":"IResponse"},
                    error: {"in":"res","name":"404","required":true,"ref":"IResponse"},
                    serverError: {"in":"res","name":"500","required":true,"ref":"IResponseServerError"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller = new GamesController();


            const promise = controller.deleteMap.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/maps',
            authenticateMiddleware([{"jwt":[]}]),
            function (request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    success: {"in":"res","name":"200","required":true,"ref":"IResponse_Array_IMapJSON__"},
                    serverError: {"in":"res","name":"500","required":true,"ref":"IResponseServerError"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller = new MapsController();


            const promise = controller.getMaps.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/maps',
            authenticateMiddleware([{"jwt":["admin"]}]),
            function (request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    body: {"in":"body","name":"body","required":true,"ref":"IMapCreate"},
                    success: {"in":"res","name":"201","required":true,"ref":"IResponse_IMapJSON_"},
                    error: {"in":"res","name":"400","required":true,"ref":"IResponseErrors"},
                    serverError: {"in":"res","name":"500","required":true,"ref":"IResponseServerError"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller = new MapsController();


            const promise = controller.postImage.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/users/self',
            authenticateMiddleware([{"jwt":["admin","user"]}]),
            function (request: any, response: any, next: any) {
            const args = {
                    request: {"in":"request","name":"request","required":true,"dataType":"object"},
                    success: {"in":"res","name":"200","required":true,"ref":"IResponse_IUserJSON_"},
                    error: {"in":"res","name":"404","required":true,"ref":"IResponse"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller = new UsersController();


            const promise = controller.userGetSelf.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/users/login',
            function (request: any, response: any, next: any) {
            const args = {
                    body: {"in":"body","name":"body","required":true,"ref":"IUserLogin"},
                    success: {"in":"res","name":"200","required":true,"ref":"IResponse__token-string.user-IUserJSON__"},
                    error: {"in":"res","name":"400","required":true,"ref":"IResponseErrors"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller = new UsersController();


            const promise = controller.userLogin.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/users/register',
            function (request: any, response: any, next: any) {
            const args = {
                    body: {"in":"body","name":"body","required":true,"ref":"IUserCreate"},
                    success: {"in":"res","name":"201","required":true,"ref":"IResponse_IUserJSON_"},
                    error: {"in":"res","name":"400","required":true,"ref":"IResponseErrors"},
                    serverError: {"in":"res","name":"500","required":true,"ref":"IResponseServerError"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller = new UsersController();


            const promise = controller.userRegister.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return (request: any, _response: any, next: any) => {
            let responded = 0;
            let success = false;

            const succeed = function(user: any) {
                if (!success) {
                    success = true;
                    responded++;
                    request['user'] = user;
                    next();
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            const fail = function(error: any) {
                responded++;
                if (responded == security.length && !success) {
                    error.status = error.status || 401;
                    next(error)
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    let promises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        promises.push(expressAuthentication(request, name, secMethod[name]));
                    }

                    Promise.all(promises)
                        .then((users) => { succeed(users[0]); })
                        .catch(fail);
                } else {
                    for (const name in secMethod) {
                        expressAuthentication(request, name, secMethod[name])
                            .then(succeed)
                            .catch(fail);
                    }
                }
            }
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode;
                let headers;
                if (isController(controllerObj)) {
                    headers = controllerObj.getHeaders();
                    statusCode = controllerObj.getStatus();
                }

                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                returnHandler(response, statusCode, data, headers)
            })
            .catch((error: any) => next(error));
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function returnHandler(response: any, statusCode?: number, data?: any, headers: any = {}) {
        Object.keys(headers).forEach((name: string) => {
            response.set(name, headers[name]);
        });
        if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
            data.pipe(response);
        } else if (data || data === false) { // === false allows boolean result
            response.status(statusCode || 200).json(data);
        } else {
            response.status(statusCode || 204).end();
        }
    }
    
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function responder(response: any): TsoaResponse<HttpStatusCodeLiteral, unknown>  {
        return function(status, data, headers) {
            returnHandler(response, status, data, headers);
        };
    };

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function getValidatedArgs(args: any, request: any, response: any): any[] {
        const fieldErrors: FieldErrors  = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'res':
                    return responder(response);
            }
        });

        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
