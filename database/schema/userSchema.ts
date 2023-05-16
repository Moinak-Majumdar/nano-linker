import { Schema, model, models } from "mongoose";

const userData_schema = new Schema ({
    email: {
        type: String, require: true, unique: true, dropDups: true
    },
    sessionCount: {
        type: Number, require: true 
    },
    links : [{
        url: { type: String, require: true},
        slug : { type: String, require: true}
    }]
})

const userDb = models.userDb || model('userDb', userData_schema)

export default userDb;