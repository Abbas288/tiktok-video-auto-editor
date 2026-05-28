import { existsSync } from "node:fs";
import path from "node:path";
import { cwd, loadEnvFile } from "node:process";
import { getServerConfig } from "./config";
import { createApp } from "./http/createApp";

/**
 * Loads local environment variables from .env during development.
 */
function loadLocalEnvironment(): void {
  const envPath = path.resolve(cwd(), ".env");

  if (existsSync(envPath)) {
    loadEnvFile(envPath);
  }
}

/**
 * Starts the compile server.
 */
function startServer(): void {
  loadLocalEnvironment();

  const config = getServerConfig();
  const app = createApp(config);

  app.listen(config.port, () => {
    console.log(`Compile server listening on port ${config.port}`);
    console.log(`Compile renderer: ${config.renderer}`);
  });
}

startServer();