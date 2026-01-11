/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 3 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(4);
const prisma_module_1 = __webpack_require__(5);
const auth_module_1 = __webpack_require__(8);
const user_module_1 = __webpack_require__(14);
const astrology_module_1 = __webpack_require__(18);
const prayer_module_1 = __webpack_require__(23);
const confession_module_1 = __webpack_require__(27);
const treehole_module_1 = __webpack_require__(30);
const dating_module_1 = __webpack_require__(33);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            astrology_module_1.AstrologyModule,
            prayer_module_1.PrayerModule,
            confession_module_1.ConfessionModule,
            treehole_module_1.TreeholeModule,
            dating_module_1.DatingModule,
        ],
    })
], AppModule);


/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaModule = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(6);
let PrismaModule = class PrismaModule {
};
exports.PrismaModule = PrismaModule;
exports.PrismaModule = PrismaModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], PrismaModule);


/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const common_1 = __webpack_require__(2);
const client_1 = __webpack_require__(7);
let PrismaService = class PrismaService extends client_1.PrismaClient {
    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);


/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(9);
const passport_1 = __webpack_require__(10);
const auth_service_1 = __webpack_require__(11);
const auth_controller_1 = __webpack_require__(13);
const prisma_module_1 = __webpack_require__(5);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'your-secret-key',
                signOptions: { expiresIn: process.env.JWT_EXPIRATION || '7d' },
                global: true,
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService],
        exports: [auth_service_1.AuthService, jwt_1.JwtModule],
    })
], AuthModule);


/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(9);
const prisma_service_1 = __webpack_require__(6);
const bcrypt = __importStar(__webpack_require__(12));
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(data) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
        const token = this.generateToken(user.id);
        return {
            user: this.sanitizeUser(user),
            token,
        };
    }
    async login(identifier, password) {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: identifier }, { phone: identifier }],
            },
        });
        if (!user) {
            throw new Error('用户不存在');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('密码错误');
        }
        const token = this.generateToken(user.id);
        return {
            user: this.sanitizeUser(user),
            token,
        };
    }
    generateToken(userId) {
        return this.jwtService.sign({ sub: userId });
    }
    sanitizeUser(user) {
        const { password, ...sanitized } = user;
        return sanitized;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], AuthService);


