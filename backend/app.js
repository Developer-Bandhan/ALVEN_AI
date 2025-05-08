import express from 'express';
import morgan from 'morgan';
import connectDB from './database/db.js';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js';
import aiRoutes from './routes/ai.routes.js'
import cookieParser from 'cookie-parser';



const app = express();

connectDB();


app.use(cors())
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true}));


app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/ai', aiRoutes)

app.get('/', (req, res) => {
    res.send('Hello World');
})



export default app;

