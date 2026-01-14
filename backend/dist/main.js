/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.module.ts":
/*!***************************!*\
  !*** ./src/app.module.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const prisma_module_1 = __webpack_require__(/*! ./common/prisma/prisma.module */ "./src/common/prisma/prisma.module.ts");
const minio_module_1 = __webpack_require__(/*! ./common/minio/minio.module */ "./src/common/minio/minio.module.ts");
const auth_module_1 = __webpack_require__(/*! ./modules/auth/auth.module */ "./src/modules/auth/auth.module.ts");
const user_module_1 = __webpack_require__(/*! ./modules/user/user.module */ "./src/modules/user/user.module.ts");
const astrology_module_1 = __webpack_require__(/*! ./modules/astrology/astrology.module */ "./src/modules/astrology/astrology.module.ts");
const prayer_module_1 = __webpack_require__(/*! ./modules/prayer/prayer.module */ "./src/modules/prayer/prayer.module.ts");
const confession_module_1 = __webpack_require__(/*! ./modules/confession/confession.module */ "./src/modules/confession/confession.module.ts");
const treehole_module_1 = __webpack_require__(/*! ./modules/treehole/treehole.module */ "./src/modules/treehole/treehole.module.ts");
const dating_module_1 = __webpack_require__(/*! ./modules/dating/dating.module */ "./src/modules/dating/dating.module.ts");
const palm_module_1 = __webpack_require__(/*! ./modules/palm/palm.module */ "./src/modules/palm/palm.module.ts");
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
            confession_module_1.ConfessionModule,
            treehole_module_1.TreeholeModule,
            dating_module_1.DatingModule,
            palm_module_1.PalmModule,
        ],
    })
], AppModule);


/***/ }),

/***/ "./src/common/filters/all-exceptions.filter.ts":
/*!*****************************************************!*\
  !*** ./src/common/filters/all-exceptions.filter.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AllExceptionsFilter = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
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


/***/ }),

/***/ "./src/common/guards/jwt-auth.guard.ts":
/*!*********************************************!*\
  !*** ./src/common/guards/jwt-auth.guard.ts ***!
  \*********************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
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

/***/ "./src/common/minio/minio.module.ts":
/*!******************************************!*\
  !*** ./src/common/minio/minio.module.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MinioModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const minio_service_1 = __webpack_require__(/*! ./minio.service */ "./src/common/minio/minio.service.ts");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
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

/***/ "./src/common/minio/minio.service.ts":
/*!*******************************************!*\
  !*** ./src/common/minio/minio.service.ts ***!
  \*******************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const Minio = __importStar(__webpack_require__(/*! minio */ "minio"));
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
    async uploadFile(fileBuffer, fileName, mimeType) {
        if (!this.client || !this.isEnabled) {
            throw new Error('MinIO 未启用，无法上传文件');
        }
        const objectName = `palm-readings/${Date.now()}-${fileName}`;
        await this.client.putObject(this.bucketName, objectName, fileBuffer, fileBuffer.length, {
            'Content-Type': mimeType,
        });
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
        const match = url.match(/\/palm-readings\/(.+)$/);
        return match ? `palm-readings/${match[1]}` : '';
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

/***/ "./src/common/prisma/prisma.module.ts":
/*!********************************************!*\
  !*** ./src/common/prisma/prisma.module.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ./prisma.service */ "./src/common/prisma/prisma.service.ts");
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

/***/ "./src/common/prisma/prisma.service.ts":
/*!*********************************************!*\
  !*** ./src/common/prisma/prisma.service.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
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

/***/ "./src/common/utils/astrology.utils.ts":
/*!*********************************************!*\
  !*** ./src/common/utils/astrology.utils.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AstrologyService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const lunar_javascript_1 = __webpack_require__(/*! lunar-javascript */ "lunar-javascript");
