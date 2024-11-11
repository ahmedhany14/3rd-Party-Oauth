import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: 'config.env' });

const connectDB = async () => {
    const database = process.env.DATABASE || "mongodb://localhost:27017/AuthDB";
    console.log(database);
    await mongoose.connect(database, {})
        .then((connection) => {
            console.log("DB connection successful");
        }).catch((error) => {
            console.log("DB connection failed");
        });
};



import { app } from './index';

const port = process.env.PORT || 3000;
app.listen(port, () => {
    connectDB();
    console.log(`Listening on port ${port}, to view the app, open this link in your browser http://localhost:${port}`);
})   