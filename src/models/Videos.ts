import mongoose,{Schema,model,models} from "mongoose";
 
export const VIDEO_DIMENTIONS ={
    height: 1920,
    width: 1080,
} as const;

export interface IVideo {
    _id?: mongoose.Types.ObjectId;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    controls?:boolean;
    transformation?:{
        height?: number;
        width?: number;
        quality?: number;
    }
}

const videoSchema = new Schema<IVideo>({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    thumbnailUrl: {
        type: String,
        required: true,
    },
    controls: {
        type: Boolean,
        default: true,
    },
    transformation: {
        height: {
            type: Number,
            default: VIDEO_DIMENTIONS.height,
        },
        width: {
            type: Number,
            default: VIDEO_DIMENTIONS.width,
        },
        quality: {
            type: Number,
            min: 1,
            max: 100, // Quality range from 1 to 100
        }
    }
}, {
    timestamps: true,
});

const Video = models?.Video || model<IVideo>("Video", videoSchema);
export default Video;