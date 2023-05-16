import mongoose from "mongoose";


async function disconnectMongo() {
    mongoose.disconnect().then(() => {
        console.log('connection Closed')
    }).catch((error) => {
        console.log(error)
    })
}

export default disconnectMongo