# Aliases

Tbox aliases are shortcuts that let you define custom commands or command sequences.
Instead of typing long or complex commands repeatedly, you can create an alias and run it with a short name.

## Menu

- [What are Aliases?](#what-are-aliases)
- [Where aliases are stored?](#where-aliases-are-stored)
- [Alias Object Structure](#alias-object-structure)
- [Commands](#commands)

## What are Aliases?

Aliases map a **name** to a **command string** and optionally a **description**.
When you invoke an alias name in tbox, it automatically replaces it with the associated command(s).
Example:
Define alias `tmc` for `template create` so you can just run `tbox tmc <template_name>`

## Where aliases are stored?

- Aliases are saved in the configuration folder at `~/.tbox/aliases.json`
- The file stores all aliases as JSON objectswith name, command, and optional description.

## Alias Object Structure

The aliases file looks like this:

```json
{
  "aliases": {
    "tmc": {
      "command": "template create",
      "description": "Create a template shortcut"
    },
    "tml": {
      "command": "template list"
    }
  }
}
```

## Commands

### List Aliases

List all saved aliases.

```bash
tbox alias list [-v|--verbose]
```

- `-v, --verbose`: When this option is used, the command will also show the description for each alias, giving you more detailed information about what the alias does.

### Create Alias

Create a new alias

```bash
tbox alias create <name> <command> [description]
```

- `<name>`: Alias name (no spaces).
- `<command>`: The command to run (without specifying tbox)
- `[description]`: Optional description to explain the alias.

Example:

```bash
tbox alias create tml "template list" "Show available templates"
```

### Delete Alias

Delete one or more aliases by name

```bash
tbox alias delete <names...> [-a|--all]
```

- `<names...>`: The names of aliases you want to delete (separated by spaces)
- `-a, --all`: Delete all aliases.

Examples:

```bash
tbox alias delete tmc
tbox alias delete tmc tml tmd
tbox alias delete --all
```

### Edit Alias

Edit an existing alias

```bash
tbox alias edit <name>
```

This opens a prompt too modify the alias command and description

Example:

```bash
tbox alias edit tml
```
