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
const minio_module_1 = __webpack_require__(8);
const auth_module_1 = __webpack_require__(11);
const user_module_1 = __webpack_require__(18);
const astrology_module_1 = __webpack_require__(21);
const prayer_module_1 = __webpack_require__(26);
const devout_prayer_module_1 = __webpack_require__(31);
const reunite_prayer_module_1 = __webpack_require__(34);
const confession_module_1 = __webpack_require__(37);
const treehole_module_1 = __webpack_require__(40);
const dating_module_1 = __webpack_require__(43);
const palm_module_1 = __webpack_require__(46);
const face_module_1 = __webpack_require__(50);
const avatar_module_1 = __webpack_require__(53);
const mbti_module_1 = __webpack_require__(56);
const daily_fortune_module_1 = __webpack_require__(61);
const famous_people_module_1 = __webpack_require__(64);
const product_module_1 = __webpack_require__(67);
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
            minio_module_1.MinioModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            astrology_module_1.AstrologyModule,
            prayer_module_1.PrayerModule,
            devout_prayer_module_1.DevoutPrayerModule,
            reunite_prayer_module_1.ReunitePrayerModule,
            confession_module_1.ConfessionModule,
            treehole_module_1.TreeholeModule,
            dating_module_1.DatingModule,
            palm_module_1.PalmModule,
            face_module_1.FaceModule,
            avatar_module_1.AvatarModule,
            mbti_module_1.MbtiModule,
            daily_fortune_module_1.DailyFortuneModule,
            famous_people_module_1.FamousPeopleModule,
            product_module_1.ProductModule,
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
exports.MinioModule = void 0;
const common_1 = __webpack_require__(2);
const minio_service_1 = __webpack_require__(9);
const config_1 = __webpack_require__(4);
let MinioModule = class MinioModule {
};
exports.MinioModule = MinioModule;
exports.MinioModule = MinioModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [minio_service_1.MinioService],
        exports: [minio_service_1.MinioService],
    })
], MinioModule);


/***/ }),
/* 9 */
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MinioService = void 0;
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(4);
const Minio = __importStar(__webpack_require__(10));
let MinioService = class MinioService {
    constructor(configService) {
        this.configService = configService;
        this.client = null;
        this.isEnabled = false;
        this.bucketName = this.configService.get('MINIO_BUCKET') || 'stardust';
        try {
            this.client = new Minio.Client({
                endPoint: this.configService.get('MINIO_ENDPOINT') || 'localhost',
                port: parseInt(this.configService.get('MINIO_PORT') || '9000'),
                useSSL: this.configService.get('MINIO_USE_SSL') === 'true',
                accessKey: this.configService.get('MINIO_ACCESS_KEY') || '',
                secretKey: this.configService.get('MINIO_SECRET_KEY') || '',
            });
            this.isEnabled = true;
        }
        catch (error) {
            console.warn('MinIO client 初始化失败，将禁用文件上传功能:', error);
            this.client = null;
            this.isEnabled = false;
        }
    }
    async onModuleInit() {
        if (!this.client || !this.isEnabled) {
            console.warn('MinIO 未启用，文件上传功能将被禁用');
            return;
        }
        try {
            const exists = await this.client.bucketExists(this.bucketName);
            if (!exists) {
                await this.client.makeBucket(this.bucketName);
                console.log(`MinIO bucket "${this.bucketName}" created successfully`);
                const policy = {
                    Version: '2012-10-17',
                    Statement: [
                        {
                            Effect: 'Allow',
                            Principal: { AWS: ['*'] },
                            Action: ['s3:GetObject'],
                            Resource: [`arn:aws:s3:::${this.bucketName}/*`],
                        },
                    ],
                };
                await this.client.setBucketPolicy(this.bucketName, JSON.stringify(policy));
            }
            else {
                console.log(`MinIO bucket "${this.bucketName}" already exists`);
            }
        }
        catch (error) {
            console.warn('MinIO 初始化失败，文件上传功能将被禁用:', error);
            this.isEnabled = false;
        }
    }
    async onModuleDestroy() {
    }
    async uploadFile(fileBuffer, fileName, mimeType, folder = 'palm-readings') {
        if (!this.client || !this.isEnabled) {
            throw new Error('MinIO 未启用，无法上传文件');
        }
        const objectName = `${folder}/${Date.now()}-${fileName}`;
        await this.client.putObject(this.bucketName, objectName, fileBuffer, fileBuffer.length, {
            'Content-Type': mimeType,
        });
        const publicUrl = this.configService.get('MINIO_PUBLIC_URL');
        if (publicUrl) {
            return `${publicUrl}/${this.bucketName}/${objectName}`;
        }
        const port = this.configService.get('MINIO_PORT');
        const useSSL = this.configService.get('MINIO_USE_SSL') === 'true';
        const protocol = useSSL ? 'https' : 'http';
        const host = this.configService.get('MINIO_ENDPOINT') || 'localhost';
        return `${protocol}://${host}:${port}/${this.bucketName}/${objectName}`;
    }
    async deleteFile(objectName) {
        if (!this.client || !this.isEnabled) {
            console.warn('MinIO 未启用，跳过文件删除');
            return;
        }
        await this.client.removeObject(this.bucketName, objectName);
    }
    extractObjectNameFromUrl(url) {
        const match = url.match(/\/stardust\/(.+)$/);
        return match ? match[1] : '';
    }
    isMinioEnabled() {
        return this.isEnabled && this.client !== null;
    }
};
exports.MinioService = MinioService;
exports.MinioService = MinioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], MinioService);


/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("minio");

/***/ }),
/* 11 */
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
const jwt_1 = __webpack_require__(12);
const passport_1 = __webpack_require__(13);
const auth_service_1 = __webpack_require__(14);
const auth_controller_1 = __webpack_require__(16);
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
/* 12 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 14 */
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
const jwt_1 = __webpack_require__(12);
const prisma_service_1 = __webpack_require__(6);
const bcrypt = __importStar(__webpack_require__(15));
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(data) {
        if (!data.password) {
            throw new Error('密码不能为空');
        }
        if (!data.birthYear || !data.birthMonth || !data.birthDay || data.birthHour === undefined) {
            throw new Error('请填写完整的出生信息');
        }
        if (!data.phone && !data.email) {
            throw new Error('请提供手机号或邮箱');
        }
        if (data.phone) {
            const existingPhone = await this.prisma.user.findUnique({
                where: { phone: data.phone },
            });
            if (existingPhone) {
                throw new Error('该手机号已被注册');
            }
        }
        if (data.email) {
            const existingEmail = await this.prisma.user.findUnique({
                where: { email: data.email },
            });
            if (existingEmail) {
                throw new Error('该邮箱已被注册');
            }
        }
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
        if (!identifier || !password) {
            throw new Error('请填写账号和密码');
        }
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: identifier }, { phone: identifier }],
            },
        });
        if (!user) {
            throw new Error('账号不存在');
        }
        if (!user.password) {
            throw new Error('该账号为微信登录，请使用微信登录');
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
    async wechatLogin(code, userInfo) {
        if (!code) {
            throw new Error('微信登录code不能为空');
        }
        const wechatResult = {
            openid: `mock_openid_${code}`,
            unionid: `mock_unionid_${code}`,
            session_key: 'mock_session_key'
        };
        if (wechatResult.errcode) {
            throw new Error(`微信登录失败: ${wechatResult.errmsg}`);
        }
        let user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { wechatOpenId: wechatResult.openid },
                    { wechatUnionId: wechatResult.unionid }
                ]
            }
        });
        let isNewUser = false;
        if (!user) {
            isNewUser = true;
            const nickname = userInfo?.nickName || `用户_${wechatResult.openid.slice(-6)}`;
            const avatar = userInfo?.avatarUrl || '';
            user = await this.prisma.user.create({
                data: {
                    wechatOpenId: wechatResult.openid,
                    wechatUnionId: wechatResult.unionid,
                    nickname,
                    avatar,
                    birthYear: 1990,
                    birthMonth: 1,
                    birthDay: 1,
                    birthHour: 0,
                }
            });
        }
        const token = this.generateToken(user.id);
        return {
            user: this.sanitizeUser(user),
            token,
            isNewUser
        };
    }
    async bindWechat(userId, code) {
        const wechatResult = {
            openid: `mock_openid_${code}`,
            unionid: `mock_unionid_${code}`,
            session_key: 'mock_session_key'
        };
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { wechatOpenId: wechatResult.openid },
                    { wechatUnionId: wechatResult.unionid }
                ]
            }
        });
        if (existingUser) {
            throw new Error('该微信账号已绑定其他账号');
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                wechatOpenId: wechatResult.openid,
                wechatUnionId: wechatResult.unionid
            }
        });
        return {
            success: true,
            user: this.sanitizeUser(updatedUser)
        };
    }
    async unbindWechat(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            throw new Error('用户不存在');
        }
        if (!user.wechatOpenId) {
            throw new Error('该账号未绑定微信');
        }
        if (!user.email && !user.phone) {
            throw new Error('无法解绑：该账号仅支持微信登录，请先绑定手机号或邮箱');
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                wechatOpenId: null,
                wechatUnionId: null
            }
        });
        return {
            success: true,
            user: this.sanitizeUser(updatedUser)
        };
    }
    generateToken(userId) {
        return this.jwtService.sign({ sub: userId });
    }
    sanitizeUser(user) {
        const { password, ...sanitized } = user;
        return sanitized;
    }
    async getUserById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new Error('用户不存在');
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], AuthService);