let AstrologyService = class AstrologyService {
    createSolarFromEast8(year, month, day, hour) {
        const date = new Date(year, month - 1, day, hour, 0, 0);
        const serverOffset = date.getTimezoneOffset();
        const east8Offset = -480;
        const offsetDiff = serverOffset - east8Offset;
        const adjustedDate = new Date(date.getTime() + offsetDiff * 60 * 1000);
        const solar = lunar_javascript_1.Solar.fromDate(adjustedDate);
        return solar;
    }
    solarToLunar(year, month, day, hour) {
        const solar = this.createSolarFromEast8(year, month, day, hour);
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
        const solar = this.createSolarFromEast8(year, month, day, hour);
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
    getBaZiPillars(year, month, day, hour) {
        const solar = this.createSolarFromEast8(year, month, day, hour);
        const lunar = solar.getLunar();
        const eightChar = lunar.getEightChar();
        const yearPillar = eightChar.getYear();
        const monthPillar = eightChar.getMonth();
        const dayPillar = eightChar.getDay();
        const hourPillar = eightChar.getTime();
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

/***/ "./src/modules/astrology/astrology.controller.ts":
/*!*******************************************************!*\
  !*** ./src/modules/astrology/astrology.controller.ts ***!
  \*******************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const astrology_service_1 = __webpack_require__(/*! ./astrology.service */ "./src/modules/astrology/astrology.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../../common/guards/jwt-auth.guard */ "./src/common/guards/jwt-auth.guard.ts");
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
exports.AstrologyController = AstrologyController = __decorate([
    (0, common_1.Controller)('astrology'),
    __metadata("design:paramtypes", [typeof (_a = typeof astrology_service_1.AstrologyServiceModule !== "undefined" && astrology_service_1.AstrologyServiceModule) === "function" ? _a : Object])
], AstrologyController);


/***/ }),

/***/ "./src/modules/astrology/astrology.module.ts":
/*!***************************************************!*\
  !*** ./src/modules/astrology/astrology.module.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AstrologyModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const astrology_service_1 = __webpack_require__(/*! ./astrology.service */ "./src/modules/astrology/astrology.service.ts");
const astrology_controller_1 = __webpack_require__(/*! ./astrology.controller */ "./src/modules/astrology/astrology.controller.ts");
const prisma_module_1 = __webpack_require__(/*! ../../common/prisma/prisma.module */ "./src/common/prisma/prisma.module.ts");
const astrology_utils_1 = __webpack_require__(/*! ../../common/utils/astrology.utils */ "./src/common/utils/astrology.utils.ts");
const auth_module_1 = __webpack_require__(/*! ../auth/auth.module */ "./src/modules/auth/auth.module.ts");
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

/***/ "./src/modules/astrology/astrology.service.ts":
/*!****************************************************!*\
  !*** ./src/modules/astrology/astrology.service.ts ***!
  \****************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const prisma_service_1 = __webpack_require__(/*! ../../common/prisma/prisma.service */ "./src/common/prisma/prisma.service.ts");
