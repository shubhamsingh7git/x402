import { Request, Response, NextFunction } from "express";
import { transactionService } from "../services/transaction/transaction.service";
import { parseQueryParams } from "../utils/query.util";
import { ApiResponse } from "../utils/ApiResponse";

export class TransactionController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = parseQueryParams(req, ["merchant", "txHash", "wallet", "decisionReason"]);
      const result = await transactionService.getTransactions(params);
      ApiResponse.ok(res, "Transactions retrieved successfully", result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const tx = await transactionService.getTransactionById(id);
      ApiResponse.ok(res, "Transaction retrieved successfully", tx);
    } catch (error) {
      next(error);
    }
  }
}

export const transactionController = new TransactionController();