/***/ }),
/* 15 */
/***/ ((module) => {

module.exports = require("bcrypt");

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
exports.AuthController = void 0;
const common_1 = __webpack_require__(2);
const auth_service_1 = __webpack_require__(14);
const jwt_auth_guard_1 = __webpack_require__(17);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(data) {
        try {
            const result = await this.authService.register(data);
            return {
                success: true,
                ...result
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || '注册失败');
        }
    }
    async login(data) {
        try {
            const result = await this.authService.login(data.identifier, data.password);
            return {
                success: true,
                ...result
            };
        }
        catch (error) {
            if (error.message === '账号不存在') {
                throw new common_1.NotFoundException(error.message);
            }
            throw new common_1.BadRequestException(error.message || '登录失败');
        }
    }
    async wechatLogin(data) {
        try {
            const result = await this.authService.wechatLogin(data.code, data.userInfo);
            return {
                success: true,
                ...result
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || '微信登录失败');
        }
    }
    async bindWechat(req, data) {
        try {
            const userId = req.user.sub;
            const result = await this.authService.bindWechat(userId, data.code);
            return {
                success: true,
                ...result
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || '绑定微信失败');
        }
    }
    async unbindWechat(req) {
        try {
            const userId = req.user.sub;
            const result = await this.authService.unbindWechat(userId);
            return {
                success: true,
                ...result
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || '解绑微信失败');
        }
    }
    async getProfile(req) {
        const userId = req.user.sub;
        const user = await this.authService.getUserById(userId);
        return {
            success: true,
            user: this.authService.sanitizeUser(user),
            message: '认证成功'
        };
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
__decorate([
    (0, common_1.Post)('wechat/login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "wechatLogin", null);
__decorate([
    (0, common_1.Post)('wechat/bind'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "bindWechat", null);
__decorate([
    (0, common_1.Post)('wechat/unbind'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "unbindWechat", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


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
const jwt_1 = __webpack_require__(12);
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
exports.UserModule = void 0;
const common_1 = __webpack_require__(2);
const user_service_1 = __webpack_require__(19);
const user_controller_1 = __webpack_require__(20);
const prisma_module_1 = __webpack_require__(5);
const auth_module_1 = __webpack_require__(11);
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
/* 20 */
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
const user_service_1 = __webpack_require__(19);
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
/* 21 */
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
const astrology_service_1 = __webpack_require__(22);
const astrology_controller_1 = __webpack_require__(25);
const prisma_module_1 = __webpack_require__(5);
const astrology_utils_1 = __webpack_require__(23);
const auth_module_1 = __webpack_require__(11);
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AstrologyServiceModule = void 0;
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(4);
const prisma_service_1 = __webpack_require__(6);
const astrology_utils_1 = __webpack_require__(23);
let AstrologyServiceModule = class AstrologyServiceModule {
    constructor(configService, prisma, astrologyService) {
        this.configService = configService;
        this.prisma = prisma;
        this.astrologyService = astrologyService;
        this.apiKey = this.configService.get('XIAOMIMIMO_API_KEY');
        this.baseUrl = this.configService.get('XIAOMIMIMO_API_URL');
        this.model = this.configService.get('XIAOMIMIMO_MODEL');
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
        const baZiPillars = this.astrologyService.getBaZiPillars(user.birthYear, user.birthMonth, user.birthDay, user.birthHour);
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                lunarDate: `${lunar.lunarYearText}年${lunar.lunarMonthText}${lunar.lunarDayText}`,
                zodiacSign,
                fiveElements: JSON.stringify(fiveElements),
            },
        });
        await this.prisma.astrologyReading.upsert({
            where: { userId },
            create: {
                userId,
                zodiacSign,
                lunarDate: `${lunar.lunarYearText}年${lunar.lunarMonthText}${lunar.lunarDayText}`,
                yearPillar: baZiPillars.yearPillar,
                monthPillar: baZiPillars.monthPillar,
                dayPillar: baZiPillars.dayPillar,
                hourPillar: baZiPillars.hourPillar,
                fiveElements: JSON.stringify(fiveElements),
                zodiacInterpretation: '',
                baziInterpretation: '',
                klineInterpretation: '',
            },
            update: {
                zodiacSign,
                lunarDate: `${lunar.lunarYearText}年${lunar.lunarMonthText}${lunar.lunarDayText}`,
                yearPillar: baZiPillars.yearPillar,
                monthPillar: baZiPillars.monthPillar,
                dayPillar: baZiPillars.dayPillar,
                hourPillar: baZiPillars.hourPillar,
                fiveElements: JSON.stringify(fiveElements),
            },
        });
        return {
            user: updatedUser,
            lunar,
            zodiacSign,
            fiveElements,
            baZiPillars,
        };
    }
    async generateInterpretation(userId) {
        console.log('[AstrologyService] generateInterpretation start for userId:', userId);
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            console.error('[AstrologyService] User not found:', userId);
            throw new common_1.BadRequestException('用户不存在');
        }
        console.log('[AstrologyService] User found:', user.nickname || user.id, 'province:', user.birthProvince);
        let reading = await this.prisma.astrologyReading.findUnique({
            where: { userId },
        });
        if (!reading) {
            console.log('[AstrologyService] No reading found, calculating...');
            await this.calculateAstrology(userId);
            reading = await this.prisma.astrologyReading.findUnique({
                where: { userId },
            });
        }
        if (!reading) {
            console.error('[AstrologyService] Still no reading after calculate');
            throw new common_1.BadRequestException('无法获取星盘数据');
        }
        const today = new Date().toISOString().split('T')[0];
        const DAILY_LIMIT = 5;
        if (reading.lastInterpretDate !== today) {
            console.log('[AstrologyService] New day, resetting count');
            reading = await this.prisma.astrologyReading.update({
                where: { userId },
                data: {
                    dailyInterpretCount: 0,
                    lastInterpretDate: today,
                },
            });
        }
        if (reading.dailyInterpretCount >= DAILY_LIMIT) {
            console.log('[AstrologyService] Daily limit reached');
            throw new common_1.BadRequestException(`今日AI解读次数已用完（每日限制${DAILY_LIMIT}次），请明天再试`);
        }
        console.log('[AstrologyService] Daily interpretation count:', reading.dailyInterpretCount, '/', DAILY_LIMIT);
        console.log('[AstrologyService] Starting AI generation...');
        const birthProvince = user.birthProvince || '山西';
        const currentProvince = user.currentProvince || '北京';
        console.log('[AstrologyService] Starting zodiac interpretation...');
        const zodiacInterpretation = await this.generateZodiacInterpretation(reading.zodiacSign, user.gender, birthProvince, currentProvince);
        console.log('[AstrologyService] Zodiac interpretation completed');
        console.log('[AstrologyService] Starting bazi interpretation...');
        const baziInterpretation = await this.generateBaZiInterpretation(reading.yearPillar, reading.monthPillar, reading.dayPillar, reading.hourPillar, reading.fiveElements, user.gender, birthProvince, currentProvince);
        console.log('[AstrologyService] Bazi interpretation completed');
        console.log('[AstrologyService] Starting kline interpretation...');
        const klineInterpretation = await this.generateKlineInterpretation(user.birthYear, user.birthMonth, user.birthDay, user.birthHour, reading.zodiacSign, reading.yearPillar, reading.dayPillar, user.gender, birthProvince, currentProvince);
        console.log('[AstrologyService] Kline interpretation completed');
        console.log('[AstrologyService] Updating database...');
        const updatedReading = await this.prisma.astrologyReading.update({
            where: { userId },
            data: {
                zodiacInterpretation,
                baziInterpretation,
                klineInterpretation,
                dailyInterpretCount: reading.dailyInterpretCount + 1,
                lastInterpretDate: today,
            },
        });
        console.log('[AstrologyService] All completed successfully');
        return {
            ...updatedReading,
            fiveElements: JSON.parse(updatedReading.fiveElements || '{}'),
            zodiacInterpretation: this.safeParseJSON(updatedReading.zodiacInterpretation),
            baziInterpretation: this.safeParseJSON(updatedReading.baziInterpretation),
            klineInterpretation: this.safeParseJSON(updatedReading.klineInterpretation),
        };
    }
    async getReading(userId) {
        const reading = await this.prisma.astrologyReading.findUnique({
            where: { userId },
        });
        if (!reading) {
            return null;
        }
        return {
            ...reading,
            fiveElements: JSON.parse(reading.fiveElements || '{}'),
            zodiacInterpretation: this.safeParseJSON(reading.zodiacInterpretation),
            baziInterpretation: this.safeParseJSON(reading.baziInterpretation),
            klineInterpretation: this.safeParseJSON(reading.klineInterpretation),
        };
    }
    async getRemainingAttempts(userId) {
        const DAILY_LIMIT = 5;
        const today = new Date().toISOString().split('T')[0];
        const reading = await this.prisma.astrologyReading.findUnique({
            where: { userId },
        });
        if (!reading || reading.lastInterpretDate !== today) {
            return {
                remaining: DAILY_LIMIT,
                total: DAILY_LIMIT,
                used: 0,
            };
        }
        return {
            remaining: Math.max(0, DAILY_LIMIT - reading.dailyInterpretCount),
            total: DAILY_LIMIT,
            used: reading.dailyInterpretCount,
        };
    }
    safeParseJSON(jsonString) {
        if (!jsonString || jsonString.trim() === '') {
            return null;
        }
        try {
            return JSON.parse(jsonString);
        }
        catch (e) {
            return jsonString;
        }
    }
    async fetchWithTimeout(url, options, timeout = 600000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            return response;
        }
        catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof Error && error.name === 'AbortError') {
                throw new Error(`请求超时（${timeout / 1000}秒）`);
            }
            throw error;
        }
    }
    async generateZodiacInterpretation(zodiacSign, gender, birthProvince, currentProvince) {
        const genderText = gender === 'male' ? '男性' : gender === 'female' ? '女性' : '';
        const birthProvinceText = birthProvince ? `出生于${birthProvince}` : '';
        const currentProvinceText = currentProvince ? `目前居住在${currentProvince}` : '';
        const prompt = `请作为专业的星座占星师，为${zodiacSign}${genderText}${birthProvinceText}${currentProvinceText}进行详细的性格分析和运势解读。

请从以下几个方面进行分析：
1. 性格特点：分析该星座的核心性格特征、优点和需要注意的地方${birthProvinceText ? `，结合${birthProvince}的地域文化特色分析性格特质` : ''}${currentProvinceText ? `，考虑在${currentProvince}的生活环境对性格的影响` : ''}
2. 爱情感情：分析该星座在爱情中的表现和配对建议
3. 事业发展：分析适合的职业方向和事业发展建议${currentProvinceText ? `，结合${currentProvince}的就业环境和机会` : ''}
4. 守护星：说明该星座的守护星及其象征意义
5. 幸运元素：幸运颜色、幸运数字、幸运日期等
6. 综合运势：整体运势分析和建议

请以专业但不失亲和力的语言进行解读，让读者能够获得有价值的指导。

请严格按照以下JSON格式返回结果：

{
  "success": true,
  "data": {
    "personality": "性格特点分析...",
    "love": "爱情感情分析...",
    "career": "事业发展分析...",
    "guardianStar": "守护星信息...",
    "luckyElements": "幸运元素信息...",
    "overall": "综合运势分析..."
  }
}`;
        try {
            const response = await this.fetchWithTimeout(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                }),
            }, 600000);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API 请求失败: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            const content = data.choices?.[0]?.message?.content || '解读失败，请重试';
            const result = this.parseInterpretation(content);
            return JSON.stringify(result);
        }
        catch (error) {
            console.error('星座解读错误:', error);
            return JSON.stringify({
                personality: `${zodiacSign}的人通常具有独特的个性魅力。`,
                love: '在感情中，你真诚而专一，适合稳定的伴侣关系。',
                career: '你有很强的事业心，适合在能够发挥创造力的领域发展。',
                guardianStar: `守护星赋予你特殊的力量和天赋。`,
                luckyElements: '保持积极乐观的心态，好运自然会到来。',
                overall: `整体来看，作为${zodiacSign}，你有很好的发展潜力，只要保持专注和坚持，未来可期。`,
            });
        }
    }
    async generateBaZiInterpretation(yearPillar, monthPillar, dayPillar, hourPillar, fiveElementsJson, gender, birthProvince, currentProvince) {
        const genderText = gender === 'male' ? '男性' : gender === 'female' ? '女性' : '';
        const fiveElements = JSON.parse(fiveElementsJson || '{}');
        const birthProvinceText = birthProvince ? `出生地：${birthProvince}` : '';
        const currentProvinceText = currentProvince ? `现居地：${currentProvince}` : '';
        const maxElement = Object.entries(fiveElements).reduce((a, b) => b[1] > a[1] ? b : a);
        const elementNames = {
            wood: '木',
            fire: '火',
            earth: '土',
            metal: '金',
            water: '水',
        };
        const prompt = `请作为专业的八字命理师，对以下八字进行详细分析：

出生者性别：${genderText || '未知'}
${birthProvinceText}
${currentProvinceText}
八字四柱：
年柱：${yearPillar}
月柱：${monthPillar}
日柱：${dayPillar}
时柱：${hourPillar}

五行统计：
木：${fiveElements.wood}个
火：${fiveElements.fire}个
土：${fiveElements.earth}个
金：${fiveElements.metal}个
水：${fiveElements.water}个

命主五行：${elementNames[maxElement[0]]}

请从以下几个方面进行分析：
1. 命局分析：分析日主强弱、格局高低${birthProvince ? `，结合${birthProvince}的地域命理特色` : ''}
2. 五行喜忌：分析命主喜用神和忌神
3. 性格特质：根据八字分析性格特点
4. 事业财运：分析适合的行业和财运运势
5. 婚姻感情：分析婚姻运势和配对建议
6. 健康运势：分析需要注意的健康问题
7. 流年运势：近几年的运势分析
8. 开运建议：如何通过风水、习惯等提升运势

请以专业但通俗易懂的语言进行解读，给读者实用的人生指导。

请严格按照以下JSON格式返回结果：

{
  "success": true,
  "data": {
    "mingJu": "命局分析...",
    "wuXing": "五行喜忌分析...",
    "character": "性格特质分析...",
    "career": "事业财运分析...",
    "marriage": "婚姻感情分析...",
    "health": "健康运势分析...",
    "yearlyFortune": "流年运势分析...",
    "advice": "开运建议..."
  }
}`;
        try {
            const response = await this.fetchWithTimeout(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                }),
            }, 600000);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API 请求失败: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            const content = data.choices?.[0]?.message?.content || '解读失败，请重试';
            const result = this.parseInterpretation(content);
            return JSON.stringify(result);
        }
        catch (error) {
            console.error('八字解读错误:', error);
            return JSON.stringify({
                mingJu: `日主为${dayPillar[0]}，生于${monthPillar[0]}月，命局具有独特的能量场。`,
                wuXing: `五行以${elementNames[maxElement[0]]}为主，宜通过五行平衡来提升运势。`,
                character: '你性格稳重踏实，做事有计划，值得信赖。',
                career: '适合从事需要耐心和专注的工作，事业发展稳健向好。',
                marriage: '感情专一，适合晚婚，能建立稳定的家庭关系。',
                health: '注意保持规律作息，适度运动有助于健康。',
                yearlyFortune: '整体运势平稳向上，把握机会可有所作为。',
                advice: '保持积极心态，多行善事，注意人际关系的维护。',
            });
        }
    }
    parseInterpretation(content) {
        try {
            let cleanedContent = content
                .replace(/```json\s*/g, '')
                .replace(/```\s*/g, '')
                .trim();
            try {
                const parsed = JSON.parse(cleanedContent);
                if (parsed.success && parsed.data) {
                    return parsed.data;
                }
                return parsed;
            }
            catch (e) {
            }
            const firstBrace = cleanedContent.indexOf('{');
            const lastBrace = cleanedContent.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                let jsonStr = cleanedContent.substring(firstBrace, lastBrace + 1);
                const openBraces = (jsonStr.match(/{/g) || []).length;
                const closeBraces = (jsonStr.match(/}/g) || []).length;
                const openBrackets = (jsonStr.match(/\[/g) || []).length;
                const closeBrackets = (jsonStr.match(/\]/g) || []).length;
                jsonStr += '}'.repeat(Math.max(0, openBraces - closeBraces));
                jsonStr += ']'.repeat(Math.max(0, openBrackets - closeBrackets));
                const lastQuoteIndex = jsonStr.lastIndexOf('"');
                if (lastQuoteIndex !== -1) {
                    const afterLastQuote = jsonStr.substring(lastQuoteIndex + 1);
                    if (!/^[,\]\}\s]*$/.test(afterLastQuote)) {
                        const fieldMatch = jsonStr.substring(0, lastQuoteIndex).match(/"([^"]+)":\s*"$/);
                        if (fieldMatch) {
                            jsonStr = jsonStr.substring(0, lastQuoteIndex + 1) + '"' + jsonStr.substring(lastQuoteIndex + 1);
                        }
                    }
                }
                try {
                    const parsed = JSON.parse(jsonStr);
                    if (parsed.success && parsed.data) {
                        return parsed.data;
                    }
                    return parsed;
                }
                catch (e2) {
                }
            }
            throw new Error('JSON parse failed');
        }
        catch (error) {
            console.error('JSON 解析失败:', error instanceof Error ? error.message : error);
            console.error('原始内容:', content.substring(0, 500));
            throw error;
        }
    }
    async generateKlineInterpretation(birthYear, birthMonth, birthDay, birthHour, zodiacSign, yearPillar, dayPillar, gender, birthProvince, currentProvince) {
        const genderText = gender === 'male' ? '男性' : gender === 'female' ? '女性' : '';
        const currentYear = new Date().getFullYear();
        const age = currentYear - birthYear;
        const birthProvinceText = birthProvince ? `出生地：${birthProvince}` : '';
        const currentProvinceText = currentProvince ? `现居地：${currentProvince}` : '';
        const lifeStages = [];
        for (let i = 0; i <= 80; i += 10) {
            const year = birthYear + i;
            const stageAge = i;
            lifeStages.push({ year, age: stageAge });
        }
        const prompt = `请作为专业的人生规划师和命理分析师，为一位${age}岁的${genderText}生成"人生K线"分析。

出生信息：
- 出生日期：${birthYear}年${birthMonth}月${birthDay}日${birthHour}时
- 星座：${zodiacSign}
- 年柱：${yearPillar}（日主：${dayPillar[0]}）
${birthProvinceText ? `- ${birthProvinceText}` : ''}
${currentProvinceText ? `- ${currentProvinceText}` : ''}

请分析人生运势走势，按照人生每10年为一个阶段，生成类似股票K线的分析数据。包括：
1. **运势指数**：0-100的数值，表示该阶段的整体运势水平
2. **事业运**：事业发展的趋势和关键节点${birthProvince ? `，结合${birthProvince}的地域文化背景` : ''}${currentProvince ? `，考虑在${currentProvince}的发展机会和资源` : ''}
3. **财运**：财务状况和投资理财建议
4. **感情运**：感情生活和婚姻运势
5. **健康运**：健康状况和注意事项
6. **关键事件**：该阶段可能遇到的重要人生转折点

请按照以下人生阶段进行分析：
${lifeStages.map(s => `- ${s.age}-${s.age + 9}岁（${s.year}-${s.year + 9}年）`).join('\n')}

请以人生K线的概念，描述运势的起伏变化，包括高点、低点、震荡期等。

请严格按照以下JSON格式返回结果：

{
  "success": true,
  "data": {
    "overallTrend": "整体运势趋势描述...",
    "lifeStages": [
      {
        "age": "0-9",
        "years": "2000-2009",
        "fortune": 75,
        "career": "事业运描述...",
        "wealth": "财运描述...",
        "love": "感情运描述...",
        "health": "健康运描述...",
        "keyEvents": "关键事件..."
      }
    ],
    "advice": "综合建议和人生指导..."
  }
}`;
        try {
            const response = await this.fetchWithTimeout(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                }),
            }, 600000);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API 请求失败: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            const content = data.choices?.[0]?.message?.content || '解读失败，请重试';
            const result = this.parseInterpretation(content);
            return JSON.stringify(result);
        }
        catch (error) {
            console.error('人生K线解读错误:', error);
            const defaultStages = lifeStages.map((stage, index) => {
                const baseFortune = 60 + Math.sin(index * 0.8) * 20;
                return {
                    age: `${stage.age}-${stage.age + 9}`,
                    years: `${stage.year}-${stage.year + 9}`,
                    fortune: Math.round(baseFortune),
                    career: index < 2 ? '成长学习期，为未来打基础' : index < 5 ? '事业发展黄金期，努力拼搏' : '事业稳定期，享受成果',
                    wealth: index < 2 ? '积累知识技能最重要' : index < 5 ? '财运上升，投资理财正当时' : '财务稳健，注意资产保值',
                    love: index < 2 ? '纯真年华，享受青春美好' : index < 5 ? '恋爱婚姻关键期，把握良缘' : '家庭和睦，感情稳定',
                    health: index < 4 ? '身体素质良好，保持运动习惯' : '注重养生，定期体检',
                    keyEvents: index === 2 ? '可能遇到重要的人生转折点' : index === 5 ? '事业或家庭可能有重大变化' : '平稳发展，循序渐进',
                };
            });
            return JSON.stringify({
                overallTrend: `人生运势呈现波浪式上升趋势，${zodiacSign}的特质让你在不同阶段都能展现出独特的优势。`,
                lifeStages: defaultStages,
                advice: '把握人生节奏，在上升期全力以赴，在调整期积蓄力量。保持积极心态，顺应时势变化。',
            });
        }
    }
};
exports.AstrologyServiceModule = AstrologyServiceModule;
exports.AstrologyServiceModule = AstrologyServiceModule = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, typeof (_b = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _b : Object, typeof (_c = typeof astrology_utils_1.AstrologyService !== "undefined" && astrology_utils_1.AstrologyService) === "function" ? _c : Object])
], AstrologyServiceModule);


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
exports.AstrologyService = void 0;
const common_1 = __webpack_require__(2);
const lunar = __webpack_require__(24);
let AstrologyService = class AstrologyService {
    solarToLunar(year, month, day, hour) {
        const monthStr = month.toString().padStart(2, '0');
        const dayStr = day.toString().padStart(2, '0');
        const data = lunar(year.toString(), monthStr, dayStr)
            .setTime(hour.toString())
            .getJson();
        const lunarYearText = data.chineseYear || '';
        return {
            lunarYear: parseInt(data.year),
            lunarMonth: data.lunarMonthDigit || 0,
            lunarDay: data.lunarDayDigit || 0,
            lunarMonthText: data.lunarMonth || '',
            lunarDayText: data.lunarDay || '',
            lunarYearText,
            ganzhiYear: data.chineseYear || '',
            ganzhiMonth: data.chineseMonth || '',
            ganzhiDay: data.chineseDay || '',
            ganzhiHour: data.chineseTime || '',
            animal: data.animal || '',
            constellation: data.constellation || '',
        };
    }
    getZodiacSign(month, day) {
        const monthStr = month.toString().padStart(2, '0');
        const dayStr = day.toString().padStart(2, '0');
        const data = lunar(new Date().getFullYear().toString(), monthStr, dayStr).getJson();
        return data.constellation || '未知';
    }
    getFiveElements(year, month, day, hour) {
        const baZiPillars = this.getBaZiPillars(year, month, day, hour);
        const elements = {
            wood: 0,
            fire: 0,
            earth: 0,
            metal: 0,
            water: 0,
        };
        const pillars = [
            baZiPillars.yearPillar,
            baZiPillars.monthPillar,
            baZiPillars.dayPillar,
            baZiPillars.hourPillar,
        ];
        pillars.forEach((pillar) => {
            const gan = pillar[0];
            const zhi = pillar.substring(1);
            const ganElement = this.getElementByGan(gan);
            const zhiElement = this.getElementByZhi(zhi);
            if (ganElement)
                elements[ganElement]++;
            if (zhiElement)
                elements[zhiElement]++;
        });
        return elements;
    }
    getBaZiPillars(year, month, day, hour) {
        const monthStr = month.toString().padStart(2, '0');
        const dayStr = day.toString().padStart(2, '0');
        const data = lunar(year.toString(), monthStr, dayStr)
            .setTime(hour.toString())
            .getJson();
        const yearPillar = data.chineseYear || '';
        const monthPillar = data.chineseMonth || '';
        const dayPillar = data.chineseDay || '';
        const hourPillar = data.chineseTime || '';
        console.log('[AstrologyUtils] BaZi pillars calculated:', {
            input: { year, month, day, hour },
            pillars: {
                yearPillar,
                monthPillar,
                dayPillar,
                hourPillar,
            },
            lunar: {
                lunarYear: data.lunarYearText,
                lunarMonth: data.lunarMonth,
                lunarDay: data.lunarDay,
                animal: data.animal,
                constellation: data.constellation,
            },
        });
        return {
            yearPillar,
            monthPillar,
            dayPillar,
            hourPillar,
        };
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
/* 24 */
/***/ ((module) => {

module.exports = require("@tony801015/chinese-lunar");

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AstrologyController = void 0;
const common_1 = __webpack_require__(2);
const astrology_service_1 = __webpack_require__(22);
const jwt_auth_guard_1 = __webpack_require__(17);
let AstrologyController = class AstrologyController {
    constructor(astrologyService) {
        this.astrologyService = astrologyService;
    }
    async calculate(userId) {
        return this.astrologyService.calculateAstrology(userId);
    }
    async generateInterpretation(req) {
        const userId = req.user.sub;
        console.log('[Astrology] generateInterpretation called for userId:', userId);
        try {
            const result = await this.astrologyService.generateInterpretation(userId);
            console.log('[Astrology] generateInterpretation success');
            console.log('[Astrology] Returning data structure:', {
                hasResult: !!result,
                keys: result ? Object.keys(result) : [],
                hasZodiac: !!result?.zodiacInterpretation,
                hasBazi: !!result?.baziInterpretation,
                hasKline: !!result?.klineInterpretation,
            });
            return result;
        }
        catch (error) {
            console.error('[Astrology] generateInterpretation error:', error);
            throw error;
        }
    }
    async getReading(req) {
        const userId = req.user.sub;
        return this.astrologyService.getReading(userId);
    }
    async getRemainingAttempts(req) {
        const userId = req.user.sub;
        return this.astrologyService.getRemainingAttempts(userId);
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
__decorate([
    (0, common_1.Post)('interpret'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AstrologyController.prototype, "generateInterpretation", null);
__decorate([
    (0, common_1.Get)('reading'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AstrologyController.prototype, "getReading", null);
__decorate([
    (0, common_1.Get)('interpret/remaining'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AstrologyController.prototype, "getRemainingAttempts", null);
exports.AstrologyController = AstrologyController = __decorate([
    (0, common_1.Controller)('astrology'),
    __metadata("design:paramtypes", [typeof (_a = typeof astrology_service_1.AstrologyServiceModule !== "undefined" && astrology_service_1.AstrologyServiceModule) === "function" ? _a : Object])
], AstrologyController);


/***/ }),
/* 26 */
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
const prayer_service_1 = __webpack_require__(27);
const prayer_controller_1 = __webpack_require__(29);
const prisma_module_1 = __webpack_require__(5);
const auth_module_1 = __webpack_require__(11);
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
/* 27 */
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
exports.PrayerService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(6);
const config_1 = __webpack_require__(4);
const deity_categories_1 = __webpack_require__(28);
let PrayerService = class PrayerService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.aiApiKey = this.configService.get('XIAOMIMIMO_API_KEY') || '';
        this.aiBaseUrl = this.configService.get('XIAOMIMIMO_API_URL') || '';
        this.aiModel = this.configService.get('XIAOMIMIMO_MODEL') || 'glm-4-flash';
    }
    async classifyContent(content) {
        const categoryId = await this.classifyPrayerContent(content);
        const category = Object.values(deity_categories_1.DEITY_CATEGORIES).find(cat => cat.id === categoryId);
        if (!category) {
            const defaultCategory = deity_categories_1.DEITY_CATEGORIES.CATEGORY_1;
            return {
                categoryId: defaultCategory.id,
                categoryName: defaultCategory.name,
                deities: defaultCategory.deities
            };
        }
        return {
            categoryId: category.id,
            categoryName: category.name,
            deities: category.deities
        };
    }
    async classifyPrayerContent(content) {
        try {
            const categoryNames = Object.values(deity_categories_1.DEITY_CATEGORIES).map(cat => cat.name);
            const prompt = `你是一个精通宗教、民俗与神话文化的智能助手。请根据用户描述的祈祷内容，判断其核心祈愿目的，并将其归入以下10个预定义类别中的**唯一一个最匹配的类别**。

【类别定义】
${categoryNames.map((name, i) => `${i + 1}. ${name}`).join('\n')}

【分类规则】
- 仅根据**祈祷内容的意图**判断，不依赖是否提及具体神名。
- 若祈祷内容涉及多个方面，选择**最主要或最明确的目的**。
- "保平安""消灾""万事如意"等泛化表述，归入 **1. 综合护佑 / 万能型**。
- "顺利""成功"需结合上下文：考试→4，生意→3，旅行→9，战斗→7。
- 不确定时，优先选择语义最贴近的类别。

【输出要求】
- 仅输出完整的类别名称（如："求财 / 商业兴旺"），不要编号、解释、标点或额外文字。
- 确保输出严格来自上述10个类别之一。

现在，请对以下祈祷内容进行分类：${content}`;
            const response = await fetch(`${this.aiBaseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.aiApiKey}`,
                },
                body: JSON.stringify({
                    model: this.aiModel,
                    messages: [
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.3,
                    max_tokens: 50,
                }),
            });
            if (!response.ok) {
                console.error('[PrayerService] AI classification failed:', response.status);
                return 'category_1';
            }
            const data = await response.json();
            const result = data.choices?.[0]?.message?.content?.trim() || '综合护佑 / 万能型';
            const category = Object.values(deity_categories_1.DEITY_CATEGORIES).find(cat => cat.name === result);
            return category?.id || 'category_1';
        }
        catch (error) {
            console.error('[PrayerService] AI classification error:', error);
            return 'category_1';
        }
    }
    async createPrayer(userId, data) {
        let category = data.category;
        if (!category) {
            category = await this.classifyPrayerContent(data.content);
        }
        const deitiesJson = data.deities ? JSON.stringify(data.deities) : null;
        return this.prisma.prayer.create({
            data: {
                userId,
                content: data.content,
                category,
                deities: deitiesJson,
                isAnonymous: data.isAnonymous ?? false,
            },
            include: {
                user: true,
            },
        });
    }
    async getUserPrayers(userId) {
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
    async getPrayers() {
        return this.prisma.prayer.findMany({
            take: 100,
            include: {
                user: {
                    select: {
                        id: true,
                        nickname: true,
                        anonymousNickname: true,
                        avatar: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
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
                        anonymousNickname: true,
                        avatar: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async supportPrayer(prayerId) {
        return this.prisma.prayer.update({
            where: { id: prayerId },
            data: {
                supports: {
                    increment: 1,
                },
            },
        });
    }
    getCategories() {
        return Object.values(deity_categories_1.DEITY_CATEGORIES).map(cat => ({
            id: cat.id,
            name: cat.name,
            deityCount: cat.deities.length,
            deities: cat.deities,
        }));
    }
    getDeitiesByCategory(categoryId) {
        const category = Object.values(deity_categories_1.DEITY_CATEGORIES).find(cat => cat.id === categoryId);
        if (!category) {
            throw new common_1.BadRequestException('分类不存在');
        }
        return category.deities;
    }
};
exports.PrayerService = PrayerService;
exports.PrayerService = PrayerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object])
], PrayerService);


/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DEITY_CATEGORIES = void 0;
exports.getAllCategories = getAllCategories;
exports.getCategoryById = getCategoryById;
exports.getCategoryList = getCategoryList;
exports.DEITY_CATEGORIES = {
    CATEGORY_1: {
        name: '综合护佑 / 万能型',
        id: 'category_1',
        deities: [
            '如来佛（佛教）',
            '玉皇大帝（道教/民间信仰）',
            '上帝 / 天主（基督教/天主教）',
            '宙斯（希腊神话，众神之王，掌管秩序与命运）',
        ]
    },
    CATEGORY_2: {
        name: '求子 / 护佑孩童',
        id: 'category_2',
        deities: [
            '观音菩萨（佛教，送子观音）',
            '注生娘娘（道教/民间信仰）',
            '碧霞元君（泰山娘娘）（道教，华北地区求子主神）',
            '圣母玛利亚（天主教/东正教，常被祈求保佑母婴平安）',
            '赫拉（希腊神话，婚姻与生育女神）',
        ]
    },
    CATEGORY_3: {
        name: '求财 / 商业兴旺',
        id: 'category_3',
        deities: [
            '财神（赵公明、关公、比干等）（道教/民间信仰）',
            '弥勒佛（布袋和尚形象）（佛教，象征富足欢喜）',
            '土地公（民间信仰，也兼管地方财运）',
            '圣尼古拉（基督教，水手与商人的守护圣人，圣诞老人原型）',
            '墨丘利（Mercury）（罗马神话，商业、旅行与财富之神）',
        ]
    },
    CATEGORY_4: {
        name: '学业 / 功名 / 考试',
        id: 'category_4',
        deities: [
            '文昌帝君（道教，掌管文运功名）',
            '孔子（至圣先师）（儒家，被尊为文教之神）',
            '魁星（民间信仰，主宰文章兴衰）',
            '圣托马斯·阿奎那（天主教，学者主保圣人）',
            '雅典娜（希腊神话，智慧、战略与技艺女神）',
        ]
    },
    CATEGORY_5: {
        name: '姻缘 / 爱情',
        id: 'category_5',
        deities: [
            '月老（道教/民间信仰，掌姻缘红线）',
            '七仙女 / 织女（民间传说，象征忠贞爱情）',
            '维纳斯（Venus）（罗马神话，爱与美之神）',
            '阿佛洛狄忒（Aphrodite）（希腊神话，同维纳斯）',
            '圣瓦伦丁（St. Valentine）（基督教，情人节来源，爱情守护圣人）',
        ]
    },
    CATEGORY_6: {
        name: '健康 / 祛病 / 长寿',
        id: 'category_6',
        deities: [
            '药师佛（佛教，东方净琉璃世界教主，消灾延寿）',
            '孙思邈（药王）（道教/民间信仰）',
            '保生大帝（闽台地区医神）',
            '圣卢克（St. Luke）（基督教，医生与艺术家的主保圣人）',
            '阿斯克勒庇俄斯（Asclepius）（希腊神话，医神，蛇杖象征）',
        ]
    },
    CATEGORY_7: {
        name: '武运 / 忠义 / 护法',
        id: 'category_7',
        deities: [
            '关公（关帝）（道教/民间信仰，武圣、忠义、驱邪、招财）',
            '韦驮菩萨（佛教，护法神）',
            '四大天王（佛教，护世护法）',
            '圣米迦勒（St. Michael）（天主教，天使长，驱魔战神）',
            '阿瑞斯（Ares） / 玛尔斯（Mars）（希腊/罗马战神）',
        ]
    },
    CATEGORY_8: {
        name: '农业 / 丰收 / 风调雨顺',
        id: 'category_8',
        deities: [
            '后稷（中国农神）',
            '龙王（道教/民间信仰，司雨）',
            '妈祖（林默娘）（虽主海事，但沿海农业亦祈其护佑风调）',
            '得墨忒耳（Demeter）（希腊神话，农业与丰收女神）',
            '克瑞斯（Ceres）（罗马神话，同得墨忒耳）',
        ]
    },
    CATEGORY_9: {
        name: '出行 / 航海 / 平安',
        id: 'category_9',
        deities: [
            '妈祖（中国东南沿海海神）',
            '临水夫人（陈靖姑）（闽台地区护产保童，也护出行）',
            '圣埃拉斯谟（St. Elmo）（基督教，水手守护圣人，"圣艾尔摩之火"来源）',
            '波塞冬（Poseidon）（希腊神话，海神——但通常需安抚而非祈求）',
            '雅典娜（智慧女神亦护佑旅人）',
        ]
    },
    CATEGORY_10: {
        name: '占卜 / 命运 / 神谕',
        id: 'category_10',
        deities: [
            '太上老君 / 六壬 / 奇门遁甲诸神（道教术数体系）',
            '伏羲 / 周文王（《易经》象征性始祖）',
            '阿波罗（Apollo）（希腊神话，德尔斐神谕发布者，预言之神）',
            '诺恩三女神（Norns）（北欧神话，编织命运之线）',
        ]
    },
};
function getAllCategories() {
    return Object.values(exports.DEITY_CATEGORIES);
}
function getCategoryById(id) {
    return Object.values(exports.DEITY_CATEGORIES).find(cat => cat.id === id);
}
function getCategoryList() {
    return Object.values(exports.DEITY_CATEGORIES).map(cat => ({
        id: cat.id,
        name: cat.name,
        deityCount: cat.deities.length,
    }));
}


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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrayerController = void 0;
const common_1 = __webpack_require__(2);
const prayer_service_1 = __webpack_require__(27);
const jwt_auth_guard_1 = __webpack_require__(17);
const express_1 = __webpack_require__(30);
let PrayerController = class PrayerController {
    constructor(prayerService) {
        this.prayerService = prayerService;
    }
    async createDevoutPrayer(data, req) {
        const userId = req.user.sub;
        return this.prayerService.createPrayer(userId, data);
    }
    async getUserPrayers(userId) {
        return this.prayerService.getUserPrayers(userId);
    }
    async getDevoutList() {
        return this.prayerService.getPrayers();
    }
    async supportPrayer(prayerId) {
        return this.prayerService.supportPrayer(prayerId);
    }
    async getPublicPrayers(skip, take) {
        const skipNum = skip ? Number(skip) : 0;
        const takeNum = take ? Number(take) : 20;
        return this.prayerService.getPublicPrayers(skipNum, takeNum);
    }
    async getCategories() {
        return this.prayerService.getCategories();
    }
    async getDeitiesByCategory(categoryId) {
        return this.prayerService.getDeitiesByCategory(categoryId);
    }
    async classifyContent(data) {
        return this.prayerService.classifyContent(data.content);
    }
    async createPrayer(data, req) {
        const userId = req.user.sub;
        return this.prayerService.createPrayer(userId, data);
    }
    async incrementPrayerCount(prayerId) {
        return this.prayerService.supportPrayer(prayerId);
    }
};
exports.PrayerController = PrayerController;
__decorate([
    (0, common_1.Post)('devout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], PrayerController.prototype, "createDevoutPrayer", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PrayerController.prototype, "getUserPrayers", null);
__decorate([
    (0, common_1.Get)('devout-list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PrayerController.prototype, "getDevoutList", null);
__decorate([
    (0, common_1.Post)('support/:prayerId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('prayerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PrayerController.prototype, "supportPrayer", null);
__decorate([
    (0, common_1.Get)('public'),
    __param(0, (0, common_1.Query)('skip')),
    __param(1, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PrayerController.prototype, "getPublicPrayers", null);
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PrayerController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('categories/:categoryId/deities'),
    __param(0, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PrayerController.prototype, "getDeitiesByCategory", null);
__decorate([
    (0, common_1.Post)('classify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrayerController.prototype, "classifyContent", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], PrayerController.prototype, "createPrayer", null);
__decorate([
    (0, common_1.Post)('increment/:prayerId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('prayerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PrayerController.prototype, "incrementPrayerCount", null);
exports.PrayerController = PrayerController = __decorate([
    (0, common_1.Controller)('prayer'),
    __metadata("design:paramtypes", [typeof (_a = typeof prayer_service_1.PrayerService !== "undefined" && prayer_service_1.PrayerService) === "function" ? _a : Object])
], PrayerController);


/***/ }),
/* 30 */
/***/ ((module) => {

module.exports = require("express");

/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DevoutPrayerModule = void 0;
const common_1 = __webpack_require__(2);
const devout_prayer_controller_1 = __webpack_require__(32);
const devout_prayer_service_1 = __webpack_require__(33);
const prisma_module_1 = __webpack_require__(5);
let DevoutPrayerModule = class DevoutPrayerModule {
};
exports.DevoutPrayerModule = DevoutPrayerModule;
exports.DevoutPrayerModule = DevoutPrayerModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [devout_prayer_controller_1.DevoutPrayerController],
        providers: [devout_prayer_service_1.DevoutPrayerService],
        exports: [devout_prayer_service_1.DevoutPrayerService],
    })
], DevoutPrayerModule);


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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DevoutPrayerController = void 0;
const common_1 = __webpack_require__(2);
const devout_prayer_service_1 = __webpack_require__(33);
const jwt_auth_guard_1 = __webpack_require__(17);
const express_1 = __webpack_require__(30);
let DevoutPrayerController = class DevoutPrayerController {
    constructor(devoutPrayerService) {
        this.devoutPrayerService = devoutPrayerService;
    }
    async createPrayer(data, req) {
        const userId = req.user.sub;
        return this.devoutPrayerService.createPrayer(userId, data);
    }
    async getUserPrayers(userId) {
        return this.devoutPrayerService.getUserPrayers(userId);
    }
    async getPrayers() {
        return this.devoutPrayerService.getPrayers();
    }
    async supportPrayer(prayerId) {
        return this.devoutPrayerService.supportPrayer(prayerId);
    }
    async getCategories() {
        return this.devoutPrayerService.getCategories();
    }
    async getDeitiesByCategory(categoryId) {
        return this.devoutPrayerService.getDeitiesByCategory(categoryId);
    }
    async classifyContent(data) {
        return this.devoutPrayerService.classifyContent(data.content);
    }
};
exports.DevoutPrayerController = DevoutPrayerController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], DevoutPrayerController.prototype, "createPrayer", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DevoutPrayerController.prototype, "getUserPrayers", null);
__decorate([
    (0, common_1.Get)('list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DevoutPrayerController.prototype, "getPrayers", null);
__decorate([
    (0, common_1.Post)('support/:prayerId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('prayerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DevoutPrayerController.prototype, "supportPrayer", null);
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DevoutPrayerController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('categories/:categoryId/deities'),
    __param(0, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DevoutPrayerController.prototype, "getDeitiesByCategory", null);
__decorate([
    (0, common_1.Post)('classify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DevoutPrayerController.prototype, "classifyContent", null);
exports.DevoutPrayerController = DevoutPrayerController = __decorate([
    (0, common_1.Controller)('devout-prayer'),
    __metadata("design:paramtypes", [typeof (_a = typeof devout_prayer_service_1.DevoutPrayerService !== "undefined" && devout_prayer_service_1.DevoutPrayerService) === "function" ? _a : Object])
], DevoutPrayerController);


/***/ }),
/* 33 */
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
exports.DevoutPrayerService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(6);
const config_1 = __webpack_require__(4);
const deity_categories_1 = __webpack_require__(28);
let DevoutPrayerService = class DevoutPrayerService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.aiApiKey = this.configService.get('XIAOMIMIMO_API_KEY') || '';
        this.aiBaseUrl = this.configService.get('XIAOMIMIMO_API_URL') || '';
        this.aiModel = this.configService.get('XIAOMIMIMO_MODEL') || 'glm-4-flash';
    }
    async classifyContent(content) {
        const categoryId = await this.classifyPrayerContent(content);
        const category = Object.values(deity_categories_1.DEITY_CATEGORIES).find(cat => cat.id === categoryId);
        if (!category) {
            const defaultCategory = deity_categories_1.DEITY_CATEGORIES.CATEGORY_1;
            return {
                categoryId: defaultCategory.id,
                categoryName: defaultCategory.name,
                deities: defaultCategory.deities
            };
        }
        return {
            categoryId: category.id,
            categoryName: category.name,
            deities: category.deities
        };
    }
    async classifyPrayerContent(content) {
        try {
            const categoryNames = Object.values(deity_categories_1.DEITY_CATEGORIES).map(cat => cat.name);
            const prompt = `你是一个精通宗教、民俗与神话文化的智能助手。请根据用户描述的祈祷内容，判断其核心祈愿目的，并将其归入以下10个预定义类别中的**唯一一个最匹配的类别**。

【类别定义】
${categoryNames.map((name, i) => `${i + 1}. ${name}`).join('\n')}

【分类规则】
- 仅根据**祈祷内容的意图**判断，不依赖是否提及具体神名。
- 若祈祷内容涉及多个方面，选择**最主要或最明确的目的**。
- "保平安""消灾""万事如意"等泛化表述，归入 **1. 综合护佑 / 万能型**。
- "顺利""成功"需结合上下文：考试→4，生意→3，旅行→9，战斗→7。
- 不确定时，优先选择语义最贴近的类别。

【输出要求】
- 仅输出完整的类别名称（如："求财 / 商业兴旺"），不要编号、解释、标点或额外文字。
- 确保输出严格来自上述10个类别之一。

现在，请对以下祈祷内容进行分类：${content}`;
            const response = await fetch(`${this.aiBaseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.aiApiKey}`,
                },
                body: JSON.stringify({
                    model: this.aiModel,
                    messages: [
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.3,
                    max_tokens: 50,
                }),
            });
            if (!response.ok) {
                console.error('[DevoutPrayerService] AI classification failed:', response.status);
                return 'category_1';
            }
            const data = await response.json();
            const result = data.choices?.[0]?.message?.content?.trim() || '综合护佑 / 万能型';
            const category = Object.values(deity_categories_1.DEITY_CATEGORIES).find(cat => cat.name === result);
            return category?.id || 'category_1';
        }
        catch (error) {
            console.error('[DevoutPrayerService] AI classification error:', error);
            return 'category_1';
        }
    }
    async createPrayer(userId, data) {
        let category = data.category;
        let categoryName = data.categoryName;
        let deities = data.deities;
        if (!category) {
            const classification = await this.classifyContent(data.content);
            category = classification.categoryId;
            categoryName = classification.categoryName;
            deities = [...classification.deities];
        }
        const deitiesJson = deities ? JSON.stringify(deities) : null;
        return this.prisma.devoutPrayer.create({
            data: {
                userId,
                content: data.content,
                category,
                categoryName,
                deities: deitiesJson,
                isAnonymous: data.isAnonymous ?? false,
            },
            include: {
                user: true,
            },
        });
    }
    async getUserPrayers(userId) {
        return this.prisma.devoutPrayer.findMany({
            where: { userId },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async getPrayers() {
        return this.prisma.devoutPrayer.findMany({
            take: 100,
            include: {
                user: {
                    select: {
                        id: true,
                        nickname: true,
                        anonymousNickname: true,
                        avatar: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async supportPrayer(prayerId) {
        return this.prisma.devoutPrayer.update({
            where: { id: prayerId },
            data: {
                supports: {
                    increment: 1,
                },
            },
        });
    }
    getCategories() {
        return Object.values(deity_categories_1.DEITY_CATEGORIES).map(cat => ({
            id: cat.id,
            name: cat.name,
            deityCount: cat.deities.length,
            deities: cat.deities,
        }));
    }
    getDeitiesByCategory(categoryId) {
        const category = Object.values(deity_categories_1.DEITY_CATEGORIES).find(cat => cat.id === categoryId);
        if (!category) {
            throw new common_1.BadRequestException('分类不存在');
        }
        return category.deities;
    }
};
exports.DevoutPrayerService = DevoutPrayerService;
exports.DevoutPrayerService = DevoutPrayerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object])
], DevoutPrayerService);


/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReunitePrayerModule = void 0;
const common_1 = __webpack_require__(2);
const reunite_prayer_controller_1 = __webpack_require__(35);
const reunite_prayer_service_1 = __webpack_require__(36);
const prisma_module_1 = __webpack_require__(5);
let ReunitePrayerModule = class ReunitePrayerModule {
};
exports.ReunitePrayerModule = ReunitePrayerModule;
exports.ReunitePrayerModule = ReunitePrayerModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [reunite_prayer_controller_1.ReunitePrayerController],
        providers: [reunite_prayer_service_1.ReunitePrayerService],
        exports: [reunite_prayer_service_1.ReunitePrayerService],
    })
], ReunitePrayerModule);


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
exports.ReunitePrayerController = void 0;
const common_1 = __webpack_require__(2);
const reunite_prayer_service_1 = __webpack_require__(36);
const jwt_auth_guard_1 = __webpack_require__(17);
const express_1 = __webpack_require__(30);
let ReunitePrayerController = class ReunitePrayerController {
    constructor(reunitePrayerService) {
        this.reunitePrayerService = reunitePrayerService;
    }
    async createPrayer(data, req) {
        const userId = req.user.sub;
        return this.reunitePrayerService.createPrayer(userId, data);
    }
    async getUserPrayers(userId) {
        return this.reunitePrayerService.getUserPrayers(userId);
    }
    async getPublicPrayers(skip, take) {
        const skipNum = skip ? Number(skip) : 0;
        const takeNum = take ? Number(take) : 20;
        return this.reunitePrayerService.getPublicPrayers(skipNum, takeNum);
    }
    async incrementPrayerCount(prayerId) {
        return this.reunitePrayerService.incrementPrayerCount(prayerId);
    }
};
exports.ReunitePrayerController = ReunitePrayerController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], ReunitePrayerController.prototype, "createPrayer", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReunitePrayerController.prototype, "getUserPrayers", null);
__decorate([
    (0, common_1.Get)('public'),
    __param(0, (0, common_1.Query)('skip')),
    __param(1, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReunitePrayerController.prototype, "getPublicPrayers", null);
__decorate([
    (0, common_1.Post)('increment/:prayerId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('prayerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReunitePrayerController.prototype, "incrementPrayerCount", null);
exports.ReunitePrayerController = ReunitePrayerController = __decorate([
    (0, common_1.Controller)('reunite-prayer'),
    __metadata("design:paramtypes", [typeof (_a = typeof reunite_prayer_service_1.ReunitePrayerService !== "undefined" && reunite_prayer_service_1.ReunitePrayerService) === "function" ? _a : Object])
], ReunitePrayerController);


/***/ }),
/* 36 */
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
exports.ReunitePrayerService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(6);
let ReunitePrayerService = class ReunitePrayerService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPrayer(userId, data) {
        return this.prisma.reunitePrayer.create({
            data: {
                userId,
                content: data.content,
                targetName: data.targetName,
                image: data.image,
                isAnonymous: data.isAnonymous ?? false,
            },
            include: {
                user: true,
            },
        });
    }
    async getUserPrayers(userId) {
        return this.prisma.reunitePrayer.findMany({
            where: { userId },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async getPublicPrayers(skip = 0, take = 20) {
        return this.prisma.reunitePrayer.findMany({
            skip,
            take,
            include: {
                user: {
                    select: {
                        id: true,
                        nickname: true,
                        anonymousNickname: true,
                        avatar: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async incrementPrayerCount(prayerId) {
        return this.prisma.reunitePrayer.update({
            where: { id: prayerId },
            data: {
                prayerCount: {
                    increment: 1,
                },
            },
        });
    }
};
exports.ReunitePrayerService = ReunitePrayerService;
exports.ReunitePrayerService = ReunitePrayerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ReunitePrayerService);


/***/ }),
/* 37 */
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
const confession_service_1 = __webpack_require__(38);
const confession_controller_1 = __webpack_require__(39);
const prisma_module_1 = __webpack_require__(5);
const auth_module_1 = __webpack_require__(11);
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
/* 38 */
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
/* 39 */
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
const confession_service_1 = __webpack_require__(38);
const jwt_auth_guard_1 = __webpack_require__(17);
const express_1 = __webpack_require__(30);
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
/* 40 */
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
const treehole_service_1 = __webpack_require__(41);
const treehole_controller_1 = __webpack_require__(42);
const prisma_module_1 = __webpack_require__(5);
const auth_module_1 = __webpack_require__(11);
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
/* 41 */
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
                        anonymousNickname: true,
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
/* 42 */
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
const treehole_service_1 = __webpack_require__(41);
const jwt_auth_guard_1 = __webpack_require__(17);
const express_1 = __webpack_require__(30);
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
/* 43 */
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
const dating_service_1 = __webpack_require__(44);
const dating_controller_1 = __webpack_require__(45);
const prisma_module_1 = __webpack_require__(5);
const auth_module_1 = __webpack_require__(11);
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
/* 44 */
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
    async findTopMatches(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error('用户不存在');
        }
        if (!user.gender) {
            throw new Error('请先设置性别信息');
        }
        const oppositeGender = user.gender === 'male' ? 'female' : 'male';
        const allUsers = await this.prisma.user.findMany({
            where: {
                id: { not: userId },
                gender: oppositeGender,
            },
            select: {
                id: true,
                nickname: true,
                avatar: true,
                zodiacSign: true,
                fiveElements: true,
                gender: true,
                bio: true,
            },
        });
        if (allUsers.length <= 3) {
            const matches = allUsers.map((potentialMatch) => {
                const score = this.calculateMatchScore(user, potentialMatch);
                return {
                    user: potentialMatch,
                    score,
                };
            });
            matches.sort((a, b) => b.score - a.score);
            return matches;
        }
        const sampleSize = Math.min(100, allUsers.length);
        const sampledUsers = this.shuffleArray(allUsers).slice(0, sampleSize);
        const matches = sampledUsers.map((potentialMatch) => {
            const score = this.calculateMatchScore(user, potentialMatch);
            return {
                user: potentialMatch,
                score,
            };
        });
        matches.sort((a, b) => b.score - a.score);
        return matches.slice(0, 3);
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
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
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
    async getUnreadCounts(userId) {
        const unreadMessages = await this.prisma.message.findMany({
            where: {
                receiverId: userId,
                isRead: false,
            },
            include: {
                sender: {
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
        const counts = {};
        unreadMessages.forEach((msg) => {
            const senderId = msg.senderId;
            if (!counts[senderId]) {
                counts[senderId] = {
                    count: 0,
                    sender: msg.sender,
                    lastMessage: msg,
                };
            }
            counts[senderId].count++;
            if (msg.createdAt > counts[senderId].lastMessage.createdAt) {
                counts[senderId].lastMessage = msg;
            }
        });
        return Object.entries(counts).map(([senderId, data]) => ({
            senderId,
            count: data.count,
            sender: data.sender,
            lastMessage: data.lastMessage,
        }));
    }
    async markAllAsRead(userId, otherUserId) {
        return this.prisma.message.updateMany({
            where: {
                receiverId: userId,
                senderId: otherUserId,
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });
    }
    async getTotalUnreadCount(userId) {
        const count = await this.prisma.message.count({
            where: {
                receiverId: userId,
                isRead: false,
            },
        });
        return { total: count };
    }
    async getChatContacts(userId) {
        const messages = await this.prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId },
                ],
            },
            select: {
                senderId: true,
                receiverId: true,
            },
        });
        const contactIds = new Set();
        messages.forEach((msg) => {
            if (msg.senderId !== userId)
                contactIds.add(msg.senderId);
            if (msg.receiverId !== userId)
                contactIds.add(msg.receiverId);
        });
        const contacts = await this.prisma.user.findMany({
            where: {
                id: { in: Array.from(contactIds) },
            },
            select: {
                id: true,
                nickname: true,
                avatar: true,
                zodiacSign: true,
                gender: true,
                bio: true,
            },
        });
        const contactsWithLastMessage = await Promise.all(contacts.map(async (contact) => {
            const lastMessage = await this.prisma.message.findFirst({
                where: {
                    OR: [
                        { senderId: userId, receiverId: contact.id },
                        { senderId: contact.id, receiverId: userId },
                    ],
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            const unreadCount = await this.prisma.message.count({
                where: {
                    senderId: contact.id,
                    receiverId: userId,
                    isRead: false,
                },
            });
            return {
                user: contact,
                lastMessage,
                unreadCount,
            };
        }));
        contactsWithLastMessage.sort((a, b) => {
            const aTime = a.lastMessage?.createdAt?.getTime() || 0;
            const bTime = b.lastMessage?.createdAt?.getTime() || 0;
            return bTime - aTime;
        });
        return contactsWithLastMessage;
    }
    async searchUsers(userId, keyword) {
        if (!keyword || keyword.trim().length === 0) {
            return [];
        }
        const trimmedKeyword = keyword.trim();
        const users = await this.prisma.user.findMany({
            where: {
                id: { not: userId },
                OR: [
                    { nickname: { contains: trimmedKeyword } },
                    { phone: { contains: trimmedKeyword } },
                ],
            },
            select: {
                id: true,
                nickname: true,
                avatar: true,
                zodiacSign: true,
                gender: true,
                bio: true,
                phone: true,
            },
            take: 20,
        });
        return users;
    }
};
exports.DatingService = DatingService;
exports.DatingService = DatingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], DatingService);


/***/ }),
/* 45 */
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
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatingController = void 0;
const common_1 = __webpack_require__(2);
const dating_service_1 = __webpack_require__(44);
const jwt_auth_guard_1 = __webpack_require__(17);
const express_1 = __webpack_require__(30);
let DatingController = class DatingController {
    constructor(datingService) {
        this.datingService = datingService;
    }
    async findTopMatches(req) {
        const userId = req.user.sub;
        return this.datingService.findTopMatches(userId);
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
    async getUnreadCounts(req) {
        const userId = req.user.sub;
        return this.datingService.getUnreadCounts(userId);
    }
    async getTotalUnreadCount(req) {
        const userId = req.user.sub;
        return this.datingService.getTotalUnreadCount(userId);
    }
    async markAllAsRead(otherUserId, req) {
        const userId = req.user.sub;
        return this.datingService.markAllAsRead(userId, otherUserId);
    }
    async getChatContacts(req) {
        const userId = req.user.sub;
        return this.datingService.getChatContacts(userId);
    }
    async searchUsers(req) {
        const userId = req.user.sub;
        const keyword = req.query.keyword || '';
        return this.datingService.searchUsers(userId, keyword);
    }
};
exports.DatingController = DatingController;
__decorate([
    (0, common_1.Post)('top-matches'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], DatingController.prototype, "findTopMatches", null);
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
    __metadata("design:paramtypes", [Object, typeof (_c = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _c : Object]),
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
__decorate([
    (0, common_1.Get)('unread'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], DatingController.prototype, "getUnreadCounts", null);
__decorate([
    (0, common_1.Get)('unread/total'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], DatingController.prototype, "getTotalUnreadCount", null);
__decorate([
    (0, common_1.Post)('read-all/:otherUserId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('otherUserId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_f = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], DatingController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Get)('contacts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _g : Object]),
    __metadata("design:returntype", Promise)
], DatingController.prototype, "getChatContacts", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], DatingController.prototype, "searchUsers", null);
exports.DatingController = DatingController = __decorate([
    (0, common_1.Controller)('dating'),
    __metadata("design:paramtypes", [typeof (_a = typeof dating_service_1.DatingService !== "undefined" && dating_service_1.DatingService) === "function" ? _a : Object])
], DatingController);


/***/ }),
/* 46 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PalmModule = void 0;
const common_1 = __webpack_require__(2);
const palm_controller_1 = __webpack_require__(47);
const palm_service_1 = __webpack_require__(49);
const config_1 = __webpack_require__(4);
let PalmModule = class PalmModule {
};
exports.PalmModule = PalmModule;
exports.PalmModule = PalmModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        controllers: [palm_controller_1.PalmController],
        providers: [palm_service_1.PalmService],
        exports: [palm_service_1.PalmService],
    })
], PalmModule);


/***/ }),
/* 47 */
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
exports.PalmController = void 0;
const common_1 = __webpack_require__(2);
const platform_express_1 = __webpack_require__(48);
const palm_service_1 = __webpack_require__(49);
const jwt_auth_guard_1 = __webpack_require__(17);
const common_2 = __webpack_require__(2);
let PalmController = class PalmController {
    constructor(palmService) {
        this.palmService = palmService;
    }
    async analyzePalm(req, file) {
        if (!file) {
            throw new common_1.BadRequestException('请上传手相照片');
        }
        const userId = req.user.sub;
        return await this.palmService.analyzePalm(file, userId);
    }
    async getHistory(req) {
        const userId = req.user.sub;
        return await this.palmService.getHistory(userId);
    }
    async deleteReading(req, id) {
        const userId = req.user.sub;
        return await this.palmService.deleteReading(id, userId);
    }
};
exports.PalmController = PalmController;
__decorate([
    (0, common_1.Post)('analyze'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_2.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof Express !== "undefined" && (_b = Express.Multer) !== void 0 && _b.File) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], PalmController.prototype, "analyzePalm", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PalmController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Delete)('history/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PalmController.prototype, "deleteReading", null);
exports.PalmController = PalmController = __decorate([
    (0, common_1.Controller)('palm'),
    __metadata("design:paramtypes", [typeof (_a = typeof palm_service_1.PalmService !== "undefined" && palm_service_1.PalmService) === "function" ? _a : Object])
], PalmController);


/***/ }),
/* 48 */
/***/ ((module) => {

module.exports = require("@nestjs/platform-express");

/***/ }),
/* 49 */
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PalmService = void 0;
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(4);
const prisma_service_1 = __webpack_require__(6);
const minio_service_1 = __webpack_require__(9);
let PalmService = class PalmService {
    constructor(configService, prisma, minioService) {
        this.configService = configService;
        this.prisma = prisma;
        this.minioService = minioService;
        this.apiKey = this.configService.get('DASHSCOPE_API_KEY');
        this.baseUrl = this.configService.get('DASHSCOPE_BASE_URL');
        this.model = this.configService.get('DASHSCOPE_MODEL');
    }
    async analyzePalm(file, userId) {
        const base64Image = file.buffer.toString('base64');
        const mimeType = file.mimetype || 'image/jpeg';
        const prompt = `图片是用户拍的照片，请基于照片分析用户的手相，如果不是手掌的照片，直接回复，照片不合格请重新拍摄。
正常手掌照片，要求从生命线，智慧线，感情线，事业线，综合运势,这5个方面进行分析，每一个方面都需要覆盖到。
结果要求按照以下格式要求返回。

例子1：
{
    "success": true,
    "data": {
        "lifeLine": "生命线深长，身体健康，精力充沛，有较强的生活适应能力。",
        "wisdomLine": "智慧线清晰，思维敏捷，善于分析问题，具有很好的学习能力和创造力。",
        "loveLine": "感情线平直，感情专一，对待感情认真负责，适合稳定长久的关系。",
        "careerLine": "事业线明显向上，事业心强，适合创业或从事管理工作，有望在事业上取得成就。",
        "overall": "整体手相格局均衡，显示出你是一个务实、有条理且富有责任感的人。只要保持专注与坚持，事业与生活都能稳步向前。感情方面虽不热烈但稳定，适合细水长流的缘分。近期运势平稳，宜稳中求进，不宜冒进。"
    }
}

例子2：
{
    "success": true,
    "data": {
        "lifeLine": "生命线深长且流畅，显示身体健康状况良好，精力旺盛，具有较强的抗压能力和生活适应力，能较好应对各种挑战。",
        "wisdomLine": "智慧线清晰平直，延伸至无名指下方，表明思维逻辑性强，学习能力突出，善于理性分析与解决问题，适合从事需要思考与规划的工作。",
        "loveLine": "感情线较长且微微上扬，末端分叉，代表情感丰富、细腻，对感情投入认真，容易动情但也可能因情绪波动影响关系，建议在感情中保持沟通与平衡。",
        "careerLine": "事业线从手掌中部清晰向上延伸，略带分叉，说明事业心强，有明确目标和进取精神，适合独立发展或管理岗位，中年后事业有望稳步上升。",
        "overall": "整体手相格局均衡有力，预示你具备良好的发展潜力与执行力。只要保持专注与耐心，事业与生活都将稳步前进。近期人际运佳，易得贵人相助，感情方面需多加用心经营，避免因忙碌忽略伴侣感受。"
    }
}`;
        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'user',
                            content: [
                                {
                                    type: 'image_url',
                                    image_url: {
                                        url: `data:${mimeType};base64,${base64Image}`,
                                    },
                                },
                                {
                                    type: 'text',
                                    text: prompt,
                                },
                            ],
                        },
                    ],
                }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API 请求失败: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            const content = data.choices?.[0]?.message?.content || '分析失败，请重试';
            if (content.includes('照片不合格请重新拍摄')) {
                throw new common_1.BadRequestException('照片不合格请重新拍摄');
            }
            const result = this.parsePalmReading(content);
            let imageUrl;
            if (this.minioService.isMinioEnabled()) {
                const fileName = `${userId}-${Date.now()}.${file.originalname.split('.').pop() || 'jpg'}`;
                imageUrl = await this.minioService.uploadFile(file.buffer, fileName, mimeType);
            }
            else {
                console.warn('MinIO 未启用，使用 base64 存储图片（仅用于演示）');
                const base64Data = file.buffer.toString('base64');
                imageUrl = `data:${mimeType};base64,${base64Data}`;
            }
            await this.prisma.palmReading.create({
                data: {
                    userId,
                    imageUrl,
                    lifeLine: result.lifeLine || '',
                    wisdomLine: result.wisdomLine || '',
                    loveLine: result.loveLine || '',
                    careerLine: result.careerLine || '',
                    overall: result.overall || '',
                },
            });
            return result;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            console.error('手相分析错误:', error);
            throw new common_1.BadRequestException('手相分析失败，请稍后重试');
        }
    }
    async getHistory(userId) {
        return this.prisma.palmReading.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async deleteReading(readingId, userId) {
        const reading = await this.prisma.palmReading.findUnique({
            where: { id: readingId },
        });
        if (!reading) {
            throw new common_1.BadRequestException('记录不存在');
        }
        if (reading.userId !== userId) {
            throw new common_1.BadRequestException('无权删除此记录');
        }
        if (this.minioService.isMinioEnabled() && !reading.imageUrl.startsWith('data:')) {
            try {
                const objectName = this.minioService.extractObjectNameFromUrl(reading.imageUrl);
                if (objectName) {
                    await this.minioService.deleteFile(objectName);
                }
            }
            catch (error) {
                console.error('删除 MinIO 文件失败:', error);
            }
        }
        await this.prisma.palmReading.delete({
            where: { id: readingId },
        });
        return { success: true };
    }
    parsePalmReading(content) {
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                if (parsed.success && parsed.data) {
                    return parsed.data;
                }
                if (parsed.lifeLine || parsed.wisdomLine || parsed.loveLine || parsed.careerLine || parsed.overall) {
                    return {
                        lifeLine: parsed.lifeLine || '',
                        wisdomLine: parsed.wisdomLine || '',
                        loveLine: parsed.loveLine || '',
                        careerLine: parsed.careerLine || '',
                        overall: parsed.overall || ''
                    };
                }
            }
            return this.parseTextPalmReading(content);
        }
        catch (error) {
            console.error('JSON 解析失败，尝试文本解析:', error);
            return this.parseTextPalmReading(content);
        }
    }
    parseTextPalmReading(content) {
        const result = {
            lifeLine: '',
            wisdomLine: '',
            loveLine: '',
            careerLine: '',
            overall: ''
        };
        const lines = content.split('\n').map(line => line.trim()).filter(line => line);
        let currentSection = '';
        let currentContent = [];
        for (const line of lines) {
            if (line === '生命线' || line.includes('生命线')) {
                if (currentSection && currentContent.length > 0) {
                    result[currentSection] = currentContent.join('');
                }
                currentSection = 'lifeLine';
                currentContent = [];
            }
            else if (line === '智慧线' || line.includes('智慧线')) {
                if (currentSection && currentContent.length > 0) {
                    result[currentSection] = currentContent.join('');
                }
                currentSection = 'wisdomLine';
                currentContent = [];
            }
            else if (line === '感情线' || line.includes('感情线')) {
                if (currentSection && currentContent.length > 0) {
                    result[currentSection] = currentContent.join('');
                }
                currentSection = 'loveLine';
                currentContent = [];
            }
            else if (line === '事业线' || line.includes('事业线')) {
                if (currentSection && currentContent.length > 0) {
                    result[currentSection] = currentContent.join('');
                }
                currentSection = 'careerLine';
                currentContent = [];
            }
            else if (line === '综合运势' || line.includes('综合运势')) {
                if (currentSection && currentContent.length > 0) {
                    result[currentSection] = currentContent.join('');
                }
                currentSection = 'overall';
                currentContent = [];
            }
            else if (line && !line.includes('手相分析结果')) {
                currentContent.push(line);
            }
        }
        if (currentSection && currentContent.length > 0) {
            result[currentSection] = currentContent.join('');
        }
        if (!result.lifeLine && !result.wisdomLine && !result.loveLine && !result.careerLine && !result.overall) {
            result.overall = content;
        }
        return result;
    }
};
exports.PalmService = PalmService;
exports.PalmService = PalmService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, typeof (_b = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _b : Object, typeof (_c = typeof minio_service_1.MinioService !== "undefined" && minio_service_1.MinioService) === "function" ? _c : Object])
], PalmService);


/***/ }),
/* 50 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FaceModule = void 0;
const common_1 = __webpack_require__(2);
const platform_express_1 = __webpack_require__(48);
const face_controller_1 = __webpack_require__(51);
const face_service_1 = __webpack_require__(52);
const config_1 = __webpack_require__(4);
let FaceModule = class FaceModule {
};
exports.FaceModule = FaceModule;
exports.FaceModule = FaceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            platform_express_1.MulterModule.register({
                limits: {
                    fileSize: 5 * 1024 * 1024,
                },
            }),
        ],
        controllers: [face_controller_1.FaceController],
        providers: [face_service_1.FaceService],
        exports: [face_service_1.FaceService],
    })
], FaceModule);


/***/ }),
/* 51 */
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
exports.FaceController = void 0;
const common_1 = __webpack_require__(2);
const platform_express_1 = __webpack_require__(48);
const face_service_1 = __webpack_require__(52);
const jwt_auth_guard_1 = __webpack_require__(17);
const common_2 = __webpack_require__(2);
let FaceController = class FaceController {
    constructor(faceService) {
        this.faceService = faceService;
    }
    async analyzeFace(req, file) {
        if (!file) {
            throw new common_1.BadRequestException('请上传面部照片');
        }
        const userId = req.user.sub;
        return await this.faceService.analyzeFace(file, userId);
    }
    async getHistory(req) {
        const userId = req.user.sub;
        return await this.faceService.getHistory(userId);
    }
    async deleteReading(req, id) {
        const userId = req.user.sub;
        return await this.faceService.deleteReading(id, userId);
    }
};
exports.FaceController = FaceController;
__decorate([
    (0, common_1.Post)('analyze'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_2.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof Express !== "undefined" && (_b = Express.Multer) !== void 0 && _b.File) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], FaceController.prototype, "analyzeFace", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FaceController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Delete)('history/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FaceController.prototype, "deleteReading", null);
exports.FaceController = FaceController = __decorate([
    (0, common_1.Controller)('face'),
    __metadata("design:paramtypes", [typeof (_a = typeof face_service_1.FaceService !== "undefined" && face_service_1.FaceService) === "function" ? _a : Object])
], FaceController);


/***/ }),
/* 52 */
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FaceService = void 0;
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(4);
const prisma_service_1 = __webpack_require__(6);
const minio_service_1 = __webpack_require__(9);
let FaceService = class FaceService {
    constructor(configService, prisma, minioService) {
        this.configService = configService;
        this.prisma = prisma;
        this.minioService = minioService;
        this.apiKey = this.configService.get('DASHSCOPE_API_KEY');
        this.baseUrl = this.configService.get('DASHSCOPE_BASE_URL');
        this.model = this.configService.get('DASHSCOPE_MODEL');
    }
    async analyzeFace(file, userId) {
        const base64Image = file.buffer.toString('base64');
        const mimeType = file.mimetype || 'image/jpeg';
        const prompt = `图片是用户拍的面部照片，请基于照片分析用户的面相，如果不是清晰的正面面部照片，直接回复，照片不合格请重新拍摄。
正常面部照片，要求从额头，眼睛，鼻子，嘴巴，综合运势，这5个方面进行分析，每一个方面都需要覆盖到。
结果要求按照以下格式要求返回。

例子1：
{
    "success": true,
    "data": {
        "forehead": "额头宽阔饱满，天庭饱满，智慧出众，早年运势较好，有良好的学习能力和思考能力。",
        "eyes": "眼睛明亮有神，眼神清澈，表明此人聪明机敏，观察力强，具有较好的洞察力和判断力。",
        "nose": "鼻梁挺直，鼻翼适中，鼻头圆润，说明此人意志坚定，做事有原则，财运较好，善于理财。",
        "mouth": "嘴唇厚薄适中，嘴角微微上扬，说明此人性格温和，善于表达，人际关系良好，有较好的福气。",
        "overall": "整体面相格局和谐，五官端正，显示出你是一个聪明、有福气且性格温和的人。早年运势较好，适合在学业或事业上稳步发展。中年财运亨通，需注意理财规划。晚年生活安逸，家庭和睦。近期运势平稳上升，宜积极进取，抓住机遇。"
    }
}

例子2：
{
    "success": true,
    "data": {
        "forehead": "额头高耸饱满，发际线整齐，天庭饱满之相，预示早年运势亨通，智慧超群，在学业和事业上都有较好的发展潜力。",
        "eyes": "眼睛稍大，双眼皮，眼神坚定而温和，显示出既有决断力又具同情心的性格，在人际交往中容易获得他人的信任与支持。",
        "nose": "鼻梁高挺，鼻头微圆，鼻翼收束，这是典型的财帛宫旺盛之相，说明财运较佳，善于理财，中年以后财富积累可观。",
        "mouth": "嘴唇轮廓清晰，嘴角自然上扬，牙齿整齐，说明口才良好，待人真诚，在社交场合容易获得好人缘，事业上有贵人相助。",
        "overall": "整体面相格局优秀，五官搭配和谐，预示你具备成功人士的基本特征。早年聪慧好学，事业起点较高；中年财运亨通，宜把握机会扩大财富；晚年安康顺遂，家庭幸福。整体运势呈上升趋势，宜保持积极心态，继续努力。"
    }
}`;
        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'user',
                            content: [
                                {
                                    type: 'image_url',
                                    image_url: {
                                        url: `data:${mimeType};base64,${base64Image}`,
                                    },
                                },
                                {
                                    type: 'text',
                                    text: prompt,
                                },
                            ],
                        },
                    ],
                }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API 请求失败: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            const content = data.choices?.[0]?.message?.content || '分析失败，请重试';
            if (content.includes('照片不合格请重新拍摄')) {
                throw new common_1.BadRequestException('照片不合格请重新拍摄');
            }
            const result = this.parseFaceReading(content);
            let imageUrl;
            if (this.minioService.isMinioEnabled()) {
                const fileName = `${userId}-${Date.now()}.${file.originalname.split('.').pop() || 'jpg'}`;
                imageUrl = await this.minioService.uploadFile(file.buffer, fileName, mimeType);
            }
            else {
                console.warn('MinIO 未启用，使用 base64 存储图片（仅用于演示）');
                const base64Data = file.buffer.toString('base64');
                imageUrl = `data:${mimeType};base64,${base64Data}`;
            }
            await this.prisma.faceReading.create({
                data: {
                    userId,
                    imageUrl,
                    forehead: result.forehead || '',
                    eyes: result.eyes || '',
                    nose: result.nose || '',
                    mouth: result.mouth || '',
                    overall: result.overall || '',
                },
            });
            return result;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            console.error('面相分析错误:', error);
            throw new common_1.BadRequestException('面相分析失败，请稍后重试');
        }
    }
    async getHistory(userId) {
        return this.prisma.faceReading.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async deleteReading(readingId, userId) {
        const reading = await this.prisma.faceReading.findUnique({
            where: { id: readingId },
        });
        if (!reading) {
            throw new common_1.BadRequestException('记录不存在');
        }
        if (reading.userId !== userId) {
            throw new common_1.BadRequestException('无权删除此记录');
        }
        if (this.minioService.isMinioEnabled() && !reading.imageUrl.startsWith('data:')) {
            try {
                const objectName = this.minioService.extractObjectNameFromUrl(reading.imageUrl);
                if (objectName) {
                    await this.minioService.deleteFile(objectName);
                }
            }
            catch (error) {
                console.error('删除 MinIO 文件失败:', error);
            }
        }
        await this.prisma.faceReading.delete({
            where: { id: readingId },
        });
        return { success: true };
    }
    parseFaceReading(content) {
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                if (parsed.success && parsed.data) {
                    return parsed.data;
                }
                if (parsed.forehead || parsed.eyes || parsed.nose || parsed.mouth || parsed.overall) {
                    return {
                        forehead: parsed.forehead || '',
                        eyes: parsed.eyes || '',
                        nose: parsed.nose || '',
                        mouth: parsed.mouth || '',
                        overall: parsed.overall || ''
                    };
                }
            }
            return this.parseTextFaceReading(content);
        }
        catch (error) {
            console.error('JSON 解析失败，尝试文本解析:', error);
            return this.parseTextFaceReading(content);
        }
    }
    parseTextFaceReading(content) {
        const result = {
            forehead: '',
            eyes: '',
            nose: '',
            mouth: '',
            overall: ''
        };
        const lines = content.split('\n').map(line => line.trim()).filter(line => line);
        let currentSection = '';
        let currentContent = [];
        for (const line of lines) {
            if (line === '额头' || line.includes('额头')) {
                if (currentSection && currentContent.length > 0) {
                    result[currentSection] = currentContent.join('');
                }
                currentSection = 'forehead';
                currentContent = [];
            }
            else if (line === '眼睛' || line.includes('眼睛')) {
                if (currentSection && currentContent.length > 0) {
                    result[currentSection] = currentContent.join('');
                }
                currentSection = 'eyes';
                currentContent = [];
            }
            else if (line === '鼻子' || line.includes('鼻子')) {
                if (currentSection && currentContent.length > 0) {
                    result[currentSection] = currentContent.join('');
                }
                currentSection = 'nose';
                currentContent = [];
            }
            else if (line === '嘴巴' || line.includes('嘴巴')) {
                if (currentSection && currentContent.length > 0) {
                    result[currentSection] = currentContent.join('');
                }
                currentSection = 'mouth';
                currentContent = [];
            }
            else if (line === '综合运势' || line.includes('综合运势')) {
                if (currentSection && currentContent.length > 0) {
                    result[currentSection] = currentContent.join('');
                }
                currentSection = 'overall';
                currentContent = [];
            }
            else if (line && !line.includes('面相分析结果')) {
                currentContent.push(line);
            }
        }
        if (currentSection && currentContent.length > 0) {
            result[currentSection] = currentContent.join('');
        }
        if (!result.forehead && !result.eyes && !result.nose && !result.mouth && !result.overall) {
            result.overall = content;
        }
        return result;
    }
};
exports.FaceService = FaceService;
exports.FaceService = FaceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, typeof (_b = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _b : Object, typeof (_c = typeof minio_service_1.MinioService !== "undefined" && minio_service_1.MinioService) === "function" ? _c : Object])
], FaceService);


/***/ }),
/* 53 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AvatarModule = void 0;
const common_1 = __webpack_require__(2);
const platform_express_1 = __webpack_require__(48);
const avatar_controller_1 = __webpack_require__(54);
const avatar_service_1 = __webpack_require__(55);
const prisma_service_1 = __webpack_require__(6);
const minio_module_1 = __webpack_require__(8);
const config_1 = __webpack_require__(4);
let AvatarModule = class AvatarModule {
};
exports.AvatarModule = AvatarModule;
exports.AvatarModule = AvatarModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            minio_module_1.MinioModule,
            platform_express_1.MulterModule.register({
                limits: {
                    fileSize: 5 * 1024 * 1024,
                },
            }),
        ],
        controllers: [avatar_controller_1.AvatarController],
        providers: [avatar_service_1.AvatarService, prisma_service_1.PrismaService],
        exports: [avatar_service_1.AvatarService],
    })
], AvatarModule);


/***/ }),
/* 54 */
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
exports.AvatarController = void 0;
const common_1 = __webpack_require__(2);
const platform_express_1 = __webpack_require__(48);
const avatar_service_1 = __webpack_require__(55);
const jwt_auth_guard_1 = __webpack_require__(17);
let AvatarController = class AvatarController {
    constructor(avatarService) {
        this.avatarService = avatarService;
    }
    async uploadAvatar(req, file) {
        if (!file) {
            throw new common_1.BadRequestException('请选择要上传的头像文件');
        }
        return this.avatarService.uploadAvatar(req.user.sub, file);
    }
    async generateAvatar(req) {
        return this.avatarService.generateAvatar(req.user.sub);
    }
    async getAvatarInfo(req) {
        return this.avatarService.getAvatarInfo(req.user.sub);
    }
};
exports.AvatarController = AvatarController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof Express !== "undefined" && (_b = Express.Multer) !== void 0 && _b.File) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], AvatarController.prototype, "uploadAvatar", null);
__decorate([
    (0, common_1.Post)('generate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AvatarController.prototype, "generateAvatar", null);
__decorate([
    (0, common_1.Get)('info'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AvatarController.prototype, "getAvatarInfo", null);
exports.AvatarController = AvatarController = __decorate([
    (0, common_1.Controller)('avatar'),
    __metadata("design:paramtypes", [typeof (_a = typeof avatar_service_1.AvatarService !== "undefined" && avatar_service_1.AvatarService) === "function" ? _a : Object])
], AvatarController);


/***/ }),
/* 55 */
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AvatarService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(6);
const minio_service_1 = __webpack_require__(9);
const config_1 = __webpack_require__(4);
let AvatarService = class AvatarService {
    constructor(prisma, minio, configService) {
        this.prisma = prisma;
        this.minio = minio;
        this.configService = configService;
        this.dashscopeApiKey = this.configService.get('DASHSCOPE_API_KEY') || '';
        this.dashscopeBaseUrl = this.configService.get('DASHSCOPE_BASE_URL') || 'https://dashscope.aliyuncs.com/compatible-mode/v1';
    }
    async uploadAvatar(userId, file) {
        console.log('[AvatarService] Uploading avatar for user:', userId);
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('仅支持 JPG、PNG、WebP 格式的图片');
        }
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException('图片大小不能超过 5MB');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { avatar: true },
        });
        if (user?.avatar) {
            const objectName = this.minio.extractObjectNameFromUrl(user.avatar);
            if (objectName) {
                try {
                    await this.minio.deleteFile(objectName);
                }
                catch (error) {
                    console.warn('[AvatarService] Failed to delete old avatar:', error);
                }
            }
        }
        const fileName = `${userId}-${Date.now()}.${file.mimetype.split('/')[1]}`;
        const avatarUrl = await this.minio.uploadFile(file.buffer, fileName, file.mimetype, 'avatars');
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                avatar: avatarUrl,
                avatarType: 'upload',
                avatarUpdatedAt: new Date(),
            },
        });
        console.log('[AvatarService] Avatar uploaded successfully:', avatarUrl);
        return {
            avatar: avatarUrl,
            avatarType: 'upload',
            avatarUpdatedAt: new Date(),
        };
    }
    async generateAvatar(userId) {
        console.log('[AvatarService] Generating AI avatar for user:', userId);
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.BadRequestException('用户不存在');
        }
        const astrologyReading = await this.prisma.astrologyReading.findUnique({
            where: { userId },
        });
        const prompt = this.generatePrompt(user, astrologyReading);
        console.log('[AvatarService] Generated prompt:', prompt);
        console.log('[AvatarService] Prompt length:', prompt.length);
        try {
            console.log('[AvatarService] Step 1: Creating async task...');
            const createTaskResponse = await this.fetchWithTimeout('https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.dashscopeApiKey}`,
                    'X-DashScope-Async': 'enable',
                },
                body: JSON.stringify({
                    model: 'wanx-v1',
                    input: {
                        prompt: prompt,
                    },
                    parameters: {
                        size: '1024*1024',
                        n: 1,
                        style: '<photography>',
                    },
                }),
            }, 30000);
            if (!createTaskResponse.ok) {
                const errorText = await createTaskResponse.text();
                console.error('[AvatarService] Create task failed:', errorText);
                throw new common_1.BadRequestException(`AI生成失败: HTTP ${createTaskResponse.status}`);
            }
            const taskData = await createTaskResponse.json();
            const taskId = taskData?.output?.task_id;
            if (!taskId) {
                console.error('[AvatarService] Invalid task response:', JSON.stringify(taskData));
                throw new common_1.BadRequestException('AI生成失败，无法获取任务ID');
            }
            console.log('[AvatarService] Task created:', taskId);
            console.log('[AvatarService] Step 2: Polling task result...');
            let imageUrl = null;
            const maxAttempts = 30;
            const pollInterval = 2000;
            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                await new Promise(resolve => setTimeout(resolve, pollInterval));
                const queryResponse = await this.fetchWithTimeout(`https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.dashscopeApiKey}`,
                    },
                }, 10000);
                if (!queryResponse.ok) {
                    console.error('[AvatarService] Query task failed:', await queryResponse.text());
                    continue;
                }
                const queryData = await queryResponse.json();
                const taskStatus = queryData?.output?.task_status;
                console.log(`[AvatarService] Task status (attempt ${attempt + 1}):`, taskStatus);
                if (taskStatus === 'SUCCEEDED') {
                    imageUrl = queryData?.output?.results?.[0]?.url;
                    break;
                }
                else if (taskStatus === 'FAILED' || taskStatus === 'CANCELED') {
                    const code = queryData?.output?.code;
                    const message = queryData?.output?.message;
                    console.error('[AvatarService] Task failed:', { code, message });
                    throw new common_1.BadRequestException(`AI生成失败: ${message || '未知错误'}`);
                }
            }
            if (!imageUrl) {
                throw new common_1.BadRequestException('AI生成超时，请稍后重试');
            }
            console.log('[AvatarService] Image generated:', imageUrl);
            const imageResponse = await this.fetchWithTimeout(imageUrl, {
                method: 'GET',
            }, 30000);
            if (!imageResponse.ok) {
                throw new common_1.BadRequestException('图片下载失败');
            }
            const arrayBuffer = await imageResponse.arrayBuffer();
            const imageBuffer = Buffer.from(arrayBuffer);
            const fileName = `${userId}-ai-${Date.now()}.png`;
            if (user.avatar) {
                const objectName = this.minio.extractObjectNameFromUrl(user.avatar);
                if (objectName) {
                    try {
                        await this.minio.deleteFile(objectName);
                    }
                    catch (error) {
                        console.warn('[AvatarService] Failed to delete old avatar:', error);
                    }
                }
            }
            const avatarUrl = await this.minio.uploadFile(imageBuffer, fileName, 'image/png', 'avatars');
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    avatar: avatarUrl,
                    avatarType: 'ai_generated',
                    avatarUpdatedAt: new Date(),
                    lastAiAvatarDate: new Date(),
                },
            });
            console.log('[AvatarService] AI avatar generated successfully:', avatarUrl);
            return {
                avatar: avatarUrl,
                avatarType: 'ai_generated',
                avatarUpdatedAt: new Date(),
                lastAiAvatarDate: new Date(),
            };
        }
        catch (error) {
            console.error('[AvatarService] AI generation error:', error);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`AI生成失败: ${error.message || '未知错误'}`);
        }
    }
    async fetchWithTimeout(url, options = {}, timeout = 60000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            return response;
        }
        catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new common_1.BadRequestException('请求超时');
            }
            throw error;
        }
    }
    generatePrompt(user, astrology) {
        const genderText = user.gender === 'male' ? '男性' : user.gender === 'female' ? '女性' : '中性风格';
        const age = new Date().getFullYear() - user.birthYear;
        const prompt = `一个${age}岁左右的${genderText}人物头像，专业摄影风格，正面面容，表情自然友善，背景简洁干净，高质量摄影，光线柔和自然。`;
        return prompt;
    }
    async getAvatarInfo(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                avatar: true,
                avatarType: true,
                avatarUpdatedAt: true,
                lastAiAvatarDate: true,
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('用户不存在');
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let canUseAiToday = true;
        if (user.lastAiAvatarDate) {
            const lastDate = new Date(user.lastAiAvatarDate);
            lastDate.setHours(0, 0, 0, 0);
            canUseAiToday = lastDate.getTime() !== today.getTime();
        }
        return {
            avatar: user.avatar,
            avatarType: user.avatarType,
            avatarUpdatedAt: user.avatarUpdatedAt,
            lastAiAvatarDate: user.lastAiAvatarDate,
            canUseAiToday,
        };
    }
};
exports.AvatarService = AvatarService;
exports.AvatarService = AvatarService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof minio_service_1.MinioService !== "undefined" && minio_service_1.MinioService) === "function" ? _b : Object, typeof (_c = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _c : Object])
], AvatarService);


