import type { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../errors.js';

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof NotFoundError) {
    res.status(404).json({ error: { message: err.message, status: 404 } });
    return;
  }
  console.error(err);
  res.status(500).json({ error: { message: 'Internal server error', status: 500 } });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: { message: 'Route not found', status: 404 } });
}
