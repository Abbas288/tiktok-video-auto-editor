import { randomUUID } from "node:crypto";
import path from "node:path";
import cors from "cors";
import express, {
  Express,
  NextFunction,
  Request,
  Response,
} from "express";
import multer from "multer";
import { compileSession } from "../application/compileService";
import { CompileServerConfig } from "../config";
import {
  CompilePayloadValidationError,
  parseCompilePayload,
} from "../domain/compilePayloadSchema";

const VIDEO_UPLOAD_FIELD = "video";
const MAX_VIDEO_UPLOAD_SIZE_BYTES = 250 * 1024 * 1024;

export function createApp(config: CompileServerConfig): Express {
  const app = express();

  app.use(cors({ origin: true }));
  app.use(express.json({ limit: "2mb" }));

  app.use(
    "/compiled",
    express.static(config.outputDir, {
      fallthrough: true,
      setHeaders: (response) => {
        response.setHeader("Cache-Control", "no-store");
      },
    }),
  );

  app.use(
    "/assets/videos",
    express.static(config.uploadDir, {
      fallthrough: true,
      setHeaders: (response) => {
        response.setHeader("Cache-Control", "no-store");
      },
    }),
  );

  const upload = multer({
    storage: multer.diskStorage({
      destination: (_request, _file, callback) => {
        callback(null, config.uploadDir);
      },
      filename: (_request, file, callback) => {
        callback(null, `${randomUUID()}${normalizeExtension(file.originalname)}`);
      },
    }),
    limits: {
      fileSize: MAX_VIDEO_UPLOAD_SIZE_BYTES,
    },
    fileFilter: (_request, file, callback) => {
      if (file.mimetype.startsWith("video/")) {
        callback(null, true);
        return;
      }

      callback(new Error("Only video uploads are allowed."));
    },
  });

  app.get("/health", (_request: Request, response: Response): void => {
    response.status(200).json({
      status: "ok",
    });
  });

  app.post(
    "/assets/videos",
    upload.single(VIDEO_UPLOAD_FIELD),
    (request: Request, response: Response): void => {
      if (!request.file) {
        response.status(400).json({
          error: "No video file was uploaded.",
        });
        return;
      }

      response.status(201).json({
        fileName: request.file.filename,
        assetUrl: `${config.publicBaseUrl.replace(/\/$/, "")}/assets/videos/${encodeURIComponent(
          request.file.filename,
        )}`,
      });
    },
  );

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

  app.use("/compiled/:filename", (request: Request, response: Response): void => {
    sendCompiledVideoNotFound(request, response);
  });

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

      if (
        error instanceof multer.MulterError ||
        message === "Only video uploads are allowed."
      ) {
        response.status(400).json({
          error: message,
        });
        return;
      }

      const details = createErrorDetails(error);

      console.error(
        "[compile-server] Request failed",
        JSON.stringify(
          {
            error: message,
            details,
          },
          null,
          2,
        ),
      );

      response.status(500).json({
        error: message,
        details,
      });
    },
  );

  return app;
}

function sendCompiledVideoNotFound(
  request: Request,
  response: Response,
): void {
  const filename = request.params.filename;
  const details = `The compiled output "${filename}" is no longer available. Run compile again.`;

  response.status(404);
  response.setHeader("Cache-Control", "no-store");

  if (request.method === "HEAD") {
    response.end();
    return;
  }

  if ((request.header("accept") ?? "").toLowerCase().includes("text/html")) {
    response.type("html").send(createCompiledVideoNotFoundHtml(filename));
    return;
  }

  response.json({
    error: "Compiled video not found.",
    details,
  });
}

function createCompiledVideoNotFoundHtml(filename: string): string {
  const safeFilename = escapeHtml(filename);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Compiled video not found</title>
  <style>
    :root {
      color-scheme: dark;
      font-family: Arial, Helvetica, sans-serif;
      background: #050505;
      color: #f5f5f5;
    }

    body {
      min-height: 100vh;
      margin: 0;
      display: grid;
      place-items: center;
      background:
        radial-gradient(circle at top, rgba(0, 229, 255, 0.12), transparent 35%),
        #050505;
    }

    main {
      width: min(92vw, 560px);
      border: 1px solid #242424;
      border-radius: 22px;
      background: #111111;
      padding: 32px;
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
      text-align: center;
    }

    .badge {
      display: inline-flex;
      border-radius: 999px;
      padding: 6px 12px;
      background: #1f2933;
      color: #00f5d4;
      font-size: 13px;
      font-weight: 800;
      margin-bottom: 18px;
    }

    h1 {
      margin: 0;
      font-size: clamp(26px, 5vw, 38px);
      line-height: 1.1;
    }

    p {
      color: #b6bcc6;
      line-height: 1.6;
      margin: 16px 0 0;
    }

    code {
      display: block;
      overflow-wrap: anywhere;
      margin-top: 18px;
      padding: 12px;
      border-radius: 14px;
      background: #050505;
      color: #facc15;
      font-size: 13px;
      text-align: left;
    }

    button {
      margin-top: 26px;
      min-height: 44px;
      border: 0;
      border-radius: 999px;
      background: #00e5ff;
      color: #000000;
      font-size: 15px;
      font-weight: 900;
      padding: 0 20px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <main>
    <div class="badge">Export unavailable</div>
    <h1>Compiled video not found</h1>
    <p>This video is no longer available. It may have been removed, cleaned up, or replaced by a newer compile result.</p>
    <code>${safeFilename}</code>
    <button type="button" onclick="history.length > 1 ? history.back() : location.href='/'">
      Go back
    </button>
  </main>
</body>
</html>`;
}

function createErrorDetails(error: unknown): string[] {
  const details: string[] = [];
  let currentError: unknown = error;

  while (currentError instanceof Error) {
    if (currentError.stack) {
      details.push(currentError.stack);
    } else {
      details.push(currentError.message);
    }

    const stderr = readStringProperty(currentError, "stderr");

    if (stderr) {
      details.push(stderr);
    }

    currentError = readUnknownProperty(currentError, "cause");
  }

  if (details.length === 0 && error !== undefined && error !== null) {
    details.push(String(error));
  }

  return details.slice(0, 6);
}

function readStringProperty(
  value: object,
  key: string,
): string | undefined {
  const record = value as Record<string, unknown>;
  const property = record[key];

  return typeof property === "string" && property.trim().length > 0
    ? property
    : undefined;
}

function readUnknownProperty(value: object, key: string): unknown {
  return (value as Record<string, unknown>)[key];
}

function normalizeExtension(fileName: string): string {
  const extension = path.extname(fileName).toLowerCase();

  return extension.length > 0 ? extension : ".mp4";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}