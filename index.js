import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import paymentIntent from './routes/paymentIntent.js'


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/payment', paymentIntent)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
