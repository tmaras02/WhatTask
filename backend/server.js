import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import {connectDB} from './config/db.js'
import userRouter from './routes/userRoute.js'
import taskRouter from './routes/taskRoute.js'


const app = express();
const port = process.env.port || 4000;

//MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//DB CONNECT
connectDB();

//Routes
app.use("/api/user", userRouter);
app.use("/api/tasks", taskRouter)

app.get('/', (req, res) => {
    res.send(' API WORKING');
})

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
})