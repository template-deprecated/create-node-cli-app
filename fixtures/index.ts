import { log } from "./src/model/logger";
import yargs, { Argv, Arguments } from "yargs";
import { CommandSetting } from "./src/command/_type";
import * as CommandIndex from "./src/command";
import HelpIndex from "./src/help";
import OptionIndex from "./src/option";

export type CommandFn = (yargs: Argv, log: Logger) => Argv;

log._set({
  console: {
    color: {
      format: "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})",
      dateformat: "HH:MM:ss.L"
    }
  }
});

// Command setting

yargs
  .help("h")
  .alias("h", "help")
  .showHelpOnFail(true, "Invalid command or option")
  .usage(HelpIndex.usage)
  .example(HelpIndex.example.command, HelpIndex.example.desc || HelpIndex.example.description || "")
  .epilog(HelpIndex.epilog);

if (HelpIndex.strict) yargs.strict();

// Global setting

yargs.option(OptionIndex);

// Subcommand setting

const commands = CommandIndex as { [key: string]: CommandSetting };
Object.keys(commands).forEach(value => {
  const command = commands[value] as CommandSetting;

  yargs.command({
    command: (() => {
      if (!command.subcommand) return command.name;
      let result = "";
      if (command.subcommand.require)
        result += Object.keys(command.subcommand.require).reduce((p, c) => {
          return p + `<${c}> `;
        }, "");

      if (command.subcommand.optional)
        result += Object.keys(command.subcommand.optional).reduce((p, c) => {
          return p + `[${c}] `;
        }, "");

      return `${command.name} ${result.trim()}`;
    })(),
    describe: command.desc || command.description,
    builder: (argv: Argv) => {
      if (command.option) {
        Object.keys(command.option).forEach(name => {
          if (command.option) argv.option(name, command.option[name]);
        });
      }

      if (command.demandOption) argv.demandOption(command.demandOption);

      if (command.subcommand) {
        if (command.subcommand.require) {
          Object.keys(command.subcommand.require).forEach(name => {
            if (command.subcommand && command.subcommand.require)
              argv.positional(name, command.subcommand.require[name]);
          });
        }

        if (command.subcommand.optional) {
          Object.keys(command.subcommand.optional).forEach(name => {
            if (command.subcommand && command.subcommand.optional)
              argv.positional(name, command.subcommand.optional[name]);
          });
        }
      }

      if (command.help) {
        if (command.help.usage) argv.usage(command.help.usage);
        if (command.help.example)
          argv.example(
            command.help.example.command,
            command.help.example.desc || command.help.example.description || ""
          );
        if (command.help.epilog) argv.epilog(command.help.epilog);
      }

      return argv;
    },
    handler: (argv: Arguments) => command.action(log, argv)
  });
});

const _ = yargs.argv;
