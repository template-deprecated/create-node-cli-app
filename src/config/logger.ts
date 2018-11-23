import { Tracer } from "tracer";

export type OptionalConfig = Tracer.LoggerConfig | undefined;

export const normalConsoleSetting: OptionalConfig = undefined;

export const colorConsoleSetting: OptionalConfig = {};

export const fileSetting: OptionalConfig = {};
