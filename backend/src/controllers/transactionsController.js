import sql from "../config/db.js";

async function createTransaction(req, res) {
  try {
    const { user_id, title, amount, category } = req.body;

    if (!user_id || !title || !amount || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const result = await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *
    `;
    res.status(201).json(result[0]);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getTransactions(req, res) {
  try {
    const transactions = await sql`
        SELECT * FROM transactions ORDER BY created_at DESC
        `;
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getTransactionsByUserId(req, res) {
  try {
    const { user_id } = req.params;
    const transactions = await sql`
        SELECT * FROM transactions WHERE user_id = ${user_id} ORDER BY created_at DESC
        `;
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getTransactionsSummaryByUserId(req, res) {
  try {
    const { user_id } = req.params;
    const balance =
      await sql`SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${user_id}`;
    const income =
      await sql`SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${user_id} AND amount > 0`;
    const expenses =
      await sql`SELECT COALESCE(SUM(amount), 0) as expenses FROM transactions WHERE user_id = ${user_id} AND amount < 0`;
    res.status(200).json({
      balance: balance[0].balance,
      income: income[0].income,
      expenses: expenses[0].expenses,
    });
  } catch (error) {
    console.error("Error fetching transactions summary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getTransactionById(req, res) {
  try {
    const { id } = req.params;
    const transaction = await sql`
        SELECT * FROM transactions WHERE id = ${id}
        `;
    if (transaction.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.status(200).json(transaction[0]);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteTransactionsByUserId(req, res) {
  try {
    const { user_id } = req.params;
    const result = await sql`
        DELETE FROM transactions WHERE user_id = ${user_id} RETURNING *
        `;
    if (result.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteTransactionById(req, res) {
  try {
    const { id } = req.params;
    const result = await sql`
        DELETE FROM transactions WHERE id = ${id} RETURNING *
        `;
    if (result.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export {
  getTransactions,
  getTransactionsByUserId,
  getTransactionsSummaryByUserId,
  getTransactionById,
  createTransaction,
  deleteTransactionsByUserId,
  deleteTransactionById,
};
