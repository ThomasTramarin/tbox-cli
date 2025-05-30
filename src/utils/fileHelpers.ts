import chalk from "chalk";
import fs from "fs/promises";
import path from "path";

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function readJsonFIle<T>(filePath: string): Promise<T | null> {
  try {
    const json = await fs.readFile(filePath, "utf-8");
    return JSON.parse(json) as T;
  } catch (error) {
    console.log(chalk.red(`Error reading file: ${error}`));
    return null;
  }
}

export async function writeJsonFile(
  filePath: string,
  data: unknown
): Promise<void> {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.log(chalk.red(`Error writing file: ${error}`));
  }
}

export async function ensureFolderExists(folderPath: string): Promise<void> {
  try {
    await fs.mkdir(folderPath, { recursive: true });
  } catch (error) {
    console.log(chalk.red(`Error creating folder: ${error}`));
  }
}

export async function deleteFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.log(chalk.red(`Error deleting file: ${error}`));
  }
}
