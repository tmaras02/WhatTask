import mongoose from "mongoose"

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://tmaras02:WhatTask@cluster0.v2vqqeb.mongodb.net/WhatTask')
    .then (() => console.log('DB CONNECTED'));
}