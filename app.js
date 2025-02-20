// Description: Main entry point for the application
import express from "express";
import { PORT } from './config/env.js';
import cookieParser from "cookie-parser";

// Routes
import userRouter from "./routes/user.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import authRouter from "./routes/auth.routes.js";

// Database
import connectToDatabase from "./database/mongodb.js";

// Middlewares
import errorMiddleware from "./middlewares/error.middleware.js";
import arcjectMiddleware from "./middlewares/arcject.middleware.js";
import workflowRouter from "./routes/workflow.routes.js";


const app = express();

// USE Middlewares
app.use(errorMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(express.static("public"));
app.use(cookieParser());
app.use(arcjectMiddleware);


//USE Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/workflows', workflowRouter);





app.get("/", (req, res) => {
  res.send("Welcome to the Subscription Tracker API");
});







app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  await connectToDatabase();
});

export default app;


