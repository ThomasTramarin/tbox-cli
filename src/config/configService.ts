import path from "path";
import fs from "fs/promises";
import {
  DEFAULT_ALIASES,
  DEFAULT_CONFIG,
  TBOX_FOLDER_PATH,
} from "../constants.js";
import chalk from "chalk";
import { z } from "zod";
import {
  ensureFolderExists,
  fileExists,
  readJsonFIle,
  writeJsonFile,
} from "../utils/fileHelpers.js";

const configSchema = z.object({
  editor: z.string().min(1),
});

export const setupConfig = async () => {
  await ensureFolderExists(TBOX_FOLDER_PATH);
  await ensureFolderExists(path.join(TBOX_FOLDER_PATH, "templates"));

  if (!(await fileExists(path.join(TBOX_FOLDER_PATH, "aliases.json")))) {
    writeJsonFile(path.join(TBOX_FOLDER_PATH, "aliases.json"), DEFAULT_ALIASES);
  }

  if (!(await fileExists(path.join(TBOX_FOLDER_PATH, "config.json")))) {
    writeJsonFile(path.join(TBOX_FOLDER_PATH, "config.json"), DEFAULT_CONFIG);
  }
};

type Config = z.infer<typeof configSchema>;

export const getConfig = async (): Promise<Config> => {
  const configPath = path.join(TBOX_FOLDER_PATH, "config.json");

  const data = await readJsonFIle<Config>(configPath);

  if (!data) {
    console.log(chalk.red(`Error reading config file: ${configPath}`));
    return DEFAULT_CONFIG;
  }

  const result = configSchema.safeParse(data);

  if (!result.success) {
    console.log(chalk.red(`Error parsing config file: ${configPath}`));
    process.exit(1);
  }

  return result.data;
};
