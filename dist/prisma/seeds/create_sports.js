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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
// const { PrismaClient } = require('@prisma/client');
var prisma = new client_1.PrismaClient();
var sports = [
    {
        name: 'Baseball',
        description: 'Baseball',
        verified: true
    },
    {
        name: 'Basketball',
        description: 'Basketball',
        verified: true
    },
    {
        name: 'Baseball',
        description: 'Baseball',
        verified: true
    },
    {
        name: 'Boxing',
        description: 'Boxing',
        verified: true
    },
    {
        name: 'Cheerleading',
        description: 'Cheerleading',
        verified: true
    },
    {
        name: 'Cricket',
        description: 'Cricket',
        verified: true
    },
    {
        name: 'Cross fit',
        description: 'Crossfit',
        verified: true
    },
    {
        name: 'Cycling',
        description: 'Cycling',
        verified: true
    },
    {
        name: 'Dance',
        description: 'dance',
        verified: true
    },
    {
        name: 'Field Hockey',
        description: 'Field hockey',
        verified: true
    },
    {
        name: 'Figure Skating',
        description: 'Figure Skating',
        verified: true
    },
    {
        name: 'Fishing',
        description: 'Fishing',
        verified: true
    },
    {
        name: 'Fitness',
        description: 'Fitness',
        verified: true
    },
    {
        name: 'American Football',
        description: 'American Football',
        verified: true
    },
    {
        name: 'Soccer',
        description: 'Soccer',
        verified: true
    },
    {
        name: 'Golf',
        description: 'Golf',
        verified: true
    },
    {
        name: 'Gymnastics',
        description: 'Gymnastics',
        verified: true
    },
    {
        name: 'Handball',
        description: 'Handball',
        verified: true
    },
    {
        name: 'Hiking',
        description: 'Hiking',
        verified: true
    },
    {
        name: 'Ice hockey',
        description: 'Ice hockey',
        verified: true
    },
    {
        name: 'Kite surfing',
        description: 'Kite surfing',
        verified: true
    },
    {
        name: 'Lacrosse',
        description: 'Lacrosse',
        verified: true
    },
    {
        name: 'MMA',
        description: 'MMA',
        verified: true
    },
    {
        name: 'Padel Tennis',
        description: 'Padel Tennis',
        verified: true
    },
    {
        name: 'Rowing',
        description: 'Rowing',
        verified: true
    },
    {
        name: 'Rugby',
        description: 'Rugby',
        verified: true
    },
    {
        name: 'Running',
        description: 'Running',
        verified: true
    },
    {
        name: 'Sailing',
        description: 'Sailing',
        verified: true
    },
    {
        name: 'Skateboarding',
        description: 'Skateboarding',
        verified: true
    },
    {
        name: 'Skiing',
        description: 'Skiing',
        verified: true
    },
    {
        name: 'Snowboarding',
        description: 'Snowboarding',
        verified: true
    },
    {
        name: 'Softball',
        description: 'Softball',
        verified: true
    },
    {
        name: 'Surfing',
        description: 'Surfing',
        verified: true
    },
    {
        name: 'Swimming',
        description: 'Swimming',
        verified: true
    },
    {
        name: 'Table Tennis',
        description: 'Table Tennis',
        verified: true
    },
    {
        name: 'Tennis',
        description: 'Tennis',
        verified: true
    },
    {
        name: 'Track & Field',
        description: 'Track & Field',
        verified: true
    },
    {
        name: 'Volleyball',
        description: 'Volleyball',
        verified: true
    },
    {
        name: 'Wrestling',
        description: 'Wrestling',
        verified: true
    },
    {
        name: 'Yoga',
        description: 'Yoga',
        verified: true
    },
    {
        name: 'Other',
        description: 'Other',
        verified: true
    }
];
function up() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            prisma.tags.createMany({
                data: sports
            }).then(function (result) {
                console.log(result);
            }).catch(function (error) {
                console.log(error);
            });
            return [2 /*return*/];
        });
    });
}
up();
