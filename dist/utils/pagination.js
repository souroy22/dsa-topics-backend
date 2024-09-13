"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateMiddleware = exports.paginate = void 0;
const paginate = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
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
    const [total, data] = yield Promise.all([
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
});
exports.paginate = paginate;
const paginateMiddleware = (req, _, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, sortBy, sortOrder } = req.query;
    req.pagination = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        sortBy: sortBy || undefined,
        sortOrder: (sortOrder === "desc" ? "desc" : "asc"),
    };
    next();
});
exports.paginateMiddleware = paginateMiddleware;
//# sourceMappingURL=pagination.js.map