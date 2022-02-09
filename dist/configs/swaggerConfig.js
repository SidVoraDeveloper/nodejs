"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SwaggerConf = /** @class */ (function () {
    function SwaggerConf() {
    }
    SwaggerConf.options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Hiki',
                version: '1.4.5',
            },
        },
        apis: ['./controllers/*.ts'], // files containing annotations as above
    };
    return SwaggerConf;
}());
exports.default = SwaggerConf;
