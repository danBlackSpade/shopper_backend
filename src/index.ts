import express from 'express'
import dotenv from 'dotenv'
import mongoose, { ConnectOptions } from 'mongoose';
import routes from './routes'
import cors from 'cors'


dotenv.config();

const app = express();
const port = process.env.PORT || 8080
// const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/shopper-rides'
const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/shopper-rides'
// app.use(cors({
//   // origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//   origin: process.env.FRONTEND_URL || 'http://localhost:80',
//   methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));

app.use((req, res, next) => {
  const allowedOrigins = ['http://127.0.0.1:80', 'http://localhost:80', 'http://127.0.0.1:3000', 'http://localhost:3000', 'http://localhost', 'http://127.0.0.1'];
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, PATCH, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // res.header('Access-Control-Allow-Credentials', true);
  return next();
});


mongoose.connect(mongoUri)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

app.use(express.json())
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ message: err.message })
})


app.use('/api', routes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})