import { Schema, model, models } from "mongoose";

interface I_Url {
    url: string, slug: string
}

const url_collectionSchema = new Schema<I_Url>({
    url: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        trim: true
    },  
})

const url_collection = models.url_collection || model('url_collection', url_collectionSchema)

export default url_collection;