import express from "express";
import dotenv from "dotenv";
import rateLimiterMiddleware from "./middleware/rateLimit.js";
import transactionRouter from "./routes/transactionRoute.js";
import { initDB } from "./config/db.js";
import corse from "cors";

dotenv.config();

const app = express();
app.use(corse());

app.use(rateLimiterMiddleware);

app.use(express.json());

app.use("/api/transactions", transactionRouter);

const PORT = process.env.PORT || 3000;

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
