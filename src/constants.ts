import path from "path";
import os from "os";

export const TBOX_FOLDER_PATH = path.resolve(os.homedir(), ".tbox");
export const DEFAULT_CONFIG = {
  editor: process.platform === "win32" ? "notepad" : "nano",
};

export const DEFAULT_ALIASES = {
  aliases: {
    tmc: {
      command: "template create",
      description: "Create a new template",
    },
  },
};
