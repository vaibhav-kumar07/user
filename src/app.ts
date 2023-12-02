// app.ts
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import {
    initMongoDB,
    isMongoDBConnected,
    disconnectMongoDB,
    retryMongoDBConnection,
} from './dbutil';
import user from "./routes/auth-route"
dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/user", user)

// Initialize MongoDB connection
initMongoDB()
    .then(() => {
        // Start the server if MongoDB is connected
        if (isMongoDBConnected()) {
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
