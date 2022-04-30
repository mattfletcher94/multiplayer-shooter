import './env';
import express, { Response as ExResponse, Request as ExRequest, NextFunction, } from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./routes";
import { ValidateError } from 'tsoa';
import JWTError from './helpers/JWTException';
import fs from 'fs';
import mongoose from 'mongoose';


// Connect to MongoDB
mongoose.connect(process.env.DB == "live" ? process.env.DB_CONNECTION as string : process.env.DB_CONNECTION_DEV as string, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(() => {
    console.log('connected to db.');
}).catch((err) => {
    console.log(err);
});


// Create sever instance
const app = express();


// Cors
app.use(cors({
    origin: function(origin, callback){
        return callback(null, true);
    },
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept', 'access-control-max-age']
})); 



app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Init docs
app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
    return res.send(swaggerUi.generateHTML(await import("./../swagger.json")));
});

// To serve static image files
app.get('/assets/maps/:mapId/:mapName', function( req, res ) {
    fs.readFile('assets/maps/' + req.params.mapId + '/' + req.params.mapName, function(err, data) {
        if (err) {
            
        } else {
            res.write(data);
        }
        return res.end();
    });
});


// Register routes 
RegisterRoutes(app);

// Error handler
app.use(function errorHandler(
    err: unknown,
    req: ExRequest,
    res: ExResponse,
    next: NextFunction
  ): ExResponse | void {
    if (err instanceof ValidateError) {
        let errors = [];
        for (var key in err?.fields) {
            errors.push({
                field: err.fields[key].value,
                message: err.fields[key].message
            })
        }
        return res.status(400).json({
            message: "Validation errors in your request",
            errors: errors,
        });
    }
    else if (err instanceof JWTError) {
        return res.status(401).json({
            message: err.message,
          });
    }
    else if (err instanceof Error) {
        return res.status(500).json({
          message: "Internal Server Error",
        });
    }
    next();
});



// Exports
export { app };