/***/ }),
/* 56 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MbtiModule = void 0;
const common_1 = __webpack_require__(2);
const mbti_controller_1 = __webpack_require__(57);
const mbti_service_1 = __webpack_require__(58);
const prisma_module_1 = __webpack_require__(5);
let MbtiModule = class MbtiModule {
};
exports.MbtiModule = MbtiModule;
exports.MbtiModule = MbtiModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [mbti_controller_1.MbtiController],
        providers: [mbti_service_1.MbtiService],
        exports: [mbti_service_1.MbtiService],
    })
], MbtiModule);


/***/ }),
/* 57 */
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
exports.MbtiController = void 0;
const common_1 = __webpack_require__(2);
const mbti_service_1 = __webpack_require__(58);
const jwt_auth_guard_1 = __webpack_require__(17);
const express_1 = __webpack_require__(30);
let MbtiController = class MbtiController {
    constructor(mbtiService) {
        this.mbtiService = mbtiService;
    }
    getQuestions() {
        return this.mbtiService.getQuestions();
    }
    async submitResult(req, body) {
        const userId = req.user.sub;
        const { type, scores } = this.mbtiService.calculateMbti(body.answers);
        const result = await this.mbtiService.saveResult(userId, {
            answers: body.answers,
            mbtiType: type,
            eScore: scores.E,
            iScore: scores.I,
            sScore: scores.S,
            nScore: scores.N,
            tScore: scores.T,
            fScore: scores.F,
            jScore: scores.J,
            pScore: scores.P,
        });
        return {
            ...result,
            description: this.mbtiService.getTypeDescription(type),
        };
    }
    async getUserResult(req) {
        const userId = req.user.sub;
        const result = await this.mbtiService.getUserResult(userId);
        return result;
    }
    getAllTypes() {
        return this.mbtiService.getAllTypes();
    }
};
exports.MbtiController = MbtiController;
__decorate([
    (0, common_1.Get)('questions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MbtiController.prototype, "getQuestions", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('submit'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", Promise)
], MbtiController.prototype, "submitResult", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('result'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], MbtiController.prototype, "getUserResult", null);
__decorate([
    (0, common_1.Get)('types'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MbtiController.prototype, "getAllTypes", null);
exports.MbtiController = MbtiController = __decorate([
    (0, common_1.Controller)('mbti'),
    __metadata("design:paramtypes", [typeof (_a = typeof mbti_service_1.MbtiService !== "undefined" && mbti_service_1.MbtiService) === "function" ? _a : Object])
], MbtiController);


/***/ }),
/* 58 */
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MbtiService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(6);
const fs = __importStar(__webpack_require__(59));
const path = __importStar(__webpack_require__(60));
let MbtiService = class MbtiService {
    constructor(prisma) {
        this.prisma = prisma;
        this.questions = [];
        this.typeDescriptions = {
            'INTJ': {
                type: 'INTJ',
                name: '建筑师',
                description: '富有想象力和战略性的思想家，一切皆在计划之中。',
                traits: ['独立自主', '追求完美', '善于分析', '意志坚定'],
                career: ['科学家', '系统分析师', '战略规划', '软件架构师'],
                relationship: '在关系中追求深度和真诚，需要智力上的共鸣。'
            },
            'INTP': {
                type: 'INTP',
                name: '逻辑学家',
                description: '具有创新性的发明家，对知识有着止不住的渴望。',
                traits: ['逻辑性强', '好奇心重', '独立思考', '灵活适应'],
                career: ['研究员', '程序员', '数学家', '哲学家'],
                relationship: '需要个人空间，重视智力交流和理解。'
            },
            'ENTJ': {
                type: 'ENTJ',
                name: '指挥官',
                description: '大胆、富有想象力且意志强大的领导者。',
                traits: ['天然领导', '目标导向', '果断决策', '组织能力强'],
                career: ['CEO', '管理者', '律师', '顾问'],
                relationship: '在关系中寻求成长和进步，欣赏有能力的人。'
            },
            'ENTP': {
                type: 'ENTP',
                name: '辩论家',
                description: '聪明好奇的思想者，无法抗拒智力上的挑战。',
                traits: ['机智敏捷', '喜欢辩论', '创新思维', '善于沟通'],
                career: ['企业家', '创意总监', '咨询师', '记者'],
                relationship: '需要刺激和新鲜感，重视精神层面的交流。'
            },
            'INFJ': {
                type: 'INFJ',
                name: '提倡者',
                description: '安静而神秘，鼓舞人心且不知疲倦的理想主义者。',
                traits: ['洞察力强', '富有同情心', '理想主义', '深度思考'],
                career: ['咨询师', '心理学家', '作家', '非营利组织'],
                relationship: '寻求深层情感连接，重视真诚和默契。'
            },
            'INFP': {
                type: 'INFP',
                name: '调停者',
                description: '诗意，善良的利他主义者，总是热情地为正义事业提供帮助。',
                traits: ['价值观驱动', '富有想象力', '忠诚可靠', '追求和谐'],
                career: ['艺术家', '作家', '咨询师', '教育工作者'],
                relationship: '在关系中追求真实和意义，需要情感上的理解。'
            },
            'ENFJ': {
                type: 'ENFJ',
                name: '主人公',
                description: '有魅力鼓舞人心的领袖，有着令听众着迷的能力。',
                traits: ['富有魅力', '乐于助人', '天生的领导者', '善于表达'],
                career: ['教师', '人力资源', '政治家', '培训师'],
                relationship: '关注伴侣的需求，善于营造温暖和谐的关系。'
            },
            'ENFP': {
                type: 'ENFP',
                name: '竞选者',
                description: '热情，有创造力爱社交的自由人，总能找到理由微笑。',
                traits: ['热情洋溢', '富有创造力', '善于社交', '灵活多变'],
                career: ['记者', '公关', '活动策划', '心理咨询师'],
                relationship: '在关系中带来快乐和活力，需要自由和认同。'
            },
            'ISTJ': {
                type: 'ISTJ',
                name: '物流师',
                description: '实际且注重事实的个人，可靠性不容怀疑。',
                traits: ['诚实守信', '注重细节', '责任感强', '传统保守'],
                career: ['会计', '审计', '工程师', '公务员'],
                relationship: '忠诚稳定，用行动表达爱，重视承诺。'
            },
            'ISFJ': {
                type: 'ISFJ',
                name: '守卫者',
                description: '非常专注而温暖的保卫者，时刻准备保护爱着的人们。',
                traits: ['体贴周到', '耐心细致', '忠诚可靠', '谦逊低调'],
                career: ['护士', '教师', '社会工作者', '行政助理'],
                relationship: '无私奉献，关注伴侣的日常需求。'
            },
            'ESTJ': {
                type: 'ESTJ',
                name: '总经理',
                description: '出色的管理者，在管理事情或人的时候无与伦比。',
                traits: ['组织能力强', '务实高效', '直接坦率', '遵守规则'],
                career: ['军官', '法官', '企业管理者', '警察'],
                relationship: '重视稳定和秩序，用实际行动照顾伴侣。'
            },
            'ESFJ': {
                type: 'ESFJ',
                name: '执政官',
                description: '极度关心他人，社交能力强，总是在热心帮忙。',
                traits: ['热心肠', '社交能力强', '传统守旧', '喜欢帮助人'],
                career: ['教师', '护士', '公关', '活动组织'],
                relationship: '温暖体贴，喜欢营造和谐的家庭氛围。'
            },
            'ISTP': {
                type: 'ISTP',
                name: '鉴赏家',
                description: '大胆而实际的实验家，擅长使用各种工具。',
                traits: ['动手能力强', '冷静理性', '灵活应变', '独立自主'],
                career: ['工程师', '机械师', '飞行员', '数据分析'],
                relationship: '需要个人空间，用行动而非言语表达关心。'
            },
            'ISFP': {
                type: 'ISFP',
                name: '探险家',
                description: '灵活有魅力的艺术家，时刻准备着探索和体验新事物。',
                traits: ['艺术气质', '随性自由', '敏感细腻', '活在当下'],
                career: ['设计师', '艺术家', '摄影师', '厨师'],
                relationship: '温柔体贴，用自己的方式表达情感。'
            },
            'ESTP': {
                type: 'ESTP',
                name: '企业家',
                description: '聪明精力充沛善于感知的人，享受生活在边缘的生活。',
                traits: ['冒险精神', '反应敏捷', '务实直接', '适应力强'],
                career: ['销售', '企业家', '运动员', '股票经纪人'],
                relationship: '带来刺激和乐趣，喜欢一起参与活动。'
            },
            'ESFP': {
                type: 'ESFP',
                name: '表演者',
                description: '自然的表演者，生活充满激情充满魅力。',
                traits: ['热情开朗', '乐于助人', '乐观向上', '富有表现力'],
                career: ['演员', '销售', '旅游顾问', '活动策划'],
                relationship: '带来欢乐和活力，喜欢共同体验生活。'
            }
        };
        this.loadQuestions();
    }
    loadQuestions() {
        try {
            const filePath = path.join(process.cwd(), 'mbti_data.txt');
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            this.questions = JSON.parse(fileContent);
        }
        catch (error) {
            console.error('[MbtiService] Failed to load questions:', error);
            this.questions = [];
        }
    }
    getQuestions() {
        return this.questions;
    }
    calculateMbti(answers) {
        const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
        answers.forEach((answer, index) => {
            if (index < this.questions.length) {
                scores[answer]++;
            }
        });
        const type = [
            scores.E >= scores.I ? 'E' : 'I',
            scores.S >= scores.N ? 'S' : 'N',
            scores.T >= scores.F ? 'T' : 'F',
            scores.J >= scores.P ? 'J' : 'P',
        ].join('');
        return { type, scores };
    }
    getTypeDescription(type) {
        return this.typeDescriptions[type] || {
            type,
            name: '未知类型',
            description: '暂无描述',
            traits: [],
            career: [],
            relationship: ''
        };
    }
    async saveResult(userId, data) {
        return this.prisma.mbtiResult.upsert({
            where: { userId },
            update: {
                mbtiType: data.mbtiType,
                eScore: data.eScore,
                iScore: data.iScore,
                sScore: data.sScore,
                nScore: data.nScore,
                tScore: data.tScore,
                fScore: data.fScore,
                jScore: data.jScore,
                pScore: data.pScore,
                answers: JSON.stringify(data.answers),
            },
            create: {
                userId,
                mbtiType: data.mbtiType,
                eScore: data.eScore,
                iScore: data.iScore,
                sScore: data.sScore,
                nScore: data.nScore,
                tScore: data.tScore,
                fScore: data.fScore,
                jScore: data.jScore,
                pScore: data.pScore,
                answers: JSON.stringify(data.answers),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        nickname: true,
                        avatar: true,
                    },
                },
            },
        });
    }
    async getUserResult(userId) {
        const result = await this.prisma.mbtiResult.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        nickname: true,
                        avatar: true,
                    },
                },
            },
        });
        if (!result) {
            return null;
        }
        return {
            ...result,
            answers: JSON.parse(result.answers),
            description: this.getTypeDescription(result.mbtiType),
        };
    }
    getAllTypes() {
        return Object.values(this.typeDescriptions);
    }
};
exports.MbtiService = MbtiService;
exports.MbtiService = MbtiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], MbtiService);


