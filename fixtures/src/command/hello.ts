import { Logger } from "../model/logger";
import { CommandSetting } from "./_type";
import { Arguments } from "yargs";

export default {
  name: "hello",
  subcommand: { require: { name: { desc: "person name" } } },
  description: "Show hello to person name",
  option: { world: { alias: "w", desc: "Hello to all people in the world", type: "boolean" } },
  action: (log: Logger, argv: Arguments) => {
    log.log(`Hello to ${argv.name} with (world=${argv.world})`);
  },
  help: {
    example: {
      command: "$0 hello me",
      desc: "Hello to me"
    }
  }
} as CommandSetting;
