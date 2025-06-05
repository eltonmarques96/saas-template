import 'dotenv/config';
import './utils/module-alias';
import bodyParser from 'body-parser';
import { Server } from '@overnightjs/core';
import { UserController } from './controllers/user';
import { Application } from 'express';
import * as http from 'http';
import { AuthController } from './controllers/auth';
import AppDataSource from './data-source';
import logger from './logger';
import cors from 'cors';

export class SetupServer extends Server {
  private server?: http.Server;
  constructor(private port = 8000) {
    super();
  }

  public async init(): Promise<void> {
    this.port = Number(process.env.APP_PORT) || this.port;
    this.setupExpress();
    await this.setupDataSource();
    this.setupControllers();
    logger.info('Enviroment: ' + process.env.NODE_ENV);
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
    this.app.use(
      cors({
        origin: '*',
      })
    );
  }

  private async setupDataSource(): Promise<void> {
    await AppDataSource.initialize()
      .then(() => {
        logger.info('Data Source has been initialized successfully');
      })
      .catch((err) => {
        logger.error('Error during Data Source initialization:', err);
      });
    await AppDataSource.runMigrations()
      .then(() => {
        logger.info('Migrations have been run successfully!');
      })
      .catch((err) => {
        logger.error('Error running migrations:', err);
      });
  }

  private setupControllers(): void {
    const userController = new UserController();
    const authController = new AuthController();
    this.addControllers([userController, authController]);
  }

  public getApp(): Application {
    return this.app;
  }

  public start(): void {
    this.server = this.app.listen(this.port, () => {
      logger.info('Server listening on port: ' + this.port);
    });
  }

  public async close(): Promise<void> {
    await AppDataSource.destroy();
    if (this.server) {
      await new Promise((resolve, reject) => {
        this.server?.close((err) => {
          if (err) {
            return reject(err);
          }
          resolve(true);
        });
      });
    }
  }
}
