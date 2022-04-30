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
exports.UsersController = void 0;
const tsoa_1 = require("tsoa");
const User_1 = require("./../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let UsersController = class UsersController extends tsoa_1.Controller {
    userGetSelf(request, success, error) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.User.findById(request.user.userId);
                return success(200, {
                    message: "The item was found successfully",
                    data: user === null || user === void 0 ? void 0 : user.toJSON()
                });
            }
            catch (err) {
                return error(404, {
                    message: "The item does not exist",
                    data: null
                });
            }
        });
    }
    userLogin(body, success, error) {
        return __awaiter(this, void 0, void 0, function* () {
            // If user email wasn't provided
            if (!body.userDisplayName) {
                return error(400, {
                    message: "Validation errors in your request",
                    errors: [{ field: "userDisplayName", message: "Display name is required." }]
                });
            }
            // If user password wasn't provided
            if (!body.userPassword) {
                return error(400, {
                    message: "Validation errors in your request",
                    errors: [{ field: "userPassword", message: "Password is required." }]
                });
            }
            // Get user
            const user = yield User_1.User.findOne({ userDisplayName: body.userDisplayName });
            if (user) {
                // Check password against user
                const validPass = yield bcryptjs_1.default.compare(body.userPassword, user.userPassword);
                // If password is incorrect
                if (validPass) {
                    // Logged in successfully, so create a JWT token
                    const token = jsonwebtoken_1.default.sign({
                        userId: user === null || user === void 0 ? void 0 : user._id,
                        userRole: user === null || user === void 0 ? void 0 : user.userRole,
                    }, process.env.TOKEN_SECRET, {
                        issuer: 'Shooter API',
                        audience: 'shooter.mattfletcher.name',
                        expiresIn: '1440m',
                    });
                    // Return response
                    return success(200, {
                        message: "Logged in succesfully.",
                        data: {
                            user: user.toJSON(),
                            token: token,
                        }
                    });
                }
                else {
                    return error(400, {
                        message: "Validation errors in your request",
                        errors: [{ field: "userPassword", message: "\"Password\" is incorrect" }]
                    });
                }
            }
            else {
                return error(400, {
                    message: "Validation errors in your request",
                    errors: [{ field: "userDisplayName", message: "Display name not recognised." }]
                });
            }
        });
    }
    userRegister(body, success, error, serverError) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Create a new mongo user
                const user = new User_1.User({
                    userDisplayName: body.userDisplayName,
                    userPassword: body.userPassword
                });
                // Is user valid?
                yield user.validate();
                // Create hash password
                const salt = yield bcryptjs_1.default.genSalt(10);
                const hash = yield bcryptjs_1.default.hash(user.userPassword, salt);
                // Set the hashed password
                user.userPassword = hash;
                // Create user
                const savedUser = yield user.save();
                // Create a token
                const token = jsonwebtoken_1.default.sign({
                    userId: savedUser === null || savedUser === void 0 ? void 0 : savedUser._id,
                    userRole: savedUser === null || savedUser === void 0 ? void 0 : savedUser.userRole,
                }, process.env.TOKEN_SECRET, {
                    issuer: 'Shooter API',
                    audience: 'shooter.mattfletcher.name',
                    expiresIn: '1440m',
                });
                const userAsJSON = savedUser.toJSON();
                userAsJSON.token = token;
                return success(201, {
                    message: 'The item was created successfully.',
                    data: userAsJSON
                });
            }
            catch (err) {
                if (err && err.name === 'ValidationError') {
                    return error(400, {
                        message: "Validation errors in your request. first",
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
};
__decorate([
    tsoa_1.Get("/self"),
    tsoa_1.Security("jwt", ["admin", "user"]),
    __param(0, tsoa_1.Request()),
    __param(1, tsoa_1.Res()),
    __param(2, tsoa_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function, Function]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "userGetSelf", null);
__decorate([
    tsoa_1.Post("/login"),
    __param(0, tsoa_1.Body()),
    __param(1, tsoa_1.Res()),
    __param(2, tsoa_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function, Function]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "userLogin", null);
__decorate([
    tsoa_1.Post("/register"),
    __param(0, tsoa_1.Body()),
    __param(1, tsoa_1.Res()),
    __param(2, tsoa_1.Res()),
    __param(3, tsoa_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function, Function, Function]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "userRegister", null);
UsersController = __decorate([
    tsoa_1.Route("users")
], UsersController);
exports.UsersController = UsersController;
