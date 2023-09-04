"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = require("../../../shared/prisma");
const createOrder = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = user;
    const { orderedBooks } = payload;
    const result = yield prisma_1.prisma.order.create({
        data: {
            userId: id,
            orderedBooks,
        },
    });
    return result;
});
const getAllOrder = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, id } = user;
    const isExist = yield prisma_1.prisma.user.findUnique({
        where: {
            id,
        },
    });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (role === 'admin') {
        const result = yield prisma_1.prisma.order.findMany({});
        return result;
    }
    if (role === 'customer') {
        const result = yield prisma_1.prisma.order.findMany({
            where: {
                userId: id,
            },
        });
        return result;
    }
});
const getSingleOrderById = (orderId, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, id } = user;
    const isExist = yield prisma_1.prisma.user.findUnique({
        where: {
            id,
        },
    });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (role === 'customer') {
        const result = yield prisma_1.prisma.order.findUnique({
            where: {
                id: orderId,
                userId: id,
            },
        });
        if ((result === null || result === void 0 ? void 0 : result.userId) !== id) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You are not allowed to access this data.');
        }
        return result;
    }
    if (role === 'admin') {
        const result = yield prisma_1.prisma.order.findUnique({
            where: {
                id: orderId,
            },
        });
        return result;
    }
});
exports.OrderService = {
    createOrder,
    getAllOrder,
    getSingleOrderById,
};
