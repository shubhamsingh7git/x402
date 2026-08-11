import { Request } from "express";

export interface ParsedQueryParams {
  page: number;
  limit: number;
  skip: number;
  sort: Record<string, 1 | -1>;
  filter: Record<string, unknown>;
  search?: string;
}

export const parseQueryParams = (
  req: Request,
  searchFields: string[] = []
): ParsedQueryParams => {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string, 10) || 10));
  const skip = (page - 1) * limit;

  // Sorting parser (e.g. ?sort=-createdAt or ?sort=alias)
  const sortParam = (req.query.sort as string) || "-createdAt";
  const sort: Record<string, 1 | -1> = {};
  if (sortParam.startsWith("-")) {
    sort[sortParam.substring(1)] = -1;
  } else {
    sort[sortParam] = 1;
  }

  // Filter parser
  const filter: Record<string, unknown> = {};

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.merchant) {
    filter.merchant = req.query.merchant;
  }

  if (req.query.network) {
    filter.network = req.query.network;
  }

  // Date range filtering
  const fromDate = req.query.fromDate as string;
  const toDate = req.query.toDate as string;

  if (fromDate || toDate) {
    const dateFilter: Record<string, Date> = {};
    if (fromDate) {
      dateFilter.$gte = new Date(fromDate);
    }
    if (toDate) {
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      dateFilter.$lte = end;
    }
    filter.createdAt = dateFilter;
  }

  // Search parser
  const search = req.query.search as string;
  if (search && searchFields.length > 0) {
    filter.$or = searchFields.map((field) => ({
      [field]: { $regex: search, $options: "i" },
    }));
  }

  return { page, limit, skip, sort, filter, search };
};

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