/***/ }),
/* 59 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 60 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 61 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DailyFortuneModule = void 0;
const common_1 = __webpack_require__(2);
const daily_fortune_controller_1 = __webpack_require__(62);
const daily_fortune_service_1 = __webpack_require__(63);
const prisma_module_1 = __webpack_require__(5);
let DailyFortuneModule = class DailyFortuneModule {
};
exports.DailyFortuneModule = DailyFortuneModule;
exports.DailyFortuneModule = DailyFortuneModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [daily_fortune_controller_1.DailyFortuneController],
        providers: [daily_fortune_service_1.DailyFortuneService],
        exports: [daily_fortune_service_1.DailyFortuneService],
    })
], DailyFortuneModule);


/***/ }),
/* 62 */
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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DailyFortuneController = void 0;
const common_1 = __webpack_require__(2);
const daily_fortune_service_1 = __webpack_require__(63);
const jwt_auth_guard_1 = __webpack_require__(17);
const express_1 = __webpack_require__(30);
let DailyFortuneController = class DailyFortuneController {
    constructor(dailyFortuneService) {
        this.dailyFortuneService = dailyFortuneService;
    }
    async getTodayFortune(req) {
        const userId = req.user.sub;
        return this.dailyFortuneService.getTodayFortune(userId);
    }
    async refreshTodayFortune(req) {
        const userId = req.user.sub;
        return this.dailyFortuneService.refreshTodayFortune(userId);
    }
    async getRecentFortunes(req) {
        const userId = req.user.sub;
        return this.dailyFortuneService.getRecentFortunes(userId, 7);
    }
};
exports.DailyFortuneController = DailyFortuneController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('today'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], DailyFortuneController.prototype, "getTodayFortune", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], DailyFortuneController.prototype, "refreshTodayFortune", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('recent'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], DailyFortuneController.prototype, "getRecentFortunes", null);
exports.DailyFortuneController = DailyFortuneController = __decorate([
    (0, common_1.Controller)('daily-fortune'),
    __metadata("design:paramtypes", [typeof (_a = typeof daily_fortune_service_1.DailyFortuneService !== "undefined" && daily_fortune_service_1.DailyFortuneService) === "function" ? _a : Object])
], DailyFortuneController);


