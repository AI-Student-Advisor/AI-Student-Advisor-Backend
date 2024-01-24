import { DEBUG_MODE } from "../App";

// ----------------------------
// Debugging Loggers

export const dlog = {
  msg: (message: string) => {
    if (DEBUG_MODE) {
      console.log("DLOG: ", message);
    }
  },
};
