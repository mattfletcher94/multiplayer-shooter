import mongoose from 'mongoose';
import moment from 'moment';
import { CustomNodeJsGlobal } from 'src/global';
import { Controller, Get, Route, Security, Body, Post, Res, TsoaResponse, Request, Delete, Path, Patch, SuccessResponse, Response } from "tsoa";
import { Game, IGameJSON, IGameCreate, IGameUpdate } from "../models/Game";
import IResponse from "../responses/IResponse";
import IResponseErrors from "../responses/IResponseErrors";
import IResponseServerError from "../responses/IResponseServerError";
declare const global: CustomNodeJsGlobal;

@Route("games")
export class GamesController extends Controller {

    
    @Get()
    @Security("jwt")
    public async getGameModes(
        @Request() request: any, 
        @Res() success: TsoaResponse<200, IResponse<Array<IGameJSON>>>, 
        @Res() serverError: TsoaResponse<500, IResponseServerError>
    ) {
        try {
            const games = await Game.find().sort({ 'gameStartDatetime' : 1 }).populate('gameMode').populate('gameMap');
            return success(200, {
                message: "The items were found successfully",
                data: games.map((item) => {
                    return item.toJSON() as IGameJSON;
                })
            });
        } catch (err) {
            return serverError(500, err);
        }
    }
    
    @Get("/{gameId}")
    @Security("jwt")
    public async getGameById(
        @Path() gameId: string,
        @Request() req: any, 
        @Res() success: TsoaResponse<200, IResponse<IGameJSON>>, 
        @Res() error: TsoaResponse<404, IResponse>,
        @Res() serverError: TsoaResponse<500, IResponseServerError>,
    ) {
        try {
            const result = await Game.findOne({
                _id: gameId,
            }).populate('gameMode').populate('gameMap');
            if (result) {
                return success(200, {
                    message: "The item was found successfully",
                    data: result.toJSON() as IGameJSON
                });
            } else {
                return error(404, {
                    message: "The item does not exist"
                });
            }
        } catch (err) {
            return serverError(500, err);
        }
    }
    
    @Post()
    @Security("jwt")
    public async postGameMode(
        @Request() request: any, 
        @Body() body: IGameCreate, 
        @Res() success: TsoaResponse<201, IResponse<null>>, 
        @Res() error: TsoaResponse<400, IResponseErrors>,
        @Res() serverError: TsoaResponse<500, IResponseServerError>
    ) {
        try {

            // If user already has a lobby, only allow max of 1. Unless admin
            if (request.user.userRole != "admin") {
                const currentLobbies = await Game.find({
                    gameUser: request.user.userId,
                });
                if (currentLobbies.length > 0) {
                    return error(400, {
                        message: "Validation errors in your request.",
                        errors: [
                            { field: "", message: "Sorry, you can only create one lobby at a time." }
                        ]
                    });
                }
            }

            // Calculate datetimes
            var startDatetime = moment(body.gameStartDatetime, "YYYY-MM-DDTHH:mm").utc();
            var endDatetime = moment(body.gameStartDatetime, "YYYY-MM-DDTHH:mm").add(body.gameTimeLimit, "seconds").utc();

            // Create a new mongo game mode
            const game = new Game({
                gameUser: request.user.userId,
                gameMode: body.gameMode ? mongoose.Types.ObjectId(body.gameMode) : null,
                gameMap: body.gameMap ? mongoose.Types.ObjectId(body.gameMap) : null,
                gameMaxPlayers: body.gameMaxPlayers,
                gameTimeLimit: body.gameTimeLimit,
                gameStartDatetime: startDatetime,
                gameEndDatetime: endDatetime
            });

            // Is game mode valid?
            await game.validate();

            // Save user
            const savedGame = await game.save();
            await savedGame.populate('gameMode').populate('gameMap').execPopulate();

            // Emit event
            if (global.ioLobbies) {
                global.ioLobbies.emit('created', savedGame.toJSON());
            }

            // Return response
            return success(201, {
                message: "The item was created successfully.",
                data: savedGame.toJSON()
            });
            
        } catch (err) {
            if (err && err.name === 'ValidationError') {
                return error(400, {
                    message: "Validation errors in your request.",
                    errors: Object.keys(err.errors).map((k : any) => {
                        return { field: err.errors[k].properties.path, message: err.errors[k].properties.message }
                    })
                });
            } else {
                return serverError(500, err);
            }
        }
    }

    @Patch("/{gameId}")
    @Security("jwt", ["admin"])
    public async updateMap(
        @Path() gameId: string,
        @Request() req: any, 
        @Body() body: IGameUpdate, 
        @Res() success: TsoaResponse<200, IResponse<IGameJSON>>, 
        @Res() errorValidation: TsoaResponse<400, IResponseErrors>,
        @Res() errorNotFound: TsoaResponse<404, IResponse>,
        @Res() serverError: TsoaResponse<500, IResponseServerError>,
    ) {
        try {
            const game = await Game.findOne({ _id: gameId });
            if (game) {

                // Set new attributes
                game.gameOver = body.gameOver == undefined ? game.gameOver : body.gameOver;

                // Attempt to validate
                await game.validate();

                // Now attempt to save
                await game.save();

                // Save is okay so populate map image for returning
                await game.populate('gameMode').populate('gameMap').execPopulate();

                // Return new map
                return success(200, {
                    message: "The item was updated successfully",
                    data: game.toJSON() as IGameJSON
                });

            } else {
                return errorNotFound(404, {
                    message: "The item does not exist"
                });
            }
        } catch (err) {
            if (err && err.name === 'ValidationError') {
                return errorValidation(400, {
                    message: "Validation errors in your request. first",
                    errors: Object.keys(err.errors).map((k : any) => {
                        return { field: err.errors[k].properties.path, message: err.errors[k].properties.message }
                    })
                });
            } else {
                return serverError(500, err);
            }
        }
    }

    @Delete("/{gameId}")
    @Security("jwt", ["admin"])
    public async deleteMap(
        @Path() gameId: string,
        @Request() req: any, 
        @Res() success: TsoaResponse<201, IResponse>, 
        @Res() error: TsoaResponse<404, IResponse>,
        @Res() serverError: TsoaResponse<500, IResponseServerError>
    ) {
        try {
            const result = await Game.deleteOne({
                _id: gameId,
            });
            global.ioLobbies.emit('deleted', gameId);
            if (result.deletedCount && result.deletedCount > 0) {
                return success(201, {
                    message: "The item was deleted successfully"
                });
            } else {
                return error(404, {
                    message: 'The item does not exist'
                });
            }
        } catch (err) {
            return serverError(500, err);
        }
    }

}