/***/ }),
/* 12 */
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),
/* 13 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(2);
const auth_service_1 = __webpack_require__(11);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(data) {
        return this.authService.register(data);
    }
    async login(data) {
        return this.authService.login(data.identifier, data.password);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 14 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserModule = void 0;
const common_1 = __webpack_require__(2);
const user_service_1 = __webpack_require__(15);
const user_controller_1 = __webpack_require__(16);
const prisma_module_1 = __webpack_require__(5);
const auth_module_1 = __webpack_require__(8);
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService],
        exports: [user_service_1.UserService],
    })
], UserModule);


/***/ }),
/* 15 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(6);
let UserService = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserById(id) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }
    async updateUser(id, data) {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }
    async deleteUser(id) {
        return this.prisma.user.delete({
            where: { id },
        });
    }
    async getAllUsers(skip = 0, take = 20) {
        return this.prisma.user.findMany({
            skip,
            take,
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], UserService);


/***/ }),
/* 16 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserController = void 0;
const common_1 = __webpack_require__(2);
const user_service_1 = __webpack_require__(15);
const jwt_auth_guard_1 = __webpack_require__(17);
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getUser(id) {
        return this.userService.getUserById(id);
    }
    async updateUser(id, data) {
        return this.userService.updateUser(id, data);
    }
    async deleteUser(id) {
        return this.userService.deleteUser(id);
    }
    async getAllUsers(skip = 0, take = 20) {
        return this.userService.getAllUsers(Number(skip), Number(take));
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUser", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('skip')),
    __param(1, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [typeof (_a = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _a : Object])
], UserController);


/***/ }),
/* 17 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(9);
let JwtAuthGuard = class JwtAuthGuard {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new common_1.UnauthorizedException('未提供认证令牌');
        }
        try {
            const payload = await this.jwtService.verifyAsync(token);
            request.user = payload;
            return true;
        }
        catch {
            throw new common_1.UnauthorizedException('无效的认证令牌');
        }
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object])
], JwtAuthGuard);


/***/ }),
/* 18 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AstrologyModule = void 0;
const common_1 = __webpack_require__(2);
const astrology_service_1 = __webpack_require__(19);
const astrology_controller_1 = __webpack_require__(22);
const prisma_module_1 = __webpack_require__(5);
const astrology_utils_1 = __webpack_require__(20);
const auth_module_1 = __webpack_require__(8);
let AstrologyModule = class AstrologyModule {
};
exports.AstrologyModule = AstrologyModule;
exports.AstrologyModule = AstrologyModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule],
        controllers: [astrology_controller_1.AstrologyController],
        providers: [astrology_service_1.AstrologyServiceModule, astrology_utils_1.AstrologyService],
        exports: [astrology_service_1.AstrologyServiceModule],
    })
], AstrologyModule);


/***/ }),
/* 19 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AstrologyServiceModule = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(6);
const astrology_utils_1 = __webpack_require__(20);
let AstrologyServiceModule = class AstrologyServiceModule {
    constructor(prisma, astrologyService) {
        this.prisma = prisma;
        this.astrologyService = astrologyService;
    }
    async calculateAstrology(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error('用户不存在');
        }
        const lunar = this.astrologyService.solarToLunar(user.birthYear, user.birthMonth, user.birthDay, user.birthHour);
        const zodiacSign = this.astrologyService.getZodiacSign(user.birthMonth, user.birthDay);
        const fiveElements = this.astrologyService.getFiveElements(user.birthYear, user.birthMonth, user.birthDay, user.birthHour);
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                lunarDate: `${lunar.lunarYearText}年${lunar.lunarMonthText}${lunar.lunarDayText}`,
                zodiacSign,
                fiveElements: JSON.stringify(fiveElements),
            },
        });
        return {
            user: updatedUser,
            lunar,
            zodiacSign,
            fiveElements,
        };
    }
};
exports.AstrologyServiceModule = AstrologyServiceModule;
exports.AstrologyServiceModule = AstrologyServiceModule = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof astrology_utils_1.AstrologyService !== "undefined" && astrology_utils_1.AstrologyService) === "function" ? _b : Object])
], AstrologyServiceModule);


/***/ }),
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AstrologyService = void 0;
const common_1 = __webpack_require__(2);
const lunar_javascript_1 = __webpack_require__(21);
let AstrologyService = class AstrologyService {
    solarToLunar(year, month, day, hour) {
        const solar = lunar_javascript_1.Solar.fromYmdHms(year, month, day, hour, 0, 0);
        const lunar = solar.getLunar();
        return {
            lunarYear: lunar.getYear(),
            lunarMonth: lunar.getMonth(),
            lunarDay: lunar.getDay(),
            lunarMonthText: lunar.getMonthInChinese(),
            lunarDayText: lunar.getDayInChinese(),
            lunarYearText: lunar.getYearInChinese(),
            ganzhiYear: lunar.getYearInGanZhi(),
            ganzhiMonth: lunar.getMonthInGanZhi(),
            ganzhiDay: lunar.getDayInGanZhi(),
            ganzhiHour: lunar.getTimeZhi(),
        };
    }
    getZodiacSign(month, day) {
        const zodiacSigns = [
            { name: '摩羯座', start: [1, 1], end: [1, 19] },
            { name: '水瓶座', start: [1, 20], end: [2, 18] },
            { name: '双鱼座', start: [2, 19], end: [3, 20] },
            { name: '白羊座', start: [3, 21], end: [4, 19] },
            { name: '金牛座', start: [4, 20], end: [5, 20] },
            { name: '双子座', start: [5, 21], end: [6, 21] },
            { name: '巨蟹座', start: [6, 22], end: [7, 22] },
            { name: '狮子座', start: [7, 23], end: [8, 22] },
            { name: '处女座', start: [8, 23], end: [9, 22] },
            { name: '天秤座', start: [9, 23], end: [10, 23] },
            { name: '天蝎座', start: [10, 24], end: [11, 22] },
            { name: '射手座', start: [11, 23], end: [12, 21] },
            { name: '摩羯座', start: [12, 22], end: [12, 31] },
        ];
        for (const sign of zodiacSigns) {
            const [startMonth, startDay] = sign.start;
            const [endMonth, endDay] = sign.end;
            if ((month === startMonth && day >= startDay) ||
                (month === endMonth && day <= endDay)) {
                return sign.name;
            }
        }
        return '未知';
    }
    getFiveElements(year, month, day, hour) {
        const solar = lunar_javascript_1.Solar.fromYmdHms(year, month, day, hour, 0, 0);
        const lunar = solar.getLunar();
        const eightChar = lunar.getEightChar();
        const elements = {
            wood: 0,
            fire: 0,
            earth: 0,
            metal: 0,
            water: 0,
        };
        const ganzhi = [
            eightChar.getYear(),
            eightChar.getMonth(),
            eightChar.getDay(),
            eightChar.getTime(),
        ];
        ganzhi.forEach((gz) => {
            const gan = gz.substring(0, 1);
            const zhi = gz.substring(1);
            const ganElement = this.getElementByGan(gan);
            const zhiElement = this.getElementByZhi(zhi);
            if (ganElement)
                elements[ganElement]++;
            if (zhiElement)
                elements[zhiElement]++;
        });
        return elements;
    }
    getElementByGan(gan) {
        const elements = {
            甲: 'wood',
            乙: 'wood',
            丙: 'fire',
            丁: 'fire',
            戊: 'earth',
            己: 'earth',
            庚: 'metal',
            辛: 'metal',
            壬: 'water',
            癸: 'water',
        };
        return elements[gan];
    }
    getElementByZhi(zhi) {
        const elements = {
            寅: 'wood',
            卯: 'wood',
            巳: 'fire',
            午: 'fire',
            辰: 'earth',
            戌: 'earth',
            丑: 'earth',
            未: 'earth',
            申: 'metal',
            酉: 'metal',
            亥: 'water',
            子: 'water',
        };
        return elements[zhi];
    }
};
exports.AstrologyService = AstrologyService;
exports.AstrologyService = AstrologyService = __decorate([
    (0, common_1.Injectable)()
], AstrologyService);


