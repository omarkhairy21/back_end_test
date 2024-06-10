// src/logging/logging.service.ts
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
// import { LoggerService } from '@nestjs/common';

@Injectable()
export class LoggingService implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const processingTime = Date.now() - startTime;
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} - ${processingTime}ms`,
      );
    });

    next();
  }
}
