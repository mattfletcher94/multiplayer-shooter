"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.app = void 0;
require("./env");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const routes_1 = require("./routes");
const tsoa_1 = require("tsoa");
const JWTException_1 = __importDefault(require("./helpers/JWTException"));
const fs_1 = __importDefault(require("fs"));
const mongoose_1 = __importDefault(require("mongoose"));
// Connect to MongoDB
mongoose_1.default.connect(process.env.DB == "live" ? process.env.DB_CONNECTION : process.env.DB_CONNECTION_DEV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(() => {
    console.log('connected to db.');
}).catch((err) => {
    console.log(err);
});
// Create sever instance
const app = express_1.default();
exports.app = app;
// Cors
app.use(cors_1.default({
    origin: function (origin, callback) {
        return callback(null, true);
    },
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept', 'access-control-max-age']
}));
app.use(cookie_parser_1.default());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
// Init docs
app.use("/docs", swagger_ui_express_1.default.serve, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.send(swagger_ui_express_1.default.generateHTML(yield Promise.resolve().then(() => __importStar(require("./../swagger.json")))));
}));
// To serve static image files
app.get('/assets/maps/:mapId/:mapName', function (req, res) {
    fs_1.default.readFile('assets/maps/' + req.params.mapId + '/' + req.params.mapName, function (err, data) {
        if (err) {
        }
        else {
            res.write(data);
        }
        return res.end();
    });
});
// Register routes 
routes_1.RegisterRoutes(app);
// Error handler
app.use(function errorHandler(err, req, res, next) {
    if (err instanceof tsoa_1.ValidateError) {
        let errors = [];
        for (var key in err === null || err === void 0 ? void 0 : err.fields) {
            errors.push({
                field: err.fields[key].value,
                message: err.fields[key].message
            });
        }
        return res.status(400).json({
            message: "Validation errors in your request",
            errors: errors,
        });
    }
    else if (err instanceof JWTException_1.default) {
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
