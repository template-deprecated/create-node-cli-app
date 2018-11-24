import { console, dailyfile, colorConsole, Tracer } from "tracer";
import { normalConsoleSetting, fileSetting, colorConsoleSetting } from "../config/logger";

export type LoggerType = "normal" | "color" | "file";
export type LoggingType = "log" | "trace" | "fatal" | "debug" | "info" | "warn" | "error";

export interface Logging {
  log(...args: any[]): void;
  trace(...args: any[]): void;
  debug(...args: any[]): void;
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
  fatal(...args: any[]): void;
}

export class NullLogger implements Logging {
  log(..._: any[]): void {}
  trace(..._: any[]): void {}
  debug(..._: any[]): void {}
  info(..._: any[]): void {}
  warn(..._: any[]): void {}
  error(..._: any[]): void {}
  fatal(..._: any[]): void {}
}

export class Logger implements Logging {
  private logs: { [key in LoggerType]?: Tracer.Logger };

  constructor(option?: {
    console?: { normal?: Tracer.LoggerConfig; color?: Tracer.LoggerConfig };
    file?: Tracer.DailyFileConfig;
  }) {
    this.logs = {};
    this._set(option);
  }

  _set(option?: {
    console?: { normal?: Tracer.LoggerConfig; color?: Tracer.LoggerConfig };
    file?: Tracer.DailyFileConfig;
  }) {
    const normal = (option && option.console && option.console.normal) || normalConsoleSetting;
    const color = (option && option.console && option.console.color) || colorConsoleSetting;
    const file = (option && option.file) || fileSetting;

    if (normal) this.logs.normal = console(normal);
    if (color) this.logs.color = colorConsole(color);
    if (file) this.logs.file = dailyfile(file);

    return this;
  }

  only(type: LoggerType) {
    return this.logs[type] || new NullLogger();
  }

  _all(type: LoggingType, ...args: any[]) {
    this.only("normal")[type](...args);
    this.only("color")[type](...args);
    this.only("file")[type](...args);
  }

  fatal(...args: any[]) {
    this._all("fatal", ...args);
  }

  log(...args: any[]) {
    this._all("log", ...args);
  }

  trace(...args: any[]) {
    this._all("trace", ...args);
  }

  debug(...args: any[]) {
    this._all("debug", ...args);
  }

  info(...args: any[]) {
    this._all("info", ...args);
  }

  warn(...args: any[]) {
    this._all("warn", ...args);
  }

  error(...args: any[]) {
    this._all("error", ...args);
  }

  public static CONST = new Logger();
}

export const log = Logger.CONST;
