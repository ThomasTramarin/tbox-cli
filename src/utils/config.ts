import os from "os";
import path from "path";
import fs from "fs";
import { TBOX_FOLDER_PATH } from "../constants.js";
import chalk from "chalk";
import { z } from "zod";

const DEFAULT_CONFIG = {
  editor: process.platform === "win32" ? "notepad" : "nano",
  aliases: {
    tmu: "template use",
    tmc: "template create",
    tme: "template edit",
    tmd: "template delete",
    tml: "template list",
  },
};

export const setupConfig = () => {
  // Create .tbox folder
  if (!fs.existsSync(TBOX_FOLDER_PATH)) {
    fs.mkdirSync(TBOX_FOLDER_PATH);
  }

  // Create templates folder
  if (!fs.existsSync(path.join(TBOX_FOLDER_PATH, "templates"))) {
    fs.mkdirSync(path.join(TBOX_FOLDER_PATH, "templates"));
  }

  // Create config file
  if (!fs.existsSync(path.join(TBOX_FOLDER_PATH, "config.json"))) {
    fs.writeFileSync(
      path.join(TBOX_FOLDER_PATH, "config.json"),
      JSON.stringify(DEFAULT_CONFIG, null, 2)
    );
  }
};

const configSchema = z.object({
  editor: z.string().min(1),
  aliases: z.record(z.string().min(1)),
});

type Config = z.infer<typeof configSchema>;

export const getConfig = (): Config => {
  const configPath = path.join(TBOX_FOLDER_PATH, "config.json");

  // Read config file
  let raw: string;
  try {
    raw = fs.readFileSync(configPath, "utf-8");
  } catch {
    console.log(chalk.red("Cannot read config file, using default."));
    return DEFAULT_CONFIG;
  }

  // Parse config file
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.log(chalk.red("Invalid JSON in config."));
    process.exit(1);
  }

  // Validate config file
  const result = configSchema.safeParse(parsed);

  if (!result.success) {
    console.log(chalk.red("Config validation failed."));
    process.exit(1);
  }

  return result.data;
};
