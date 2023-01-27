import express, { Express, Response } from 'express';
import morgan = require('morgan');
import cors from 'cors';

import { testRouter, authRouter, adminRouter } from '../routes';
import sequelize from '../database/config';
import '../models/index';

export class Server {

    public app: Express;
    public port: string;
    public prefix = "/api";
    public paths: {
        testServer: string,
        auth: string,
        admin: string
    }

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3000';
        this.paths = {
            testServer: '/',
            auth: `${this.prefix}/auth`,
            admin: `${this.prefix}/admin`
        }

        /* Middleware */
        this.middlewares();

        /* Routes */
        this.routes();

        /* DB Connection */
        this.dbConnection();

    }


    middlewares() {
        /* Options for cors midddleware */
        this.app.use(cors());

        /* Body Parse */
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        /* Morgan config */
        (this.app.get('env') !== 'production') && this.app.use(morgan('dev'));

    }

    routes() {
        /* Defined Routes */
        this.app.use(this.paths.testServer, testRouter);
        this.app.use(this.paths.auth, authRouter);
        this.app.use(this.paths.admin, adminRouter);

        /* Service not found - 404 */
        this.app.use((_req, res: Response) => {
            return res.status(404).json({
                ok: false,
                msg: "404 - Service not Found"
            })
        })
    }

    async dbConnection() {
        /* Connection to the DB Postgres*/
        try {
            const dbConnection = async () => {
                await Promise.all([
                    /* await sequelize.sync(); - Use when the DB has been changed */
                    // await sequelize.sync(),
                    sequelize.authenticate(),
                ])
            }
            await dbConnection();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }


    listen() {
        this.app.listen(this.port, () => {
            console.log(`Port: `, this.port)
        });
    }
}