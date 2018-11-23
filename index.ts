import { log } from "./src/model/logger";

log._set({
  console: {
    normal: {
      format: "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})",
      dateformat: "HH:MM:ss.L"
    },
    color: {
      format: "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})",
      dateformat: "HH:MM:ss.L"
    }
  }
});

console.log("Hello world");
log.log("Hello world");
log.trace("Hello trace");
log.debug("Hello debug");
log.info("Hello info");
log.warn("Hello warn");
log.error("Hello error");

log.only("color").log("Hello world");
