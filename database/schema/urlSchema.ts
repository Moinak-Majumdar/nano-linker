import { Schema, model, models } from "mongoose";

const url_collectionSchema = new Schema({
    url: {
        type: String,
        require: true,
        trim: true
    },
    slug: {
        type: String,
        require: true,
        trim: true
    },  
}, {timestamps: true})

const url_collection = models.url_collection || model('url_collection', url_collectionSchema)

export default url_collection;