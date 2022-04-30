import { Controller, Get, Route, Security, Body, Post, Res, TsoaResponse, Request, Delete, Path, Patch, SuccessResponse, Response } from "tsoa";
import { GameMode, IGameModeJSON, IGameModeCreate } from "./../models/GameMode";
import IResponse from "../responses/IResponse";
import IResponseErrors from "../responses/IResponseErrors";
import IResponseServerError from "../responses/IResponseServerError";

@Route("gamemodes")
export class GameModesController extends Controller {

    
    @Get()
    @Security("jwt", ["user", "admin"])
    public async getGameModes(
        @Request() request: any, 
        @Res() success: TsoaResponse<200, IResponse<Array<IGameModeJSON>>>, 
        @Res() serverError: TsoaResponse<500, IResponseServerError>
    ) {
        try {
            const images = await GameMode.find().sort({ '_id' : -1 });
            return success(200, {
                message: "The items were found successfully",
                data: images.map((item) => {
                    return item.toJSON() as IGameModeJSON;
                })
            });
        } catch (err) {
            return serverError(500, err);
        }
    }
    
    @Post()
    @Security("jwt", ["user", "admin"])
    public async postGameMode(
        @Request() request: any, 
        @Body() body: IGameModeCreate, 
        @Res() success: TsoaResponse<201, IResponse<IGameModeJSON>>, 
        @Res() error: TsoaResponse<400, IResponseErrors>,
        @Res() serverError: TsoaResponse<500, IResponseServerError>
    ) {
        try {

            // Create a new mongo game mode
            const gameMode = new GameMode({
                gameModeTitle: body.gameModeTitle
            });

            // Is game mode valid?
            await gameMode.validate();

            // Save user
            const savedGameMode = await gameMode.save();

            // Return response
            return success(201, {
                message: "The item was created successfully.",
                data: savedGameMode.toJSON()
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

}
