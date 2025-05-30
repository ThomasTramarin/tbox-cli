#!/usr/bin/env node
import { Command } from "commander";
import { getConfig, setupConfig } from "./config/configService.js";
import { TemplateCommand } from "./commands/template/TemplateCommand.js";
import { AliasCommand } from "./commands/alias/AliasCommand.js";
import { getAliases } from "./config/aliasService.js";

async function main() {
  await setupConfig();

  const { aliases } = await getAliases();

  // Aliases
  const rawArgs = process.argv.slice(2);
  if (rawArgs.length > 0 && aliases[rawArgs[0]]) {
    const aliasReplacement = aliases[rawArgs[0]].command.split(" ");
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
  AliasCommand.register(program);

  program.parse(process.argv);
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
