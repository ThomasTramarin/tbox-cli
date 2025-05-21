#!/usr/bin/env node
import { Command } from "commander";

const program = new Command();

program
  .name("tbox")
  .description("CLI tool for templates and project scaffolding")
  .version("1.0.0");

program
  .command("test")
  .description("test command")
  .action(() => {
    console.log("test");
  });

program.parse();
