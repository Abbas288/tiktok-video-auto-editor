import { getServerConfig } from "./config";
import { createApp } from "./http/createApp";

/**
 * Starts the compile server.
 */
function startServer(): void {
  const config = getServerConfig();
  const app = createApp(config);

  app.listen(config.port, () => {
    console.log(`Compile server listening on port ${config.port}`);
  });
}

startServer();