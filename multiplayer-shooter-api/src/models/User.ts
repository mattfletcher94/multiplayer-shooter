import mongoose, { Model } from 'mongoose';
import { Omitt } from '../helpers/Omitt';

interface IUser {
    _id : string,
    userDisplayName : string,
    userPassword: string,
    userCreatedAt: string,
    userUpdatedAt: string
    userRole: string
}

interface IUserJSON extends Omitt<IUser, 'userPassword'> {}

interface IUserCreate {
    userDisplayName?: string,
    userPassword?: string,
}

interface IUserLogin {
    userDisplayName?: string,
    userPassword?: string
}

const User = mongoose.model<IUser & mongoose.Document, Model<IUser & mongoose.Document>>('User', new mongoose.Schema({
    userDisplayName: {
        type: String,
        trim: true,
        required: [true, "Display name is required."],
        minlength: [4, "Display name should be at least {MINLENGTH} chracters long."],
        maxlength: [255, "Display name should be a maximum of {MAXLENGTH} chracters long."],
        validate: {
            validator: async function (this : IUser, userDisplayName : string) : Promise<boolean> {
                const map = await User.findOne({ userDisplayName: userDisplayName, _id: { $ne: this._id }  });
                return Promise.resolve(map == null ? true : false);
            },
            message: (props) => `Display name must be unique.`
        },
    },
    userPassword: {
        type: String,
        trim: true,
        required: [true, "Password is required."],
        minlength: [6, "Password should be at least {MINLENGTH} chracters long."],
    },
    userRole: {
        type: String,
        trim: true,
        required: [true, "User role is required"],
        enum: ['user', 'admin'],
        default: 'user',
    }
}, {
    timestamps: { 
        createdAt: 'userCreatedAt', 
        updatedAt: 'userUpdatedAt' 
    },
    toJSON:  {
        virtuals: true,
        versionKey: false,
        transform: function (doc : IUser, ret : IUser) : IUserJSON {
            return {
                _id: doc._id,
                userDisplayName: doc.userDisplayName,
                userCreatedAt: doc.userCreatedAt,
                userUpdatedAt: doc.userUpdatedAt,
                userRole: doc.userRole
            }
        }
    }
}));

export { User, IUser, IUserJSON, IUserCreate, IUserLogin }