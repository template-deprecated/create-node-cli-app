import { CommandSetting } from "./_type";
import { Logger } from "../model/logger";
import { Arguments } from "yargs";
import prompts = require("prompts");

export default {
  name: "prompts",
  desc: "Example of prompt",
  action: async (log: Logger, _: Arguments) => {
    log.info("Start command prompts");

    let questions = [
      {
        type: "text",
        name: "dish",
        message: "Do you like pizza?"
      },
      {
        type: "select",
        name: "value",
        message: "Pick a color",
        choices: [
          { title: "Red", value: "#ff0000" },
          { title: "Green", value: "#00ff00" },
          { title: "Blue", value: "#0000ff" }
        ]
      }
    ];

    let response = await prompts(questions);

    console.log(response);
  }
} as CommandSetting;
