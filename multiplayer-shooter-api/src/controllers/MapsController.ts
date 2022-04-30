import mongoose from 'mongoose';
import { Controller, Get, Route, Security, Body, Post, Res, TsoaResponse, Request, Delete, Path, Patch, SuccessResponse, Response } from "tsoa";
import { Map, IMapJSON, IMapCreate } from "./../models/Map";
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import IResponse from "../responses/IResponse";
import IResponseErrors from "../responses/IResponseErrors";
import IResponseServerError from "../responses/IResponseServerError";
import { promisify } from 'util';

@Route("maps")
export class MapsController extends Controller {

    @Get()
    @Security("jwt")
    public async getMaps(
        @Request() request: any, 
        @Res() success: TsoaResponse<200, IResponse<Array<IMapJSON>>>, 
        @Res() serverError: TsoaResponse<500, IResponseServerError>
    ) {
        try {
            const maps = await Map.find({}).sort({ '_id' : -1 });
            return success(200, {
                message: "The items were found successfully",
                data: maps.map((item) => {
                    return item.toJSON() as IMapJSON;
                })
            });
        } catch (err) {
            return serverError(500, err);
        }
    }

    
    @Post()
    @Security("jwt", ["admin"])
    public async postImage(
        @Request() request: any, 
        @Body() body: IMapCreate, 
        @Res() success: TsoaResponse<201, IResponse<IMapJSON>>, 
        @Res() error: TsoaResponse<400, IResponseErrors>,
        @Res() serverError: TsoaResponse<500, IResponseServerError>
    ) {
        try {

            // Generate a mongo id
            const mapId = mongoose.Types.ObjectId();

            // Handle image file request
            const imagePaths = await this.handleFile(request, mapId.toHexString());
            const unlinkAsync = promisify(fs.rmdir);
            if (imagePaths.mapTexturePath == null) {
                await unlinkAsync('assets/maps/' + mapId, {recursive: true});
                return error(400, {
                    message: "Validation errors in your request.",
                    errors: [
                        { field: 'mapTexture', message: 'Image file is required.'}
                    ]
                });
            }
            if (imagePaths.mapCollisionTexturePath == null) {
                await unlinkAsync('assets/maps/' + mapId, {recursive: true});
                return error(400, {
                    message: "Validation errors in your request.",
                    errors: [
                        { field: 'mapCollisionTexture', message: 'Image file is required.'}
                    ]
                });
            }
            if (!request.body.mapTitle) {
                await unlinkAsync('assets/maps/' + mapId, {recursive: true});
            }
            
            // Create a new image object
            const map = new Map({
                _id: mapId,
                mapTitle: request.body.mapTitle,
                mapTexturePath: imagePaths.mapTexturePath,
                mapCollisionTexturePath: imagePaths.mapCollisionTexturePath,
            });

            // Save the image
            await map.save();

            // Return response
            return success(201, {
                message: "The item was created successfully.",
                data: map.toJSON()
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

    /**
     * Upload file
     */
    private handleFile(request: any, mapId : string): Promise<any> {
        var fileDestination = 'assets/maps/' + mapId + '/';
        var mapTextureFileName = "";
        var mapCollisionTextureFileName = "";
        fs.mkdirSync(fileDestination, { recursive: true });
        const multerSingle = multer({ storage: multer.diskStorage({ 
            destination: (req, file, cb) => { 
                cb(null, fileDestination) 
            }, 
            filename: (req, file, cb) => { 
                if (file.fieldname === 'mapTexture') {
                    mapTextureFileName = 'map-texture' + path.extname(file.originalname);
                    cb(null, mapTextureFileName) ;
                } else if (file.fieldname === 'mapCollisionTexture') {
                    mapCollisionTextureFileName = 'map-collision-texture' + path.extname(file.originalname);
                    cb(null, mapCollisionTextureFileName);
                }
            } 
        })}).fields([{name: "mapTexture", }, {name: "mapCollisionTexture"}]);
        return new Promise((resolve, reject) => {
            multerSingle(request, <any>undefined, async (error : any) => {
                if (error) {
                    reject(error);
                }
                resolve({
                    'mapTexturePath': (mapTextureFileName ? (fileDestination + mapTextureFileName) : null),
                    'mapCollisionTexturePath': (mapCollisionTextureFileName ? (fileDestination + mapCollisionTextureFileName) : null),
                });
            });
        });
    }


}
