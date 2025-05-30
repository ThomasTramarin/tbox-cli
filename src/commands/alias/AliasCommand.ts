import { Command } from "commander";
import { getConfig } from "../../config/configService.js";
import chalk from "chalk";
import inquirer from "inquirer";
import { getAliases, writeAliases } from "../../config/aliasService.js";

export class AliasCommand {
  static register(program: Command) {
    const alias = program
      .command("alias")
      .description("Manage aliases for commands");

    alias
      .command("list")
      .option("-v, --verbose", "Verbose output")
      .description("List all aliases")
      .action(AliasCommand.list);

    alias
      .command("create <name> <command> [description]")
      .description("Create a new alias")
      .action(AliasCommand.create);

    alias
      .command("delete [names...]")
      .option("-a, --all", "Delete all aliases")
      .description("Delete an alias")
      .action(AliasCommand.delete);

    alias
      .command("edit <name>")
      .description("Edit an alias")
      .action(AliasCommand.edit);
  }

  static async list(options: { verbose?: boolean }) {
    const { aliases } = await getAliases();
    const entries = Object.entries(aliases);

    if (entries.length === 0) {
      console.log(chalk.yellow("No aliases defined."));
      return;
    }

    console.log(chalk.bold.blue("Available Aliases:"));
    for (const [key, { command, description }] of entries) {
      if (options.verbose) {
        console.log(
          `${chalk.gray.dim("-")} ${chalk.bold.white(key)}: ${chalk.green(
            command
          )} (${chalk.italic.gray(description || "no description")})`
        );
      } else {
        console.log(
          `${chalk.gray.dim("-")} ${chalk.bold.white(key)}: ${chalk.green(
            command
          )}`
        );
      }
    }
  }

  static async create(name: string, command: string, description?: string) {
    try {
      const { aliases } = await getAliases();

      if (aliases[name]) {
        console.log(chalk.red(`Alias ${name} already exists`));
        return;
      }

      aliases[name] = { command, description };
      await writeAliases({ aliases });

      console.log(chalk.green(`Alias ${name} created successfully`));
    } catch (error: any) {
      console.log(chalk.red(`Error creating alias: ${error.message || error}`));
    }
  }

  static async delete(names: string[], options: { all?: boolean }) {
    try {
      let { aliases } = await getAliases();

      if (options.all) {
        aliases = {};
        await writeAliases({ aliases });
        console.log(chalk.green("Deleted all aliases."));
        return;
      }

      if (!names.length) {
        console.log(chalk.yellow("No alias names provided for deletion."));
        return;
      }

      let deletedCount = 0;

      for (const name of names) {
        if (!aliases[name]) {
          console.log(chalk.red(`Alias ${name} does not exist`));
          continue;
        }
        delete aliases[name];
        deletedCount += 1;
      }

      await writeAliases({ aliases });
      console.log(
        chalk.green(
          `Deleted ${deletedCount} alias${deletedCount !== 1 ? "es" : ""}.`
        )
      );
    } catch (error: any) {
      console.log(
        chalk.red(`Error deleting alias(es): ${error.message || error}`)
      );
    }
  }

  static async edit(name: string) {
    try {
      const { aliases } = await getAliases();

      if (!aliases[name]) {
        console.log(chalk.red(`Alias ${name} does not exist`));
        return;
      }

      const answer = await inquirer.prompt([
        {
          type: "input",
          name: "command",
          message: "Command:",
          default: aliases[name].command,
        },
        {
          type: "input",
          name: "description",
          message: "Description:",
          default: aliases[name].description,
        },
      ]);

      aliases[name] = { ...aliases[name], ...answer };
      await writeAliases({ aliases });

      console.log(chalk.green(`Alias ${name} updated successfully.`));
    } catch (error: any) {
      console.log(chalk.red(`Error editing alias: ${error.message || error}`));
    }
  }
}
