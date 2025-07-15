type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "silent";

interface Logger {
  trace: (message: string, ...args: unknown[]) => void;
  debug: (message: string, ...args: unknown[]) => void;
  info: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
  setLevel: (level: LogLevel) => void;
}

class SimpleLogger implements Logger {
  private static levels: Record<LogLevel, number> = {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
    silent: 5,
  };

  private currentLevel: number;

  constructor(level: LogLevel = "info") {
    this.currentLevel = SimpleLogger.levels[level];
  }

  setLevel(level: LogLevel): void {
    this.currentLevel = SimpleLogger.levels[level];
  }

  private log(level: LogLevel, message: string, ...args: unknown[]): void {
    // Don't log if message level is below set log level
    if (SimpleLogger.levels[level] < this.currentLevel) {
      return;
    }

    // Format timestamp
    const timestamp =
      new Date().toLocaleTimeString("en-GB", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }) +
      "." +
      String(new Date().getMilliseconds()).padStart(3, "0");

    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    // Use appropriate console method
    const method =
      level === "error"
        ? "error"
        : level === "warn"
        ? "warn"
        : level === "info"
        ? "info"
        : "log";

    console[method](prefix, message, ...args);
  }

  // Public logging methods
  trace(message: string, ...args: unknown[]): void {
    this.log("trace", message, ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    this.log("debug", message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this.log("info", message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.log("warn", message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this.log("error", message, ...args);
  }
}

const level = "debug";

// Create single shared instance of logger
const logger = new SimpleLogger(level as LogLevel);

// Expose function to get the shared instance
export function getLogger(): Logger {
  return logger;
}
