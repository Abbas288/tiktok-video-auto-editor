import cors from "cors";
import express, {
  Express,
  NextFunction,
  Request,
  Response,
} from "express";
import { CompileServerConfig } from "../config";
import { compileSession } from "../application/compileService";
import {
  CompilePayloadValidationError,
  parseCompilePayload,
} from "../domain/compilePayloadSchema";

/**
 * Creates the HTTP application for the compile server.
 *
 * @param config Server configuration.
 * @returns Express application.
 */
export function createApp(config: CompileServerConfig): Express {
  const app = express();

  app.use(cors({ origin: true }));
  app.use(express.json({ limit: "2mb" }));

  app.get("/health", (_request: Request, response: Response): void => {
    response.status(200).json({
      status: "ok",
    });
  });

  app.post(
    "/compile",
    async (
      request: Request,
      response: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const payload = parseCompilePayload(request.body);
        const result = await compileSession(payload, config);

        response.status(200).json(result);
      } catch (error) {
        if (error instanceof CompilePayloadValidationError) {
          response.status(400).json({
            error: error.message,
            details: error.details,
          });
          return;
        }

        next(error);
      }
    },
  );

  app.use((_request: Request, response: Response): void => {
    response.status(404).json({
      error: "Route not found.",
    });
  });

  app.use(
    (
      error: unknown,
      _request: Request,
      response: Response,
      _next: NextFunction,
    ): void => {
      const message =
        error instanceof Error ? error.message : "Unexpected server error.";

      response.status(500).json({
        error: message,
      });
    },
  );

  return app;
}