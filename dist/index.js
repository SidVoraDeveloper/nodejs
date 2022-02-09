"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
var express_1 = __importDefault(require("express"));
var compression_1 = __importDefault(require("compression"));
var cors_1 = __importDefault(require("cors"));
var authRoutes_1 = __importDefault(require("./routes/authRoutes"));
var apiRoutes_1 = __importDefault(require("./routes/apiRoutes"));
var exploreRoutes_1 = __importDefault(require("./routes/exploreRoutes"));
var dotenv_1 = __importDefault(require("dotenv"));
var multer_1 = __importDefault(require("multer"));
var swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
var swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
var swaggerConfig_1 = __importDefault(require("./configs/swaggerConfig"));
var openapiSpecification = (0, swagger_jsdoc_1.default)(swaggerConfig_1.default.options);
dotenv_1.default.config();
var Shuttle = /** @class */ (function () {
    function Shuttle() {
        this.upload = (0, multer_1.default)();
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
    }
    Shuttle.prototype.config = function () {
        this.app.set('port', process.env.port || 3001);
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, compression_1.default)());
        this.app.use((0, cors_1.default)());
    };
    Shuttle.prototype.routes = function () {
        this.app.use('/auth', new authRoutes_1.default().router);
        this.app.use('/api', new apiRoutes_1.default().router);
        this.app.use('/explore', new exploreRoutes_1.default().router);
        this.app.use('/doc', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapiSpecification));
    };
    Shuttle.prototype.start = function () {
        var port = this.app.get('port');
        this.app.listen(port, function () {
            console.log("App listening on PORT " + port);
        });
    };
    return Shuttle;
}());
var server = new Shuttle();
server.start();
