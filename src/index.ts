#!/usr/bin/env node
import { Command } from "commander";
import { getConfig, setupConfig } from "./utils/config.js";
import { TemplateCommand } from "./commands/template/TemplateCommand.js";

setupConfig();

const config = getConfig();

// Aliases
const rawArgs = process.argv.slice(2);
if (rawArgs.length > 0 && config.aliases[rawArgs[0]]) {
  const aliasReplacement = config.aliases[rawArgs[0]].split(" ");
  const newArgs = [...aliasReplacement, ...rawArgs.slice(1)];
  process.argv = [...process.argv.slice(0, 2), ...newArgs];
}

const program = new Command();

program
  .name("tbox")
  .description(
    "A flexible and extensible CLI for templates, automation, scaffolding, and more."
  )
  .version("1.2.0");

TemplateCommand.register(program);

program.parse(process.argv);
