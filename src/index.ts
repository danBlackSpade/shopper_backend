import express from 'express'
import dotenv from 'dotenv'
import mongoose, { ConnectOptions } from 'mongoose';
import routes from './routes'

dotenv.config();

const app = express();
const port = process.env.PORT || 8080
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/shopper-rides'

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