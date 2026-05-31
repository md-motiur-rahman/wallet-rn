import express from "express";

import {
  getTransactions,
  getTransactionsByUserId,
  getTransactionsSummaryByUserId,
  getTransactionById,
  createTransaction,
  deleteTransactionsByUserId,
  deleteTransactionById,
} from "../controllers/transactionsController.js";

const transactionRouter = express.Router();

transactionRouter.post("/", createTransaction);

transactionRouter.get("/", getTransactions);

transactionRouter.get("/:user_id", getTransactionsByUserId);

transactionRouter.get("/summary/:user_id", getTransactionsSummaryByUserId);

transactionRouter.get("/:id", getTransactionById);

transactionRouter.delete("/:id", deleteTransactionById);


export default transactionRouter;
