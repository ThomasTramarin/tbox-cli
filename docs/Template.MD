# Templates

Tbox templates are reusable text/code snippets with support for variables, comments, and built-in functions.
They let you quickly generate files or content based on predefined patterns, speeding up your workflow.

## Menu

- [Template Syntax and Placeholders](#template-syntax-and-placeholders)
- [Where templates are saved](#where-templates-are-saved)
- [Example Template with Placeholders](#example-template-with-placeholders)
- [Commands](#commands)

## Template Syntax and Placeholders

Tbox templates use `{{...}}` delimiters for placeholders, and they support these three types:

- **Variables**:
  `{{variable}}` or `{{variable=default}}`
  Define a variable with an optional default value.
  Example: `{{username=guest}}`: if the value is omitted, the content will be the default

- **Built-in placeholders**:
  Start with double underscores `__`
  Syntax: `{{__functionName}}`
  These are special functions replaced automatically at runtime.
  Available placeholders:
- `{{__year}}`: current year
- `{{__uuid}}`: generate a UUID

- **Comments**:
  Start with an exclamation mark `!`
  Syntax: `{{! This is a comment}}`
  Ignored when generating output.

## Where templates are saved

- Templates are stored inside the config folder: `~/.tbox/templates/`
- Each template is saved as a plain text file with the `.tmpl` extension. Example: `html.tmpl`

## Example Template with Placeholders

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>{{title=My Page}}</title>
  <meta name="author" content="{{author=Anonymous}}" />
  {{! This is a comment and will be ignored }}
</head>
<body>
  <h1>Welcome, {{username}}!</h1>
  <p>Your unique session ID is: {{__uuid}}</p>
</body>
</html>
```

## Commands

### Create a Template

Create a new template. Use `-e` to open it immediately in the configured editor.

```bash
tbox template create <template-name> [-e]
```

Example:

```bash
tbox template create html -e
```

### List Templates

Show all saved templates.

```bash
tbox template list
```

### Use a Template

Generate output from a template, replacing variables as needed.

```bash
tbox template use <template-name> <output-file>
```

Example:

```bash
tbox template use html index.html
```

### Delete a Template

Remove a saved template permanently.

```bash
tbox template delete <template-name>
```

Example:

```bash
tbox template delete html
```

### Edit a Template

Open an existing template in the configured editor

```bash
tbox template edit <template-name>
```

Example:

```bash
tbox template edit html
```
