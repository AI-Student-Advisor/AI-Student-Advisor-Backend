// ----------------------------
// Debugging Loggers

import { AppConfig } from "../config/AppConfig";

export const dlog = {
  msg: (message: string) => {
    if (AppConfig.DEBUG_MODE) {
      console.log("DLOG: ", message);
    }
  },
};
