import Bluebird from "bluebird";
import { CommandSetting } from "./_type";
import { Logger } from "../model/logger";
import { Argv, Arguments } from "yargs";

import Listr, { ListrTaskWrapper } from "listr";
import { setTimeout } from "timers";

export default {
  name: "progress",
  desc: "example progress by listr",
  action: async (log: Logger, _: Arguments) => {
    log.debug("show logger");

    const progress = new Listr({});

    progress.add({
      title: "Setup one",
      task: (_1: any, _2: ListrTaskWrapper) => {
        return new Bluebird((res, _) => {
          return res();
        }) as any;
      }
    });

    progress.add({
      title: "Installing two",
      task: (_1: any, _2: ListrTaskWrapper) => {
        return new Bluebird((res, _) => {
          setTimeout(() => {
            return res();
          }, 1000);
        }) as any;
      }
    });

    progress.add({
      title: "Cleaning three",
      task: (_1: any, _2: ListrTaskWrapper) => {
        return new Bluebird((_, rej) => {
          setTimeout(() => {
            rej(new Error("cannot clean the result"));
          }, 300);
        }) as any;
      }
    });

    await progress.run();
  }
} as CommandSetting;
