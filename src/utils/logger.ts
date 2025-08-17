// src/utils/logger.ts

type LogLevel = "info" | "warn" | "error" | "debug";

class Logger {
  private formatMessage(level: LogLevel, message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    let log = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    if (meta) {
      log += ` | ${JSON.stringify(meta)}`;
    }
    return log;
  }

  info(message: string, meta?: any) {
    console.log(this.formatMessage("info", message, meta));
  }

  warn(message: string, meta?: any) {
    console.warn(this.formatMessage("warn", message, meta));
  }

  error(message: string, meta?: any) {
    console.error(this.formatMessage("error", message, meta));
  }

  debug(message: string, meta?: any) {
    if (process.env.NODE_ENV === "development") {
      console.debug(this.formatMessage("debug", message, meta));
    }
  }
}

const logger = new Logger();
export default logger;
