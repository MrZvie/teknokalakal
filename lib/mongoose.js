import mongoose from "mongoose";

export async function mongooseConnect() {
    if (mongoose.connection.readyState === 1) {
        // Return the current connection if already connected
        return mongoose.connection.asPromise();
    } else {
        // Create a new connection if not connected
        const uri = process.env.MONGODB_URI;
        
        // Ensure URI is defined before attempting to connect
        if (!uri) {
            throw new Error('MongoDB URI is not defined');
        }

        try {
            // Return the connection promise from mongoose.connect
            return mongoose.connect(uri);
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error);
            throw new Error('Database connection failed');
        }
    }
}
