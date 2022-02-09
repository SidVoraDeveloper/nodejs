/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import AuthRoutes from './routes/authRoutes';
import ApiRoutes from './routes/apiRoutes';
import ExploreRoutes from './routes/exploreRoutes';
import dotenv from 'dotenv';
import multer from 'multer';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import SwaggerConf from './configs/swaggerConfig';

const openapiSpecification = swaggerJsdoc(SwaggerConf.options);


dotenv.config();

class Shuttle {
    public app: express.Application;

    public upload = multer();

    constructor() {
      this.app = express();
      this.config();
      this.routes();
    }

    public config() {
      this.app.set('port', process.env.port || 3001);
      this.app.use(express.json());
      this.app.use(express.urlencoded({ extended: true }));
      this.app.use(compression());
      this.app.use(cors());
    }

    public routes() {
      this.app.use('/auth', new AuthRoutes().router);
      this.app.use('/api',  new ApiRoutes().router);
      this.app.use('/explore', new ExploreRoutes().router);
      this.app.use('/doc', swaggerUi.serve, swaggerUi.setup(openapiSpecification));
    }

    public start() {
      const port = this.app.get('port');
      this.app.listen(port, () => {
        console.log(`App listening on PORT ${port}`);
      });
    }
}

const server = new Shuttle();

server.start();
