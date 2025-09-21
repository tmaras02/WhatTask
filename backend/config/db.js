import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        await mongoose.connect('url')
        .then (() => console.log('DB CONNECTED'))
    } 
    catch (err) {
        console.log('ERROR CONNECTING TO DB')
    }
}
