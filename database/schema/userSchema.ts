import { Schema, model, models, Types, Model } from "mongoose";

interface I_Links {
    url: string, slug: string, _id: Types.ObjectId;
}
interface I_User {
    userId: string, sessionCount: number, links: Types.DocumentArray<I_Links>
}

const userData_schema = new Schema<I_User, Model<I_Links>> ({
    userId: {
        type: String, required: true, unique: true,
    },
    sessionCount: {
        type: Number, required: true 
    },
    links : [{
        url: { type: String, required: true},
        slug : { type: String, required: true}
    }]
})

const userDb = models.userDb || model('userDb', userData_schema)

export default userDb;