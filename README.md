# Tbox - Versatile CLI Tool

TBox is a flexible CLI tool designed to grow with multiple commands and features.  
Currently, it supports template management with variables, comments and built in functions.

## Installation

Make sure you have Node.js installed:

```bash
node -v
npm -v
```

Then install TBox globally:

```bash
npm install -g tbox-cli
```

## Basic Usage:

```bash
tbox <mainCommand> <subcommands> <fields> [options]
```

Some examples:

```bash
tbox template create my-template -e
tbox template list
tbox template use my-template output.tsx
```

## Configuration

- Tbox creates a config folder automatically on first run: `~/.tbox/`
- This folder stores:
  - `config.json`: Main configuration file
  - `aliases.json`: Aliases configuration file
  - `templates/`: Folder with all saved templates

Example `config.json` content:

```json
{
  "editor": "code"
}
```

- `"editor"`: defines the command used to open the editor (e.g., `vim`, `code`, `nano`, `notepad`)

## Features

- [Templates](./docs/Template.MD#\menu)
- [Aliases](./docs/Alias.MD#\menu)
