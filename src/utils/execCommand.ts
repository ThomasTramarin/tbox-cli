import { promisify } from "util";
import { exec as execCallback } from "child_process";
import chalk from "chalk";

const exec = promisify(execCallback);

export async function execCommand(
  command: string
): Promise<{ stdout: string; stderr: string }> {
  try {
    const { stdout, stderr } = await exec(command);
    return { stdout, stderr };
  } catch (error) {
    console.error(chalk.red(`Error executing command: ${error}`));
    throw error;
  }
}