/***/ }),
/* 21 */
/***/ ((module) => {

module.exports = require("lunar-javascript");

/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AstrologyController = void 0;
const common_1 = __webpack_require__(2);
const astrology_service_1 = __webpack_require__(19);
const jwt_auth_guard_1 = __webpack_require__(17);
let AstrologyController = class AstrologyController {
    constructor(astrologyService) {
        this.astrologyService = astrologyService;
    }
    async calculate(userId) {
        return this.astrologyService.calculateAstrology(userId);
    }
};
exports.AstrologyController = AstrologyController;
__decorate([
    (0, common_1.Post)('calculate/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AstrologyController.prototype, "calculate", null);
exports.AstrologyController = AstrologyController = __decorate([
    (0, common_1.Controller)('astrology'),
    __metadata("design:paramtypes", [typeof (_a = typeof astrology_service_1.AstrologyServiceModule !== "undefined" && astrology_service_1.AstrologyServiceModule) === "function" ? _a : Object])
], AstrologyController);


/***/ }),
/* 23 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrayerModule = void 0;
const common_1 = __webpack_require__(2);
const prayer_service_1 = __webpack_require__(24);
const prayer_controller_1 = __webpack_require__(25);
const prisma_module_1 = __webpack_require__(5);
const auth_module_1 = __webpack_require__(8);
let PrayerModule = class PrayerModule {
};
exports.PrayerModule = PrayerModule;
exports.PrayerModule = PrayerModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule],
        controllers: [prayer_controller_1.PrayerController],
        providers: [prayer_service_1.PrayerService],
        exports: [prayer_service_1.PrayerService],
    })
], PrayerModule);


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrayerService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(6);
let PrayerService = class PrayerService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPrayer(userId, data) {
        return this.prisma.prayer.create({
            data: {
                userId,
                ...data,
            },
            include: {
                user: true,
            },
        });
    }
    async getPrayers(userId) {
        return this.prisma.prayer.findMany({
            where: { userId },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async incrementPrayerCount(prayerId) {
        return this.prisma.prayer.update({
            where: { id: prayerId },
            data: {
                prayerCount: {
                    increment: 1,
                },
            },
        });
    }
    async getPublicPrayers(skip = 0, take = 20) {
        return this.prisma.prayer.findMany({
            skip,
            take,
            include: {
                user: {
                    select: {
                        id: true,
                        nickname: true,
                        avatar: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
};
exports.PrayerService = PrayerService;
exports.PrayerService = PrayerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], PrayerService);


/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrayerController = void 0;
const common_1 = __webpack_require__(2);
const prayer_service_1 = __webpack_require__(24);
const jwt_auth_guard_1 = __webpack_require__(17);
const express_1 = __webpack_require__(26);
let PrayerController = class PrayerController {
    constructor(prayerService) {
        this.prayerService = prayerService;
    }
    async createPrayer(data, req) {
        const userId = req.user.sub;
        return this.prayerService.createPrayer(userId, data);
    }
    async getUserPrayers(userId) {
        return this.prayerService.getPrayers(userId);
    }
    async incrementPrayerCount(prayerId) {
        return this.prayerService.incrementPrayerCount(prayerId);
    }
    async getPublicPrayers(skip, take) {
        const skipNum = skip ? Number(skip) : 0;
        const takeNum = take ? Number(take) : 20;
        return this.prayerService.getPublicPrayers(skipNum, takeNum);
    }
};
exports.PrayerController = PrayerController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], PrayerController.prototype, "createPrayer", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PrayerController.prototype, "getUserPrayers", null);
__decorate([
    (0, common_1.Post)('increment/:prayerId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('prayerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PrayerController.prototype, "incrementPrayerCount", null);
__decorate([
    (0, common_1.Get)('public'),
    __param(0, (0, common_1.Query)('skip')),
    __param(1, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PrayerController.prototype, "getPublicPrayers", null);
exports.PrayerController = PrayerController = __decorate([
    (0, common_1.Controller)('prayer'),
    __metadata("design:paramtypes", [typeof (_a = typeof prayer_service_1.PrayerService !== "undefined" && prayer_service_1.PrayerService) === "function" ? _a : Object])
], PrayerController);


/***/ }),
/* 26 */
/***/ ((module) => {

module.exports = require("express");

/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConfessionModule = void 0;
const common_1 = __webpack_require__(2);
const confession_service_1 = __webpack_require__(28);
const confession_controller_1 = __webpack_require__(29);
const prisma_module_1 = __webpack_require__(5);
const auth_module_1 = __webpack_require__(8);
let ConfessionModule = class ConfessionModule {
};
exports.ConfessionModule = ConfessionModule;
exports.ConfessionModule = ConfessionModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule],
        controllers: [confession_controller_1.ConfessionController],
        providers: [confession_service_1.ConfessionService],
        exports: [confession_service_1.ConfessionService],
    })
], ConfessionModule);


