import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://tmaras02:WhatTask@cluster0.ctque4k.mongodb.net/WhatTask')
        .then (() => console.log('DB CONNECTED'))
    } 
    catch (err) {
        console.log('ERROR CONNECTING TO DB')
    }
}