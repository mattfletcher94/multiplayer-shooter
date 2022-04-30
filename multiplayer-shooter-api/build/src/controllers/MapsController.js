"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.MapsController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const tsoa_1 = require("tsoa");
const Map_1 = require("./../models/Map");
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
let MapsController = class MapsController extends tsoa_1.Controller {
    getMaps(request, success, serverError) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const maps = yield Map_1.Map.find({}).sort({ '_id': -1 });
                return success(200, {
                    message: "The items were found successfully",
                    data: maps.map((item) => {
                        return item.toJSON();
                    })
                });
            }
            catch (err) {
                return serverError(500, err);
            }
        });
    }
    postImage(request, body, success, error, serverError) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Generate a mongo id
                const mapId = mongoose_1.default.Types.ObjectId();
                // Handle image file request
                const imagePaths = yield this.handleFile(request, mapId.toHexString());
                const unlinkAsync = util_1.promisify(fs_1.default.rmdir);
                if (imagePaths.mapTexturePath == null) {
                    yield unlinkAsync('assets/maps/' + mapId, { recursive: true });
                    return error(400, {
                        message: "Validation errors in your request.",
                        errors: [
                            { field: 'mapTexture', message: 'Image file is required.' }
                        ]
                    });
                }
                if (imagePaths.mapCollisionTexturePath == null) {
                    yield unlinkAsync('assets/maps/' + mapId, { recursive: true });
                    return error(400, {
                        message: "Validation errors in your request.",
                        errors: [
                            { field: 'mapCollisionTexture', message: 'Image file is required.' }
                        ]
                    });
                }
                if (!request.body.mapTitle) {
                    yield unlinkAsync('assets/maps/' + mapId, { recursive: true });
                }
                // Create a new image object
                const map = new Map_1.Map({
                    _id: mapId,
                    mapTitle: request.body.mapTitle,
                    mapTexturePath: imagePaths.mapTexturePath,
                    mapCollisionTexturePath: imagePaths.mapCollisionTexturePath,
                });
                // Save the image
                yield map.save();
                // Return response
                return success(201, {
                    message: "The item was created successfully.",
                    data: map.toJSON()
                });
            }
            catch (err) {
                if (err && err.name === 'ValidationError') {
                    return error(400, {
                        message: "Validation errors in your request.",
                        errors: Object.keys(err.errors).map((k) => {
                            return { field: err.errors[k].properties.path, message: err.errors[k].properties.message };
                        })
                    });
                }
                else {
                    return serverError(500, err);
                }
            }
        });
    }
    /**
     * Upload file
     */
    handleFile(request, mapId) {
        var fileDestination = 'assets/maps/' + mapId + '/';
        var mapTextureFileName = "";
        var mapCollisionTextureFileName = "";
        fs_1.default.mkdirSync(fileDestination, { recursive: true });
        const multerSingle = multer_1.default({ storage: multer_1.default.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, fileDestination);
                },
                filename: (req, file, cb) => {
                    if (file.fieldname === 'mapTexture') {
                        mapTextureFileName = 'map-texture' + path_1.default.extname(file.originalname);
                        cb(null, mapTextureFileName);
                    }
                    else if (file.fieldname === 'mapCollisionTexture') {
                        mapCollisionTextureFileName = 'map-collision-texture' + path_1.default.extname(file.originalname);
                        cb(null, mapCollisionTextureFileName);
                    }
                }
            }) }).fields([{ name: "mapTexture", }, { name: "mapCollisionTexture" }]);
        return new Promise((resolve, reject) => {
            multerSingle(request, undefined, (error) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    reject(error);
                }
                resolve({
                    'mapTexturePath': (mapTextureFileName ? (fileDestination + mapTextureFileName) : null),
                    'mapCollisionTexturePath': (mapCollisionTextureFileName ? (fileDestination + mapCollisionTextureFileName) : null),
                });
            }));
        });
    }
};
__decorate([
    tsoa_1.Get(),
    tsoa_1.Security("jwt"),
    __param(0, tsoa_1.Request()),
    __param(1, tsoa_1.Res()),
    __param(2, tsoa_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function, Function]),
    __metadata("design:returntype", Promise)
], MapsController.prototype, "getMaps", null);
__decorate([
    tsoa_1.Post(),
    tsoa_1.Security("jwt", ["admin"]),
    __param(0, tsoa_1.Request()),
    __param(1, tsoa_1.Body()),
    __param(2, tsoa_1.Res()),
    __param(3, tsoa_1.Res()),
    __param(4, tsoa_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function, Function, Function]),
    __metadata("design:returntype", Promise)
], MapsController.prototype, "postImage", null);
MapsController = __decorate([
    tsoa_1.Route("maps")
], MapsController);
exports.MapsController = MapsController;
