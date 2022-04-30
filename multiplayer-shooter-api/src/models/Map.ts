import mongoose, { Model } from 'mongoose';
import { Omitt } from '../helpers/Omitt';

interface IMap {
    _id : string,
    mapTitle : string,
    mapTexturePath: string,
    mapCollisionTexturePath: string,
    mapCreatedAt: string,
    mapUpdatedAt: string
}

interface IMapJSON extends IMap {}

interface IMapCreate {
    mapTitle?: string,
}


const Map = mongoose.model<IMap & mongoose.Document, Model<IMap & mongoose.Document>>('Map', new mongoose.Schema({
    mapTitle: {
        type: String,
        trim: true,
        required: [true, "Map title is required."],
        minlength: [4, "Display name should be at least {MINLENGTH} chracters long."],
        maxlength: [255, "Display name should be a maximum of {MAXLENGTH} chracters long."],
    },
    mapTexturePath: {
        type: String,
        trim: true,
        required: [true, "Map texture is required."],
    },
    mapCollisionTexturePath: {
        type: String,
        trim: true,
        required: [true, "Map texture is required."],
    }
}, {
    timestamps: { 
        createdAt: 'mapCreatedAt', 
        updatedAt: 'mapUpdatedAt' 
    },
    toJSON:  {
        virtuals: true,
        versionKey: false,
        transform: function (doc : IMap, ret : IMap) : IMapJSON {
            return {
                _id: doc._id,
                mapTitle: doc.mapTitle,
                mapTexturePath: process.env.BASE_URL + '/' + doc.mapTexturePath,
                mapCollisionTexturePath: process.env.BASE_URL + '/' + doc.mapCollisionTexturePath,
                mapCreatedAt: doc.mapCreatedAt,
                mapUpdatedAt: doc.mapUpdatedAt
            }
        }
    }
}));

export { Map, IMap, IMapJSON, IMapCreate }