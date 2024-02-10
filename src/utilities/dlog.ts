// ----------------------------
// Debugging Loggers
import { AppConfig } from "/config/AppConfig.js";

export const dlog = {
  msg: (message: string) => {
    if (AppConfig.DEBUG_MODE) {
      console.log("DLOG: ", message);
    }
  },
  err: (message: string) => {
    if (AppConfig.DEBUG_MODE) {
      console.error("DLOG: ", message);
    }
  },
  warn: (message: string) => {
    if (AppConfig.DEBUG_MODE) {
      console.warn("DLOG: ", message);
    }
  },
  dir: (obj: any) => {
    if (AppConfig.DEBUG_MODE) {
      console.dir(obj);
    }
  }
};