/***/ }),
/* 28 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConfessionService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(6);
let ConfessionService = class ConfessionService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createConfession(userId, data) {
        return this.prisma.confession.create({
            data: {
                userId,
                ...data,
            },
            include: {
                user: true,
            },
        });
    }
    async getConfessions(userId) {
        return this.prisma.confession.findMany({
            where: { userId },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async checkMatch(confessionId) {
        const confession = await this.prisma.confession.findUnique({
            where: { id: confessionId },
            include: {
                user: true,
            },
        });
        if (!confession) {
            throw new Error('表白记录不存在');
        }
        const matches = await this.prisma.confession.findMany({
            where: {
                targetName: confession.user.nickname,
                userId: { not: confession.userId },
                isMatched: false,
            },
            include: {
                user: true,
            },
        });
        if (matches.length > 0) {
            const match = matches[0];
            await this.prisma.confession.updateMany({
                where: { id: { in: [confessionId, match.id] } },
                data: { isMatched: true, matchedWith: match.userId === confession.userId ? confession.userId : match.userId },
            });
            return {
                matched: true,
                matchedUser: match.user,
            };
        }
        return { matched: false };
    }
    async getPublicConfessions(skip = 0, take = 20) {
        return this.prisma.confession.findMany({
            skip,
            take,
            include: {
                user: {
                    select: {
                        id: true,
                        nickname: true,
                        avatar: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
};
exports.ConfessionService = ConfessionService;
exports.ConfessionService = ConfessionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ConfessionService);


/***/ }),
/* 29 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConfessionController = void 0;
const common_1 = __webpack_require__(2);
const confession_service_1 = __webpack_require__(28);
const jwt_auth_guard_1 = __webpack_require__(17);
const express_1 = __webpack_require__(26);
let ConfessionController = class ConfessionController {
    constructor(confessionService) {
        this.confessionService = confessionService;
    }
    async createConfession(data, req) {
        const userId = req.user.sub;
        return this.confessionService.createConfession(userId, data);
    }
    async getUserConfessions(userId) {
        return this.confessionService.getConfessions(userId);
    }
    async checkMatch(confessionId) {
        return this.confessionService.checkMatch(confessionId);
    }
    async getPublicConfessions(skip, take) {
        const skipNum = skip ? Number(skip) : 0;
        const takeNum = take ? Number(take) : 20;
        return this.confessionService.getPublicConfessions(skipNum, takeNum);
    }
};
exports.ConfessionController = ConfessionController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], ConfessionController.prototype, "createConfession", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConfessionController.prototype, "getUserConfessions", null);
__decorate([
    (0, common_1.Post)('match/:confessionId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('confessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConfessionController.prototype, "checkMatch", null);
__decorate([
    (0, common_1.Get)('public'),
    __param(0, (0, common_1.Query)('skip')),
    __param(1, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ConfessionController.prototype, "getPublicConfessions", null);
exports.ConfessionController = ConfessionController = __decorate([
    (0, common_1.Controller)('confession'),
    __metadata("design:paramtypes", [typeof (_a = typeof confession_service_1.ConfessionService !== "undefined" && confession_service_1.ConfessionService) === "function" ? _a : Object])
], ConfessionController);


/***/ }),
/* 30 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TreeholeModule = void 0;
const common_1 = __webpack_require__(2);
const treehole_service_1 = __webpack_require__(31);
const treehole_controller_1 = __webpack_require__(32);
const prisma_module_1 = __webpack_require__(5);
const auth_module_1 = __webpack_require__(8);
let TreeholeModule = class TreeholeModule {
};
exports.TreeholeModule = TreeholeModule;
exports.TreeholeModule = TreeholeModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule],
        controllers: [treehole_controller_1.TreeholeController],
        providers: [treehole_service_1.TreeholeService],
        exports: [treehole_service_1.TreeholeService],
    })
], TreeholeModule);


/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TreeholeService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(6);
let TreeholeService = class TreeholeService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTreehole(userId, data) {
        return this.prisma.treehole.create({
            data: {
                userId,
                ...data,
            },
            include: {
                user: true,
            },
        });
    }
    async getTreeholes(userId) {
        return this.prisma.treehole.findMany({
            where: { userId },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async getPublicTreeholes(skip = 0, take = 20) {
        return this.prisma.treehole.findMany({
            skip,
            take,
            include: {
                user: {
                    select: {
                        id: true,
                        nickname: true,
                        avatar: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async likeTreehole(treeholeId) {
        return this.prisma.treehole.update({
            where: { id: treeholeId },
            data: {
                likes: {
                    increment: 1,
                },
            },
        });
    }
    async deleteTreehole(treeholeId, userId) {
        const treehole = await this.prisma.treehole.findUnique({
            where: { id: treeholeId },
        });
        if (!treehole || treehole.userId !== userId) {
            throw new Error('无权删除此树洞');
        }
        return this.prisma.treehole.delete({
            where: { id: treeholeId },
        });
    }
};
exports.TreeholeService = TreeholeService;
exports.TreeholeService = TreeholeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], TreeholeService);


/***/ }),
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TreeholeController = void 0;
const common_1 = __webpack_require__(2);
const treehole_service_1 = __webpack_require__(31);
const jwt_auth_guard_1 = __webpack_require__(17);
const express_1 = __webpack_require__(26);
let TreeholeController = class TreeholeController {
    constructor(treeholeService) {
        this.treeholeService = treeholeService;
    }
    async createTreehole(data, req) {
        const userId = req.user.sub;
        return this.treeholeService.createTreehole(userId, data);
    }
    async getUserTreeholes(userId) {
        return this.treeholeService.getTreeholes(userId);
    }
    async getPublicTreeholes(skip, take) {
        const skipNum = skip ? Number(skip) : 0;
        const takeNum = take ? Number(take) : 20;
        return this.treeholeService.getPublicTreeholes(skipNum, takeNum);
    }
    async likeTreehole(treeholeId) {
        return this.treeholeService.likeTreehole(treeholeId);
    }
    async deleteTreehole(treeholeId, req) {
        const userId = req.user.sub;
        return this.treeholeService.deleteTreehole(treeholeId, userId);
    }
};
exports.TreeholeController = TreeholeController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], TreeholeController.prototype, "createTreehole", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TreeholeController.prototype, "getUserTreeholes", null);
__decorate([
    (0, common_1.Get)('public'),
    __param(0, (0, common_1.Query)('skip')),
    __param(1, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TreeholeController.prototype, "getPublicTreeholes", null);
__decorate([
    (0, common_1.Post)('like/:treeholeId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('treeholeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TreeholeController.prototype, "likeTreehole", null);
__decorate([
    (0, common_1.Delete)(':treeholeId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('treeholeId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], TreeholeController.prototype, "deleteTreehole", null);
exports.TreeholeController = TreeholeController = __decorate([
    (0, common_1.Controller)('treehole'),
    __metadata("design:paramtypes", [typeof (_a = typeof treehole_service_1.TreeholeService !== "undefined" && treehole_service_1.TreeholeService) === "function" ? _a : Object])
], TreeholeController);


/***/ }),
/* 33 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatingModule = void 0;
const common_1 = __webpack_require__(2);
const dating_service_1 = __webpack_require__(34);
const dating_controller_1 = __webpack_require__(35);
const prisma_module_1 = __webpack_require__(5);
const auth_module_1 = __webpack_require__(8);
let DatingModule = class DatingModule {
};
exports.DatingModule = DatingModule;
exports.DatingModule = DatingModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule],
        controllers: [dating_controller_1.DatingController],
        providers: [dating_service_1.DatingService],
        exports: [dating_service_1.DatingService],
    })
], DatingModule);


/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatingService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(6);
let DatingService = class DatingService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findMatches(userId, limit = 10) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error('用户不存在');
        }
        const users = await this.prisma.user.findMany({
            where: {
                id: { not: userId },
                gender: user.gender === 'male' ? 'female' : 'male',
            },
            take: limit,
        });
        const matches = users.map((potentialMatch) => {
            const score = this.calculateMatchScore(user, potentialMatch);
            return {
                user: potentialMatch,
                score,
            };
        });
        matches.sort((a, b) => b.score - a.score);
        return matches;
    }
    calculateMatchScore(user1, user2) {
        let score = 0;
        if (user1.zodiacSign && user2.zodiacSign) {
            if (this.isCompatibleZodiac(user1.zodiacSign, user2.zodiacSign)) {
                score += 30;
            }
        }
        if (user1.fiveElements && user2.fiveElements) {
            const elements1 = JSON.parse(user1.fiveElements);
            const elements2 = JSON.parse(user2.fiveElements);
            score += this.calculateElementScore(elements1, elements2);
        }
        return Math.min(score, 100);
    }
    isCompatibleZodiac(zodiac1, zodiac2) {
        const compatiblePairs = {
            '白羊座': ['狮子座', '射手座', '双子座', '水瓶座'],
            '金牛座': ['处女座', '摩羯座', '巨蟹座', '双鱼座'],
            '双子座': ['天秤座', '水瓶座', '白羊座', '狮子座'],
            '巨蟹座': ['天蝎座', '双鱼座', '金牛座', '处女座'],
            '狮子座': ['白羊座', '射手座', '双子座', '天秤座'],
            '处女座': ['金牛座', '摩羯座', '巨蟹座', '天蝎座'],
            '天秤座': ['双子座', '水瓶座', '狮子座', '射手座'],
            '天蝎座': ['巨蟹座', '双鱼座', '处女座', '摩羯座'],
            '射手座': ['白羊座', '狮子座', '天秤座', '水瓶座'],
            '摩羯座': ['金牛座', '处女座', '天蝎座', '双鱼座'],
            '水瓶座': ['双子座', '天秤座', '射手座', '白羊座'],
            '双鱼座': ['巨蟹座', '天蝎座', '金牛座', '摩羯座'],
        };
        return compatiblePairs[zodiac1]?.includes(zodiac2) || false;
    }
    calculateElementScore(elements1, elements2) {
        let score = 0;
        const elementNames = ['wood', 'fire', 'earth', 'metal', 'water'];
        elementNames.forEach((element) => {
            const diff = Math.abs(elements1[element] - elements2[element]);
            score += (5 - diff) * 4;
        });
        return score;
    }
    async sendMessage(data) {
        return this.prisma.message.create({
            data,
            include: {
                sender: {
                    select: {
                        id: true,
                        nickname: true,
                        avatar: true,
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        nickname: true,
                        avatar: true,
                    },
                },
            },
        });
    }
    async getMessages(userId, otherUserId) {
        return this.prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: userId },
                ],
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        nickname: true,
                        avatar: true,
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        nickname: true,
                        avatar: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }
    async markAsRead(messageId) {
        return this.prisma.message.update({
            where: { id: messageId },
            data: { isRead: true },
        });
    }
};
exports.DatingService = DatingService;
exports.DatingService = DatingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], DatingService);


/***/ }),
/* 35 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatingController = void 0;
const common_1 = __webpack_require__(2);
const dating_service_1 = __webpack_require__(34);
const jwt_auth_guard_1 = __webpack_require__(17);
const express_1 = __webpack_require__(26);
let DatingController = class DatingController {
    constructor(datingService) {
        this.datingService = datingService;
    }
    async findMatches(userId, data) {
        return this.datingService.findMatches(userId, data.limit || 10);
    }
    async sendMessage(data, req) {
        const senderId = req.user.sub;
        return this.datingService.sendMessage({ ...data, senderId });
    }
    async getMessages(userId, otherUserId) {
        return this.datingService.getMessages(userId, otherUserId);
    }
    async markAsRead(messageId) {
        return this.datingService.markAsRead(messageId);
    }
};
exports.DatingController = DatingController;
__decorate([
    (0, common_1.Post)('matches/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DatingController.prototype, "findMatches", null);
__decorate([
    (0, common_1.Post)('message'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], DatingController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('messages/:userId/:otherUserId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('otherUserId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DatingController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)('message/read/:messageId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('messageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DatingController.prototype, "markAsRead", null);
exports.DatingController = DatingController = __decorate([
    (0, common_1.Controller)('dating'),
    __metadata("design:paramtypes", [typeof (_a = typeof dating_service_1.DatingService !== "undefined" && dating_service_1.DatingService) === "function" ? _a : Object])
], DatingController);


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const app_module_1 = __webpack_require__(3);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.setGlobalPrefix('api');
    const port = process.env.PORT || 3000;
    const host = '0.0.0.0';
    await app.listen(port, host);
    console.log(`Application is running on: http://${host}:${port}`);
}
bootstrap();

})();

/******/ })()
;