/***/ }),
/* 63 */
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
exports.DailyFortuneService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(6);
const config_1 = __webpack_require__(4);
let DailyFortuneService = class DailyFortuneService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.aiApiKey = this.configService.get('XIAOMIMIMO_API_KEY') || '';
        this.aiBaseUrl = this.configService.get('XIAOMIMIMO_API_URL') || '';
        this.aiModel = this.configService.get('XIAOMIMIMO_MODEL') || 'glm-4-flash';
    }
    async getTodayFortune(userId) {
        const today = this.getTodayDate();
        const existing = await this.prisma.dailyFortune.findUnique({
            where: {
                userId_fortuneDate: {
                    userId,
                    fortuneDate: today,
                },
            },
        });
        if (existing) {
            return existing;
        }
        return this.calculateTodayFortune(userId);
    }
    async calculateTodayFortune(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('用户不存在');
        }
        const astrology = await this.prisma.astrologyReading.findUnique({
            where: { userId },
        });
        if (!astrology) {
            throw new common_1.BadRequestException('请先计算星盘');
        }
        const fortune = await this.callAIFortune(user, astrology);
        const today = this.getTodayDate();
        const result = await this.prisma.dailyFortune.create({
            data: {
                userId,
                fortuneDate: today,
                overallScore: fortune.overallScore,
                summary: fortune.summary,
                precautions: fortune.precautions,
                career: fortune.career,
                love: fortune.love,
                wealth: fortune.wealth,
                health: fortune.health,
                luckyColor: fortune.luckyColor,
                luckyNumber: fortune.luckyNumber,
                luckyDirection: fortune.luckyDirection,
                advice: fortune.advice,
            },
        });
        return result;
    }
    async callAIFortune(user, astrology) {
        const now = new Date();
        const beijingTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
        const prompt = `你是一位精通命理学、星座学和五行的运势大师。请根据以下用户信息，分析其今日运势，并以JSON格式返回结果。

用户信息：
- 昵称：${user.nickname || '匿名'}
- 出生日期：${user.birthYear}年${user.birthMonth}月${user.birthDay}日
- 出生时辰：${user.birthHour}时
- 星座：${astrology.zodiacSign}
- 五行：${astrology.fiveElements}
- 性别：${user.gender || '未知'}
- 年柱：${astrology.yearPillar}
- 月柱：${astrology.monthPillar}
- 日柱：${astrology.dayPillar}
- 时柱：${astrology.hourPillar}
- 出生地：${user.birthProvince}
- 现居地：${user.currentProvince}

当前时间：${beijingTime.getFullYear()}年${beijingTime.getMonth() + 1}月${beijingTime.getDate()}日

请以JSON格式返回今日运势分析，包含以下字段：
{
  "overallScore": 0-100的总体得分,
  "summary": "一句话简短总结运势（不超过30字）",
  "precautions": "今日需要注意的事项（2-3条）",
  "career": "事业运势分析",
  "love": "爱情运势分析",
  "wealth": "财富运势分析",
  "health": "健康运势分析",
  "luckyColor": "幸运颜色",
  "luckyNumber": 幸运数字（1-99之间的整数）,
  "luckyDirection": "幸运方位",
  "advice": "今日建议"
}

要求：
1. overallScore为0-100的整数
2. 分析要基于用户的八字、五行、星座等命理信息
3. 语言要积极正面，即使运势不好也要给出建设性建议
4. 只返回JSON，不要有其他内容`;
        try {
            const response = await fetch(`${this.aiBaseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.aiApiKey}`,
                },
                body: JSON.stringify({
                    model: this.aiModel,
                    messages: [
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 2000,
                }),
            });
            if (!response.ok) {
                console.error('[DailyFortuneService] AI request failed:', response.status);
                throw new Error('AI计算失败');
            }
            const data = await response.json();
            const content = data.choices?.[0]?.message?.content?.trim() || '{}';
            let fortune;
            try {
                const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                fortune = JSON.parse(jsonContent);
            }
            catch (e) {
                console.error('[DailyFortuneService] Failed to parse AI response:', content);
                fortune = this.getDefaultFortune();
            }
            if (fortune.overallScore < 0)
                fortune.overallScore = 0;
            if (fortune.overallScore > 100)
                fortune.overallScore = 100;
            return fortune;
        }
        catch (error) {
            console.error('[DailyFortuneService] AI error:', error);
            return this.getDefaultFortune();
        }
    }
    getDefaultFortune() {
        return {
            overallScore: 75,
            summary: '今日运势平稳，保持积极心态',
            precautions: '注意饮食健康，保持规律作息',
            career: '工作顺利，保持专注',
            love: '感情平稳，多沟通表达',
            wealth: '财运平稳，理性消费',
            health: '注意休息，适当运动',
            luckyColor: '红色',
            luckyNumber: 8,
            luckyDirection: '东方',
            advice: '保持积极心态，把握当下',
        };
    }
    getTodayDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    async getRecentFortunes(userId, days = 7) {
        const today = this.getTodayDate();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const fortunes = await this.prisma.dailyFortune.findMany({
            where: {
                userId,
                fortuneDate: {
                    gte: startDate.toISOString().split('T')[0],
                    lte: today,
                },
            },
            orderBy: {
                fortuneDate: 'desc',
            },
        });
        return fortunes;
    }
    async refreshTodayFortune(userId) {
        const today = this.getTodayDate();
        await this.prisma.dailyFortune.deleteMany({
            where: {
                userId,
                fortuneDate: today,
            },
        });
        return this.calculateTodayFortune(userId);
    }
};
exports.DailyFortuneService = DailyFortuneService;
exports.DailyFortuneService = DailyFortuneService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object])
], DailyFortuneService);


