import { Argv, Options, PositionalOptions, Arguments } from "yargs";
import { Logger } from "../model/logger";

export type CommandSetting = {
  name: string | string[];
  description?: string;
  desc?: string;

  help?: {
    usage?: string;
    example?: {
      command: string;
      desc?: string;
      description?: string;
    };
    epilog?: string;
  };

  option?: { [name: string]: Options };
  demandOption?: string[];

  subcommand?: { require?: { [name: string]: PositionalOptions }; optional?: { [name: string]: PositionalOptions } };

  action: (log: Logger, argv: Arguments) => void;
};
