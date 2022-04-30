import { Controller, Get, Route, Security, Body, Post, Res, TsoaResponse, Request } from "tsoa";
import { User, IUserJSON, IUserCreate, IUserLogin } from "./../models/User";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import IResponse from "../responses/IResponse";
import IResponseErrors from "../responses/IResponseErrors";
import IResponseServerError from "../responses/IResponseServerError";

@Route("users")
export class UsersController extends Controller {

    @Get("/self")
    @Security("jwt", ["admin", "user"])
    public async userGetSelf(
        @Request() request: any, 
        @Res() success: TsoaResponse<200, IResponse<IUserJSON>>, 
        @Res() error: TsoaResponse<404, IResponse>
    ) {
        try {
            const user = await User.findById(request.user.userId);
            return success(200, {
                message: "The item was found successfully",
                data: user?.toJSON() as IUserJSON
            });
        } catch (err) {
            return error(404, {
                message: "The item does not exist",
                data: null
            });
        }
    }

    @Post("/login")
    public async userLogin(
        @Body() body: IUserLogin, 
        @Res() success: TsoaResponse<200, IResponse<{ token: string, user: IUserJSON }>>, 
        @Res() error: TsoaResponse<400, IResponseErrors>
    ) {

        // If user email wasn't provided
        if (!body.userDisplayName) {
            return error(400, {
                message: "Validation errors in your request",
                errors: [ { field: "userDisplayName", message: "Display name is required." }]
            });
        }

        // If user password wasn't provided
        if (!body.userPassword) {
            return error(400, {
                message: "Validation errors in your request",
                errors: [ { field: "userPassword", message: "Password is required." }]
            });
        }

        // Get user
        const user = await User.findOne({ userDisplayName: body.userDisplayName });
        if (user) {

            // Check password against user
            const validPass = await bcrypt.compare(body.userPassword, user.userPassword);

            // If password is incorrect
            if (validPass) {

                // Logged in successfully, so create a JWT token
                const token = jwt.sign({
                    userId: user?._id,
                    userRole: user?.userRole,
                }, process.env.TOKEN_SECRET as string, {
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

            } else {
                return error(400, {
                    message: "Validation errors in your request",
                    errors: [{ field: "userPassword", message: "\"Password\" is incorrect" } ]
                });
            }

        } else {
            return error(400, {
                message: "Validation errors in your request",
                errors: [{ field: "userDisplayName", message: "Display name not recognised." } ]
            });
        }
    }

    @Post("/register")
    public async userRegister(
        @Body() body: IUserCreate, 
        @Res() success: TsoaResponse<201, IResponse<IUserJSON>>, 
        @Res() error: TsoaResponse<400, IResponseErrors>,
        @Res() serverError: TsoaResponse<500, IResponseServerError>
    ) {
        try {
            
            // Create a new mongo user
            const user = new User({
                userDisplayName: body.userDisplayName,
                userPassword: body.userPassword
            });

            // Is user valid?
            await user.validate();

            // Create hash password
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(user.userPassword, salt);

            // Set the hashed password
            user.userPassword = hash;

            // Create user
            const savedUser = await user.save();

            // Create a token
            const token = jwt.sign({
                userId: savedUser?._id,
                userRole: savedUser?.userRole,
            }, process.env.TOKEN_SECRET as string, {
                issuer: 'Shooter API',
                audience: 'shooter.mattfletcher.name',
                expiresIn: '1440m',
            });

            const userAsJSON = savedUser.toJSON();
            userAsJSON.token = token;

            return success(201, {
                message: 'The item was created successfully.',
                data: userAsJSON as IUserJSON
            });

        } catch (err) {
            if (err && err.name === 'ValidationError') {
                return error(400, {
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

}
