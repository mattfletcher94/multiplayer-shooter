import mongoose, { Model } from 'mongoose';

interface IGameMode {
    _id : string,
    gameModeTitle : string,
    gameModeCreatedAt: string,
    gameModeUpdatedAt: string
}

interface IGameModeJSON extends IGameMode {}

interface IGameModeCreate {
    gameModeTitle?: string,
}


const GameMode = mongoose.model<IGameMode & mongoose.Document, Model<IGameMode & mongoose.Document>>('GameMode', new mongoose.Schema({
    gameModeTitle: {
        type: String,
        trim: true,
        required: [true, "Game mode title is required."],
        minlength: [1, "Game mode title should be at least {MINLENGTH} chracters long."],
        maxlength: [255, "Game mode title should be a maximum of {MAXLENGTH} chracters long."],
    },
}, {
    timestamps: { 
        createdAt: 'gameModeCreatedAt', 
        updatedAt: 'gameModeUpdatedAt' 
    },
    toJSON:  {
        virtuals: true,
        versionKey: false,
        transform: function (doc : IGameMode, ret : IGameMode) : IGameModeJSON {
            return {
                _id: doc._id,
                gameModeTitle: doc.gameModeTitle,
                gameModeCreatedAt: doc.gameModeCreatedAt,
                gameModeUpdatedAt: doc.gameModeUpdatedAt
            }
        }
    }
}));

export { GameMode, IGameMode, IGameModeJSON, IGameModeCreate }