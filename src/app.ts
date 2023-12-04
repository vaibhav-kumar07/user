import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { initMongoDB, disconnectMongoDB, retryMongoDBConnection } from './dbutil';
import userRoutes from './routes/auth-route';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: process.env.CORSORIGINURL,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

// Define your routes
app.use('/user', userRoutes);

// Initialize MongoDB connection
initMongoDB()
    .then(() => {
        // Start the server if MongoDB is connected
        if (mongoose.connection.readyState === 1) {
            app.listen(PORT, () => {
                console.log(`Server is running on http://localhost:${PORT}`);
            });
        } else {
            console.error('MongoDB is not connected. Server cannot start.');
        }
    })
    .catch((error) => {
        console.error('Failed to initialize MongoDB:', error);
        process.exit(1);
    });

// Example: Retry MongoDB connection every 30 seconds
setInterval(() => {
    retryMongoDBConnection();
}, 30000);

// Graceful shutdown on process termination
process.on('SIGINT', async () => {
    console.log('Received SIGINT. Closing MongoDB connection and exiting.');
    await disconnectMongoDB();
    process.exit(0);
});
