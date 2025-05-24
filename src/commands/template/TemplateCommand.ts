import { Command } from "commander";
import path from "path";
import fs from "fs";
import chalk from "chalk";
import { TBOX_FOLDER_PATH } from "../../constants.js";
import inquirer from "inquirer";
import { getConfig } from "../../utils/config.js";
import { getPlaceholders, Type } from "./parser.js";
import { exec } from "child_process";
import { replacePlaceholders } from "./processor.js";

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
    const templatePath = path.join(
      TBOX_FOLDER_PATH,
      "templates",
      `${name}.tmpl`
    );

    if (!fs.existsSync(templatePath)) {
      console.log(chalk.red(`Template ${name} not found`));
      return;
    }

    const content = fs.readFileSync(templatePath, "utf-8");

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

    // If the file exists, ask for overwrite
    if (fs.existsSync(filename)) {
      const { confirm } = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirm",
          message: `File ${filename} already exists. Overwrite?`,
          default: false,
        },
      ]);

      if (!confirm) {
        console.log(chalk.red(`File ${filename} not overwritten`));
        return;
      }
    }

    fs.writeFileSync(filename, replacedContent, "utf-8");
    console.log(chalk.green(`Template ${name} applied to ${filename}`));
  }

  static async read(name: string) {
    const templatePath = path.join(
      TBOX_FOLDER_PATH,
      "templates",
      `${name}.tmpl`
    );

    if (!templatePath) {
      console.log(chalk.red(`Template ${name} not found`));
      return;
    }

    const content = fs.readFileSync(templatePath, "utf-8");

    console.log(chalk.bold.blue(`\nTemplate ${name}: `));
    console.log(content + "\n");
  }

  static async create(name: string, options: { edit?: boolean }) {
    const templatePath = path.join(
      TBOX_FOLDER_PATH,
      "templates",
      `${name}.tmpl`
    );

    // Check if template already exists
    if (fs.existsSync(templatePath)) {
      console.log(chalk.red(`Template ${name} already exists`));
      return;
    }

    fs.writeFileSync(templatePath, "");

    if (!options.edit) {
      console.log(chalk.green(`Template ${name} created successfully`));
      return;
    }

    const { editor } = getConfig();

    const editorCommand = `${editor} ${templatePath}`;

    exec(editorCommand, (error, stdout, stderr) => {
      if (error) {
        console.log(chalk.red(`Error opening editor: ${error.message}`));
        return;
      }

      console.log(chalk.green(`Template ${name} created successfully`));
    });
  }

  static async list() {
    const templates = fs.readdirSync(path.join(TBOX_FOLDER_PATH, "templates"));

    if (templates.length === 0) {
      console.log(chalk.red("No templates found"));
      return;
    }

    console.log(chalk.bold.blue("\nAvailable templates:"));
    for (const template of templates) {
      console.log(chalk.green(" - " + template.replace(".tmpl", "")));
    }
  }

  static async delete(name: string) {
    const templatePath = path.join(
      TBOX_FOLDER_PATH,
      "templates",
      `${name}.tmpl`
    );

    if (!fs.existsSync(templatePath)) {
      console.log(chalk.red(`Template ${name} not found`));
      return;
    }

    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: `Delete template ${name}?`,
        default: false,
      },
    ]);

    if (!confirm) {
      console.log(chalk.red(`Template ${name} not deleted`));
      return;
    }

    fs.unlinkSync(templatePath);
    console.log(chalk.green(`Template ${name} deleted successfully`));
  }

  static async edit(name: string) {
    const templatePath = path.join(
      TBOX_FOLDER_PATH,
      "templates",
      `${name}.tmpl`
    );

    if (!fs.existsSync(templatePath)) {
      console.log(chalk.red(`Template ${name} not found`));
      return;
    }

    const { editor } = getConfig();

    const editorCommand = `${editor} ${templatePath}`;

    exec(editorCommand, (error, stdout, stderr) => {
      if (error) {
        console.log(chalk.red(`Error opening editor: ${error.message}`));
        return;
      }

      console.log(chalk.green(`Template ${name} edited successfully`));
    });
  }
}
