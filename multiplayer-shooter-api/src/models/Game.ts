import mongoose, { Model } from 'mongoose';
import { IGameMode } from './GameMode';
import { IMap } from './Map';

interface IGame {
    _id : string,
    gameUser: string,
    gameMap: string | IMap,
    gameMode: string | IGameMode,
    gameStartDatetime: string,
    gameEndDatetime: string,
    gameOver: boolean,
    gameTimeLimit: number,
    gameMaxPlayers: number,
    gameCreatedAt: string,
    gameUpdatedAt: string
}

interface IGameJSON extends IGame {
    gameMap: IMap;
    gameMode: IGameMode;
}

interface IGameCreate {
    gameUser?: string,
    gameMap?: string,
    gameMode?: string,
    gameTimeLimit?: number,
    gameMaxPlayers?: number,
    gameStartDatetime?: string,
}

interface IGameUpdate {
    gameStarted: boolean,
    gameOver: boolean,
}


const Game = mongoose.model<IGame & mongoose.Document, Model<IGame & mongoose.Document>>('Game', new mongoose.Schema({
    gameUser: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: [true, "Game user is a required field."],
    },
    gameMap: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Map',
        required: [true, "Game map is a required field."],
    },
    gameMode: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'GameMode',
        required: [true, "Game mode is a required field."],
    },
    gameStartDatetime: {
        type: Date,
        required: [true, "Game start date-time is a required field."],
    },
    gameEndDatetime: {
        type: Date,
        default: Date.now,
        expires: '1m',
        required: [true, "Game end date-time is a required field."],
    },
    gameTimeLimit: {
        type: Number,
        default: 300,
        required: [true, "Game time limit is a required field."],
        min: [60, 'Game time limit must be a minimum of 60 seconds (1 min).'],
        max: [3600, 'Game time limit must be a maximum of 3600 seconds (60 min).']
    },
    gameMaxPlayers: {
        type: Number,
        default: 12,
        required: [true, "Game max players is a required field."],
        min: [2, 'Game max players must be a minimum of 2'],
        max: [20, 'Game max players must be a maximum of 20']
    },
}, {
    timestamps: { 
        createdAt: 'gameCreatedAt', 
        updatedAt: 'gameUpdatedAt' 
    },
    toJSON:  {
        virtuals: true,
        versionKey: false,
        transform: function (doc : IGame, ret : IGame) : IGameJSON {
            return {
                _id: doc._id,
                gameUser: doc.gameUser,
                gameMap: doc.gameMap as IMap || null,
                gameMode: doc.gameMode as IGameMode || null,
                gameStartDatetime: doc.gameStartDatetime,
                gameEndDatetime: doc.gameEndDatetime,
                gameOver: doc.gameOver,
                gameTimeLimit: doc.gameTimeLimit,
                gameMaxPlayers: doc.gameMaxPlayers,
                gameCreatedAt: doc.gameCreatedAt,
                gameUpdatedAt: doc.gameUpdatedAt
            }
        }
    },
    
}));


//Game.createIndexes({"expire_at": 1 }, { expireAfterSeconds: 5 } );



export { Game, IGame, IGameJSON, IGameCreate, IGameUpdate }