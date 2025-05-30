import { Command } from "commander";
import chalk from "chalk";
import fs from "fs/promises";
import { TBOX_FOLDER_PATH } from "../../constants.js";
import inquirer from "inquirer";
import { getConfig } from "../../config/configService.js";
import { getPlaceholders, Type } from "./parser.js";
import { replacePlaceholders } from "./processor.js";
import path from "path";
import { fileExists } from "../../utils/fileHelpers.js";
import { confirmPrompt } from "../../utils/inquirerUtils.js";
import { execCommand } from "../../utils/execCommand.js";

export class TemplateCommand {
  static register(program: Command) {
    const template = program
      .command("template")
      .description("Manage templates");

    template
      .command("create <name>")
      .option("-e, --edit", "Open editor to edit template")
      .description("Create a new template")
      .action(TemplateCommand.create);

    template
      .command("use <name> <filename>")
      .description("Use a template")
      .action(TemplateCommand.use);

    template
      .command("read <name>")
      .description("Read the content of a template")
      .action(TemplateCommand.read);

    template
      .command("list")
      .description("List all templates")
      .action(TemplateCommand.list);

    template
      .command("delete <name>")
      .description("Delete a template")
      .action(TemplateCommand.delete);

    template
      .command("edit <name>")
      .description("Edit a template")
      .action(TemplateCommand.edit);
  }

  static async use(name: string, filename: string) {
    try {
      const templatePath = path.join(
        TBOX_FOLDER_PATH,
        "templates",
        `${name}.tmpl`
      );

      if (!(await fileExists(templatePath))) {
        console.log(chalk.red(`Template ${name} not found`));
        return;
      }

      const content = await fs.readFile(templatePath, "utf-8");

      const placeholders = getPlaceholders(content);

      const variables = placeholders.filter(
        (p) => p && p?.type === Type.Variable
      );

      const answers = await inquirer.prompt(
        variables.map((p) => ({
          type: "input",
          name: p.key,
          message: p.key,
          default: p.defaultValue,
        }))
      );

      const replacedContent = replacePlaceholders(content, answers);

      if (await fileExists(filename)) {
        const confirm = await confirmPrompt(
          `File ${filename} already exists. Overwrite?`
        );
        if (!confirm) {
          console.log(chalk.red(`File ${filename} not overwritten`));
          return;
        }
      }

      await fs.writeFile(filename, replacedContent, "utf-8");
      console.log(
        chalk.green(`Template ${name} applied successfully to ${filename}`)
      );
    } catch (error: any) {
      console.log(chalk.red(`Error using template: ${error.message || error}`));
    }
  }

  static async read(name: string) {
    try {
      const templatePath = path.join(
        TBOX_FOLDER_PATH,
        "templates",
        `${name}.tmpl`
      );

      if (!templatePath) {
        console.log(chalk.red(`Template ${name} not found`));
        return;
      }

      const content = await fs.readFile(templatePath, "utf-8");

      console.log(chalk.bold.blue(`\nTemplate ${name}: `));
      console.log(content + "\n");
    } catch (error: any) {
      console.log(
        chalk.red(`Error reading template: ${error.message || error}`)
      );
    }
  }

  static async create(name: string, options: { edit?: boolean }) {
    try {
      const templatePath = path.join(
        TBOX_FOLDER_PATH,
        "templates",
        `${name}.tmpl`
      );

      // Check if template already exists
      if (await fileExists(templatePath)) {
        console.log(chalk.red(`Template ${name} already exists`));
        return;
      }

      fs.writeFile(templatePath, "");

      console.log(chalk.green(`Template ${name} created successfully`));

      if (options.edit) {
        const { editor } = await getConfig();

        const editorCommand = `${editor} ${templatePath}`;

        const { stderr, stdout } = await execCommand(editorCommand);

        if (stderr) {
          console.log(chalk.red(`Error opening editor: ${stderr}`));
          return;
        }

        console.log(chalk.green(`Template ${name} edited successfully`));
      }
    } catch (error: any) {
      console.log(
        chalk.red(`Error creating template: ${error.message || error}`)
      );
    }
  }

  static async list() {
    try {
      const templates = await fs.readdir(
        path.join(TBOX_FOLDER_PATH, "templates")
      );

      if (templates.length === 0) {
        console.log(chalk.red("No templates found"));
        return;
      }

      console.log(chalk.bold.blue("\nAvailable templates:"));
      for (const template of templates) {
        console.log(
          chalk.green(
            chalk.gray.dim(" - ") +
              chalk.white.bold(template.replace(".tmpl", ""))
          )
        );
      }
    } catch (error: any) {
      console.log(
        chalk.red(`Error listing templates: ${error.message || error}`)
      );
    }
  }

  static async delete(name: string) {
    try {
      const templatePath = path.join(
        TBOX_FOLDER_PATH,
        "templates",
        `${name}.tmpl`
      );

      if (!(await fileExists(templatePath))) {
        console.log(chalk.red(`Template ${name} not found`));
        return;
      }

      const confirm = await confirmPrompt(`Delete template ${name}?`);
      if (!confirm) {
        console.log(chalk.red(`Template ${name} not deleted`));
        return;
      }

      await fs.unlink(templatePath);
      console.log(chalk.green(`Template ${name} deleted successfully`));
    } catch (error: any) {
      console.log(
        chalk.red(`Error deleting template: ${error.message || error}`)
      );
    }
  }

  static async edit(name: string) {
    try {
      const templatePath = path.join(
        TBOX_FOLDER_PATH,
        "templates",
        `${name}.tmpl`
      );

      if (!(await fileExists(templatePath))) {
        console.log(chalk.red(`Template ${name} not found`));
        return;
      }

      const { editor } = await getConfig();

      const editorCommand = `${editor} ${templatePath}`;

      const { stderr, stdout } = await execCommand(editorCommand);

      if (stderr) {
        console.log(chalk.red(`Error opening editor: ${stderr}`));
        return;
      }

      console.log(chalk.green(`Template ${name} edited successfully`));
    } catch (error: any) {
      console.log(
        chalk.red(`Error editing template: ${error.message || error}`)
      );
    }
  }
}