/***/ }),
/* 64 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FamousPeopleModule = void 0;
const common_1 = __webpack_require__(2);
const famous_people_controller_1 = __webpack_require__(65);
const famous_people_service_1 = __webpack_require__(66);
const prisma_module_1 = __webpack_require__(5);
let FamousPeopleModule = class FamousPeopleModule {
};
exports.FamousPeopleModule = FamousPeopleModule;
exports.FamousPeopleModule = FamousPeopleModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [famous_people_controller_1.FamousPeopleController],
        providers: [famous_people_service_1.FamousPeopleService],
        exports: [famous_people_service_1.FamousPeopleService],
    })
], FamousPeopleModule);


/***/ }),
/* 65 */
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
exports.FamousPeopleController = void 0;
const common_1 = __webpack_require__(2);
const famous_people_service_1 = __webpack_require__(66);
let FamousPeopleController = class FamousPeopleController {
    constructor(famousPeopleService) {
        this.famousPeopleService = famousPeopleService;
    }
    async getByZodiac(zodiacSign) {
        return this.famousPeopleService.getByZodiac(zodiacSign);
    }
    async getAllGroupedByZodiac() {
        return this.famousPeopleService.getAllGroupedByZodiac();
    }
    async importPeople(data) {
        return this.famousPeopleService.importPeople(data.people);
    }
    async getAll() {
        return this.famousPeopleService.getAll();
    }
};
exports.FamousPeopleController = FamousPeopleController;
__decorate([
    (0, common_1.Get)(':zodiacSign'),
    __param(0, (0, common_1.Param)('zodiacSign')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FamousPeopleController.prototype, "getByZodiac", null);
__decorate([
    (0, common_1.Get)('grouped/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FamousPeopleController.prototype, "getAllGroupedByZodiac", null);
__decorate([
    (0, common_1.Post)('import'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FamousPeopleController.prototype, "importPeople", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FamousPeopleController.prototype, "getAll", null);
exports.FamousPeopleController = FamousPeopleController = __decorate([
    (0, common_1.Controller)('famous-people'),
    __metadata("design:paramtypes", [typeof (_a = typeof famous_people_service_1.FamousPeopleService !== "undefined" && famous_people_service_1.FamousPeopleService) === "function" ? _a : Object])
], FamousPeopleController);


/***/ }),
/* 66 */
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
exports.FamousPeopleService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(6);
let FamousPeopleService = class FamousPeopleService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getByZodiac(zodiacSign) {
        return this.prisma.famousPerson.findMany({
            where: { zodiacSign },
            orderBy: { createdAt: 'asc' },
        });
    }
    async getAllGroupedByZodiac() {
        const allPeople = await this.prisma.famousPerson.findMany({
            orderBy: { createdAt: 'asc' },
        });
        const grouped = {};
        const zodiacOrder = [
            '白羊座', '金牛座', '双子座', '巨蟹座',
            '狮子座', '处女座', '天秤座', '天蝎座',
            '射手座', '摩羯座', '水瓶座', '双鱼座'
        ];
        zodiacOrder.forEach(sign => {
            grouped[sign] = [];
        });
        allPeople.forEach(person => {
            if (grouped[person.zodiacSign]) {
                grouped[person.zodiacSign].push(person);
            }
        });
        return grouped;
    }
    async importPeople(people) {
        await this.prisma.famousPerson.deleteMany({});
        const result = await this.prisma.famousPerson.createMany({
            data: people,
            skipDuplicates: true,
        });
        return { count: result.count };
    }
    async getAll() {
        return this.prisma.famousPerson.findMany({
            orderBy: { createdAt: 'asc' },
        });
    }
};
exports.FamousPeopleService = FamousPeopleService;
exports.FamousPeopleService = FamousPeopleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], FamousPeopleService);


/***/ }),
/* 67 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductModule = void 0;
const common_1 = __webpack_require__(2);
const product_controller_1 = __webpack_require__(68);
const product_service_1 = __webpack_require__(69);
const prisma_module_1 = __webpack_require__(5);
let ProductModule = class ProductModule {
};
exports.ProductModule = ProductModule;
exports.ProductModule = ProductModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [product_controller_1.ProductController],
        providers: [product_service_1.ProductService],
        exports: [product_service_1.ProductService],
    })
], ProductModule);


/***/ }),
/* 68 */
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
exports.ProductController = void 0;
const common_1 = __webpack_require__(2);
const product_service_1 = __webpack_require__(69);
let ProductController = class ProductController {
    constructor(productService) {
        this.productService = productService;
    }
    async getList(skip = 0, take = 20, category) {
        return this.productService.getList(Number(skip), Number(take), category);
    }
    async getById(id) {
        return this.productService.getById(id);
    }
    async getCategories() {
        return this.productService.getCategories();
    }
    async importProducts(data) {
        return this.productService.importProducts(data.products);
    }
    async deleteAll() {
        return this.productService.deleteAll();
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('skip')),
    __param(1, (0, common_1.Query)('take')),
    __param(2, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getList", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getById", null);
__decorate([
    (0, common_1.Get)('categories/list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Post)('import'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "importProducts", null);
__decorate([
    (0, common_1.Post)('delete-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "deleteAll", null);
exports.ProductController = ProductController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [typeof (_a = typeof product_service_1.ProductService !== "undefined" && product_service_1.ProductService) === "function" ? _a : Object])
], ProductController);


/***/ }),
/* 69 */
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
exports.ProductService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(6);
let ProductService = class ProductService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getList(skip = 0, take = 20, category) {
        const where = category ? { category } : {};
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            products,
            total,
            skip,
            take,
        };
    }
    async getById(id) {
        return this.prisma.product.findUnique({
            where: { id },
        });
    }
    async getCategories() {
        const products = await this.prisma.product.findMany({
            select: { category: true },
            distinct: ['category'],
        });
        return products.map(p => p.category);
    }
    async importProducts(products) {
        let imported = 0;
        let skipped = 0;
        for (const product of products) {
            try {
                await this.prisma.product.upsert({
                    where: {
                        productId_platform: {
                            productId: product.productId,
                            platform: product.platform,
                        },
                    },
                    update: {
                        title: product.title,
                        productUrl: product.productUrl,
                        imageUrl: product.imageUrl,
                        price: product.price,
                        shopName: product.shopName,
                        category: product.category,
                        tags: product.tags,
                        remark: product.remark,
                    },
                    create: product,
                });
                imported++;
            }
            catch (error) {
                console.error(`Failed to import product ${product.productId}:`, error);
                skipped++;
            }
        }
        return { imported, skipped };
    }
    async deleteAll() {
        return this.prisma.product.deleteMany({});
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], ProductService);


/***/ }),
/* 70 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AllExceptionsFilter = void 0;
const common_1 = __webpack_require__(2);
let AllExceptionsFilter = class AllExceptionsFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        console.error('[GlobalExceptionFilter] Exception caught:', {
            path: request.url,
            method: request.method,
            exception: exception,
            stack: exception instanceof Error ? exception.stack : undefined,
        });
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof common_1.HttpException
            ? exception.getResponse()
            : 'Internal server error';
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
        });
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);


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
const all_exceptions_filter_1 = __webpack_require__(70);
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
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
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