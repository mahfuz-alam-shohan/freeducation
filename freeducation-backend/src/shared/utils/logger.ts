type LogMeta = Record<string, unknown> | undefined;

class Logger {
  info(message: string, meta?: LogMeta): void {
    if (meta) {
      console.log(message, meta);
    } else {
      console.log(message);
    }
  }

  warn(message: string, meta?: LogMeta): void {
    if (meta) {
      console.warn(message, meta);
    } else {
      console.warn(message);
    }
  }

  error(message: string, meta?: LogMeta): void {
    if (meta) {
      console.error(message, meta);
    } else {
      console.error(message);
    }
  }
}

export const logger = new Logger();
