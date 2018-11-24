export type HelpIndexType = {
  usage: string;
  example: {
    command: string;
    desc?: string;
    description?: string;
  };
  epilog: string;
  strict: boolean;
};

export default {
  usage: "Usage: $0 hello <name> [args...]",
  example: {
    command: "$0 hello me",
    desc: "Say hello to me"
  },
  epilog: "2018©",
  strict: true
} as HelpIndexType;
