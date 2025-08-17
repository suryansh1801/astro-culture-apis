type LogLevel = 'info' | 'warn' | 'error';

class Logger {
    private formatMessage(level: LogLevel, message: string): string {
        const timestamp = new Date().toISOString();
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    }

    info(message: string) {
        console.info(this.formatMessage('info', message));
    }

    warn(message: string) {
        console.warn(this.formatMessage('warn', message));
    }

    error(message: string) {
        console.error(this.formatMessage('error', message));
    }
}

const logger = new Logger();
export default logger;
