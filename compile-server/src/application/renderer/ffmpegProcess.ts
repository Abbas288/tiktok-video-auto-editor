import { spawn } from "node:child_process";

export interface ProcessResult {
  stdout: string;
  stderr: string;
}

export interface RunProcessOptions {
  timeoutMs: number;
}

/**
 * Error thrown when an FFmpeg or FFprobe process fails.
 */
export class MediaProcessError extends Error {
  public readonly stderr: string;

  public constructor(message: string, stderr: string) {
    super(message);
    this.name = "MediaProcessError";
    this.stderr = stderr;
  }
}

/**
 * Runs a media process and resolves when it exits successfully.
 *
 * @param command Executable command.
 * @param args Command arguments.
 * @param options Process execution options.
 * @returns Captured process output.
 */
export function runMediaProcess(
  command: string,
  args: string[],
  options: RunProcessOptions,
): Promise<ProcessResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });

    const stdoutChunks: string[] = [];
    const stderrChunks: string[] = [];

    const timeout = setTimeout(() => {
      child.kill("SIGKILL");
      reject(
        new MediaProcessError(
          `${command} timed out after ${options.timeoutMs} ms.`,
          stderrChunks.join(""),
        ),
      );
    }, options.timeoutMs);

    child.stdout.on("data", (chunk: Buffer) => {
      stdoutChunks.push(chunk.toString());
    });

    child.stderr.on("data", (chunk: Buffer) => {
      stderrChunks.push(chunk.toString());
    });

    child.on("error", (error) => {
      clearTimeout(timeout);
      reject(
        new MediaProcessError(
          `Could not start ${command}: ${error.message}`,
          stderrChunks.join(""),
        ),
      );
    });

    child.on("close", (code) => {
      clearTimeout(timeout);

      const stdout = stdoutChunks.join("");
      const stderr = stderrChunks.join("");

      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }

      reject(
        new MediaProcessError(
          `${command} exited with code ${code}.`,
          stderr,
        ),
      );
    });
  });
}
