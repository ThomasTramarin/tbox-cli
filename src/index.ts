#!/usr/bin/env node
import { Command } from "commander";
import { setupConfig } from "./utils/config.js";
import { TemplateCommand } from "./commands/template/TemplateCommand.js";

setupConfig();

const program = new Command();

program
  .name("tbox")
  .description("CLI tool for templates and project scaffolding")
  .version("1.0.0");

TemplateCommand.register(program);

program.parse();