const astrology_utils_1 = __webpack_require__(/*! ../../common/utils/astrology.utils */ "./src/common/utils/astrology.utils.ts");
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
        console.log('[AstrologyService] Reading found, starting AI interpretations...');
        const birthProvince = user.birthProvince || '山西';
        console.log('[AstrologyService] Starting zodiac interpretation...');
        const zodiacInterpretation = await this.generateZodiacInterpretation(reading.zodiacSign, user.gender, birthProvince);
        console.log('[AstrologyService] Zodiac interpretation completed');
        console.log('[AstrologyService] Starting bazi interpretation...');
        const baziInterpretation = await this.generateBaZiInterpretation(reading.yearPillar, reading.monthPillar, reading.dayPillar, reading.hourPillar, reading.fiveElements, user.gender, birthProvince);
        console.log('[AstrologyService] Bazi interpretation completed');
        console.log('[AstrologyService] Starting kline interpretation...');
        const klineInterpretation = await this.generateKlineInterpretation(user.birthYear, user.birthMonth, user.birthDay, user.birthHour, reading.zodiacSign, reading.yearPillar, reading.dayPillar, user.gender, birthProvince);
        console.log('[AstrologyService] Kline interpretation completed');
        console.log('[AstrologyService] Updating database...');
        const updatedReading = await this.prisma.astrologyReading.update({
            where: { userId },
            data: {
                zodiacInterpretation,
                baziInterpretation,
                klineInterpretation,
            },
        });
        console.log('[AstrologyService] All completed successfully');
        return updatedReading;
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
        };
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
    async generateZodiacInterpretation(zodiacSign, gender, birthProvince) {
        const genderText = gender === 'male' ? '男性' : gender === 'female' ? '女性' : '';
        const provinceText = birthProvince ? `出生于${birthProvince}` : '';
        const prompt = `请作为专业的星座占星师，为${zodiacSign}${genderText}${provinceText}进行详细的性格分析和运势解读。

请从以下几个方面进行分析：
1. 性格特点：分析该星座的核心性格特征、优点和需要注意的地方${provinceText ? `，结合${birthProvince}的地域文化特色分析性格特质` : ''}
2. 爱情感情：分析该星座在爱情中的表现和配对建议
3. 事业发展：分析适合的职业方向和事业发展建议
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
    async generateBaZiInterpretation(yearPillar, monthPillar, dayPillar, hourPillar, fiveElementsJson, gender, birthProvince) {
        const genderText = gender === 'male' ? '男性' : gender === 'female' ? '女性' : '';
        const fiveElements = JSON.parse(fiveElementsJson || '{}');
        const provinceText = birthProvince ? `出生地：${birthProvince}` : '';
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
${provinceText}
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
    async generateKlineInterpretation(birthYear, birthMonth, birthDay, birthHour, zodiacSign, yearPillar, dayPillar, gender, birthProvince) {
        const genderText = gender === 'male' ? '男性' : gender === 'female' ? '女性' : '';
        const currentYear = new Date().getFullYear();
        const age = currentYear - birthYear;
        const provinceText = birthProvince ? `出生地：${birthProvince}` : '';
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
${provinceText ? `- ${provinceText}` : ''}

请分析人生运势走势，按照人生每10年为一个阶段，生成类似股票K线的分析数据。包括：
1. **运势指数**：0-100的数值，表示该阶段的整体运势水平
2. **事业运**：事业发展的趋势和关键节点${birthProvince ? `，结合${birthProvince}的地域发展机遇` : ''}
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

/***/ "./src/modules/auth/auth.controller.ts":
/*!*********************************************!*\
  !*** ./src/modules/auth/auth.controller.ts ***!
  \*********************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/modules/auth/auth.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../../common/guards/jwt-auth.guard */ "./src/common/guards/jwt-auth.guard.ts");
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
        return {
            success: true,
            userId,
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

/***/ "./src/modules/auth/auth.module.ts":
/*!*****************************************!*\
  !*** ./src/modules/auth/auth.module.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/modules/auth/auth.service.ts");
const auth_controller_1 = __webpack_require__(/*! ./auth.controller */ "./src/modules/auth/auth.controller.ts");
const prisma_module_1 = __webpack_require__(/*! ../../common/prisma/prisma.module */ "./src/common/prisma/prisma.module.ts");
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

/***/ "./src/modules/auth/auth.service.ts":
/*!******************************************!*\
  !*** ./src/modules/auth/auth.service.ts ***!
  \******************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const prisma_service_1 = __webpack_require__(/*! ../../common/prisma/prisma.service */ "./src/common/prisma/prisma.service.ts");
const bcrypt = __importStar(__webpack_require__(/*! bcrypt */ "bcrypt"));
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], AuthService);


/***/ }),

/***/ "./src/modules/confession/confession.controller.ts":
/*!*********************************************************!*\
  !*** ./src/modules/confession/confession.controller.ts ***!
  \*********************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const confession_service_1 = __webpack_require__(/*! ./confession.service */ "./src/modules/confession/confession.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../../common/guards/jwt-auth.guard */ "./src/common/guards/jwt-auth.guard.ts");
const express_1 = __webpack_require__(/*! express */ "express");
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

/***/ "./src/modules/confession/confession.module.ts":
/*!*****************************************************!*\
  !*** ./src/modules/confession/confession.module.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConfessionModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const confession_service_1 = __webpack_require__(/*! ./confession.service */ "./src/modules/confession/confession.service.ts");
const confession_controller_1 = __webpack_require__(/*! ./confession.controller */ "./src/modules/confession/confession.controller.ts");
const prisma_module_1 = __webpack_require__(/*! ../../common/prisma/prisma.module */ "./src/common/prisma/prisma.module.ts");
const auth_module_1 = __webpack_require__(/*! ../auth/auth.module */ "./src/modules/auth/auth.module.ts");
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

/***/ "./src/modules/confession/confession.service.ts":
/*!******************************************************!*\
  !*** ./src/modules/confession/confession.service.ts ***!
  \******************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../../common/prisma/prisma.service */ "./src/common/prisma/prisma.service.ts");
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

/***/ "./src/modules/dating/dating.controller.ts":
/*!*************************************************!*\
  !*** ./src/modules/dating/dating.controller.ts ***!
  \*************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const dating_service_1 = __webpack_require__(/*! ./dating.service */ "./src/modules/dating/dating.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../../common/guards/jwt-auth.guard */ "./src/common/guards/jwt-auth.guard.ts");
const express_1 = __webpack_require__(/*! express */ "express");
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


/***/ }),

/***/ "./src/modules/dating/dating.module.ts":
/*!*********************************************!*\
  !*** ./src/modules/dating/dating.module.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatingModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const dating_service_1 = __webpack_require__(/*! ./dating.service */ "./src/modules/dating/dating.service.ts");
const dating_controller_1 = __webpack_require__(/*! ./dating.controller */ "./src/modules/dating/dating.controller.ts");
const prisma_module_1 = __webpack_require__(/*! ../../common/prisma/prisma.module */ "./src/common/prisma/prisma.module.ts");
const auth_module_1 = __webpack_require__(/*! ../auth/auth.module */ "./src/modules/auth/auth.module.ts");
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

/***/ "./src/modules/dating/dating.service.ts":
/*!**********************************************!*\
  !*** ./src/modules/dating/dating.service.ts ***!
  \**********************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../../common/prisma/prisma.service */ "./src/common/prisma/prisma.service.ts");
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

/***/ "./src/modules/palm/palm.controller.ts":
/*!*********************************************!*\
  !*** ./src/modules/palm/palm.controller.ts ***!
  \*********************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const platform_express_1 = __webpack_require__(/*! @nestjs/platform-express */ "@nestjs/platform-express");
const palm_service_1 = __webpack_require__(/*! ./palm.service */ "./src/modules/palm/palm.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../../common/guards/jwt-auth.guard */ "./src/common/guards/jwt-auth.guard.ts");
const common_2 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
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

/***/ "./src/modules/palm/palm.module.ts":
/*!*****************************************!*\
  !*** ./src/modules/palm/palm.module.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PalmModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const palm_controller_1 = __webpack_require__(/*! ./palm.controller */ "./src/modules/palm/palm.controller.ts");
const palm_service_1 = __webpack_require__(/*! ./palm.service */ "./src/modules/palm/palm.service.ts");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
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

/***/ "./src/modules/palm/palm.service.ts":
/*!******************************************!*\
  !*** ./src/modules/palm/palm.service.ts ***!
  \******************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const prisma_service_1 = __webpack_require__(/*! ../../common/prisma/prisma.service */ "./src/common/prisma/prisma.service.ts");
const minio_service_1 = __webpack_require__(/*! ../../common/minio/minio.service */ "./src/common/minio/minio.service.ts");
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

/***/ "./src/modules/prayer/prayer.controller.ts":
/*!*************************************************!*\
  !*** ./src/modules/prayer/prayer.controller.ts ***!
  \*************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prayer_service_1 = __webpack_require__(/*! ./prayer.service */ "./src/modules/prayer/prayer.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../../common/guards/jwt-auth.guard */ "./src/common/guards/jwt-auth.guard.ts");
const express_1 = __webpack_require__(/*! express */ "express");
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

/***/ "./src/modules/prayer/prayer.module.ts":
/*!*********************************************!*\
  !*** ./src/modules/prayer/prayer.module.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrayerModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prayer_service_1 = __webpack_require__(/*! ./prayer.service */ "./src/modules/prayer/prayer.service.ts");
const prayer_controller_1 = __webpack_require__(/*! ./prayer.controller */ "./src/modules/prayer/prayer.controller.ts");
const prisma_module_1 = __webpack_require__(/*! ../../common/prisma/prisma.module */ "./src/common/prisma/prisma.module.ts");
const auth_module_1 = __webpack_require__(/*! ../auth/auth.module */ "./src/modules/auth/auth.module.ts");
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

/***/ "./src/modules/prayer/prayer.service.ts":
/*!**********************************************!*\
  !*** ./src/modules/prayer/prayer.service.ts ***!
  \**********************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../../common/prisma/prisma.service */ "./src/common/prisma/prisma.service.ts");
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

/***/ "./src/modules/treehole/treehole.controller.ts":
/*!*****************************************************!*\
  !*** ./src/modules/treehole/treehole.controller.ts ***!
  \*****************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const treehole_service_1 = __webpack_require__(/*! ./treehole.service */ "./src/modules/treehole/treehole.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../../common/guards/jwt-auth.guard */ "./src/common/guards/jwt-auth.guard.ts");
const express_1 = __webpack_require__(/*! express */ "express");
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

/***/ "./src/modules/treehole/treehole.module.ts":
/*!*************************************************!*\
  !*** ./src/modules/treehole/treehole.module.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TreeholeModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const treehole_service_1 = __webpack_require__(/*! ./treehole.service */ "./src/modules/treehole/treehole.service.ts");
const treehole_controller_1 = __webpack_require__(/*! ./treehole.controller */ "./src/modules/treehole/treehole.controller.ts");
const prisma_module_1 = __webpack_require__(/*! ../../common/prisma/prisma.module */ "./src/common/prisma/prisma.module.ts");
const auth_module_1 = __webpack_require__(/*! ../auth/auth.module */ "./src/modules/auth/auth.module.ts");
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

/***/ "./src/modules/treehole/treehole.service.ts":
/*!**************************************************!*\
  !*** ./src/modules/treehole/treehole.service.ts ***!
  \**************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../../common/prisma/prisma.service */ "./src/common/prisma/prisma.service.ts");
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

/***/ "./src/modules/user/user.controller.ts":
/*!*********************************************!*\
  !*** ./src/modules/user/user.controller.ts ***!
  \*********************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const user_service_1 = __webpack_require__(/*! ./user.service */ "./src/modules/user/user.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../../common/guards/jwt-auth.guard */ "./src/common/guards/jwt-auth.guard.ts");
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

/***/ "./src/modules/user/user.module.ts":
/*!*****************************************!*\
  !*** ./src/modules/user/user.module.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const user_service_1 = __webpack_require__(/*! ./user.service */ "./src/modules/user/user.service.ts");
const user_controller_1 = __webpack_require__(/*! ./user.controller */ "./src/modules/user/user.controller.ts");
const prisma_module_1 = __webpack_require__(/*! ../../common/prisma/prisma.module */ "./src/common/prisma/prisma.module.ts");
const auth_module_1 = __webpack_require__(/*! ../auth/auth.module */ "./src/modules/auth/auth.module.ts");
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

/***/ "./src/modules/user/user.service.ts":
/*!******************************************!*\
  !*** ./src/modules/user/user.service.ts ***!
  \******************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../../common/prisma/prisma.service */ "./src/common/prisma/prisma.service.ts");
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

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/jwt":
/*!******************************!*\
  !*** external "@nestjs/jwt" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),

/***/ "@nestjs/passport":
/*!***********************************!*\
  !*** external "@nestjs/passport" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),

/***/ "@nestjs/platform-express":
/*!*******************************************!*\
  !*** external "@nestjs/platform-express" ***!
  \*******************************************/
/***/ ((module) => {

module.exports = require("@nestjs/platform-express");

/***/ }),

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "lunar-javascript":
/*!***********************************!*\
  !*** external "lunar-javascript" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("lunar-javascript");

/***/ }),

/***/ "minio":
/*!************************!*\
  !*** external "minio" ***!
  \************************/
/***/ ((module) => {

module.exports = require("minio");

/***/ })

/******/ 	});
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
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const app_module_1 = __webpack_require__(/*! ./app.module */ "./src/app.module.ts");
const all_exceptions_filter_1 = __webpack_require__(/*! ./common/filters/all-exceptions.filter */ "./src/common/filters/all-exceptions.filter.ts");
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