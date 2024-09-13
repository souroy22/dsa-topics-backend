import { Request, Response, NextFunction } from "express";
import { Document, Query } from "mongoose";

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface PaginationResult<T> {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  data: T[];
}

export const paginate = async <T extends Document>(
  query: Query<T[], T>,
  options: PaginationOptions
): Promise<PaginationResult<T>> => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  // Apply pagination
  query = query.skip(skip).limit(limit);

  // Apply sorting if provided
  if (options.sortBy) {
    const sortOrder = options.sortOrder === "desc" ? "-" : "";
    const sortFields = `${sortOrder}${options.sortBy}`;
    query = query.sort(sortFields);
  }

  const [total, data] = await Promise.all([
    query.model.countDocuments(query.getQuery()).exec(),
    query.exec(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    totalCount: total,
    page,
    limit,
    totalPages,
  };
};

export const paginateMiddleware = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { page, limit, sortBy, sortOrder } = req.query;

  req.pagination = {
    page: parseInt(page as string) || 1,
    limit: parseInt(limit as string) || 10,
    sortBy: (sortBy as string) || undefined,
    sortOrder: (sortOrder === "desc" ? "desc" : "asc") as "asc" | "desc",
  };

  next();
};
