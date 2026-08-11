import { transactionRepository } from "../../repositories/transaction.repository";
import { ApiError } from "../../utils/ApiError";
import { ParsedQueryParams, PaginatedResult } from "../../utils/query.util";
import { ITransaction } from "../../interfaces/transaction.interface";

export class TransactionService {
  async getTransactions(params: ParsedQueryParams): Promise<PaginatedResult<ITransaction>> {
    const { data, total } = await transactionRepository.findPaginated(
      params.filter,
      params.skip,
      params.limit,
      params.sort
    );
    const pages = Math.ceil(total / params.limit) || 1;
    return {
      data: data as unknown as ITransaction[],
      pagination: { total, page: params.page, limit: params.limit, pages },
    };
  }

  async getTransactionById(id: string): Promise<ITransaction> {
    const tx = await transactionRepository.findById(id);
    if (!tx) {
      throw ApiError.notFound("Transaction not found");
    }
    return tx as unknown as ITransaction;
  }

  async recordPaymentTransaction(context: any, result: any) {
    const status = result.status === "SETTLED" || result.status === "COMPLETED" ? "SETTLED" : result.status === "DENIED" ? "DENIED" : "FAILED";
    const decision = result.status === "DENIED" ? "Denied" : "Approved";

    return transactionRepository.create({
      merchant: context.merchantId,
      amount: context.amount,
      status,
      txHash: result.transactionId || "0x0000000000000000000000000000000000000000",
      wallet: context.metadata?.wallet || "0x7F2A8492B1039E82C41A3B92",
      network: context.network,
      scheme: context.scheme,
      policyDecision: decision,
      decisionReason: result.error || decision,
      policySnapshot: context.metadata?.policySnapshot || {
        transactionLimit: 0.05,
        dailyBudget: 10.0,
        maxTxPerMinute: 30,
        killSwitch: false,
      },
    });
  }
}

export const transactionService = new TransactionService();
