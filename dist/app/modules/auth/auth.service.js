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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = exports.signUpUser = void 0;
const prisma_1 = require("../../../shared/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const signUpUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.prisma.user.findFirst({
        where: {
            email: data.email,
        },
    });
    if (isExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Email is already exist');
    }
    //hash the user password
    const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
    const result = yield prisma_1.prisma.user.create({
        data: Object.assign(Object.assign({}, data), { password: hashedPassword }),
        select: {
            id: true,
            name: true,
            email: true,
            password: false,
            role: true,
            contactNo: true,
            address: true,
            profileImg: true,
        },
    });
    if (!result) {
        throw new ApiError_1.default(404, 'Something Went wrong');
    }
    return result;
});
exports.signUpUser = signUpUser;
const signInUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const user = yield prisma_1.prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) {
        throw new ApiError_1.default(404, 'User does not exist');
    }
    const isPasswordMatched = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordMatched) {
        throw new Error('Your password is not correct');
    }
    //create access token
    const token = jwtHelpers_1.jwtHelpers.createToken({ email: user.email, role: user.role, id: user.id }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        token,
    };
});
exports.AuthService = {
    signUpUser: exports.signUpUser,
    signInUser,
};
