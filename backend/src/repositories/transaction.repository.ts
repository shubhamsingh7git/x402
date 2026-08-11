import { Transaction, ITransactionDocument } from "../models/Transaction";

export class TransactionRepository {
  async create(data: Partial<ITransactionDocument>): Promise<ITransactionDocument> {
    return Transaction.create(data);
  }

  async findPaginated(
    filter: Record<string, unknown>,
    skip: number,
    limit: number,
    sort: Record<string, 1 | -1>
  ): Promise<{ data: ITransactionDocument[]; total: number }> {
    const [data, total] = await Promise.all([
      Transaction.find(filter).sort(sort).skip(skip).limit(limit),
      Transaction.countDocuments(filter),
    ]);
    return { data, total };
  }

  async findById(id: string): Promise<ITransactionDocument | null> {
    return Transaction.findById(id);
  }

  async countByStatus(status: string): Promise<number> {
    return Transaction.countDocuments({ status });
  }

  async countAll(): Promise<number> {
    return Transaction.countDocuments();
  }

  async sumAmountToday(merchantId: string): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const result = await Transaction.aggregate([
      {
        $match: {
          merchant: merchantId,
          status: { $in: ["SETTLED", "COMPLETED", "APPROVED"] },
          createdAt: { $gte: startOfDay },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    return result.length > 0 ? result[0].total : 0;
  }
}

export const transactionRepository = new TransactionRepository();
