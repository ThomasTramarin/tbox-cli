# ⚡ Aliases

TBox supports custom aliases to speed up your workflow by shortening commands.

## Menu

- [How it works](#how-it-works)
- [Example](#example)
- [Notes](#notes)

## How it works

Aliases are defined in your `~/.tbox/config.json`, under the `aliases` field

```json
{
  "aliases": {
    "tmc": "template create",
    "tmu": "template use"
  }
}
```

## Example

Intead of typing:

```bash
tbox template create my-template
```

Tou can just run:

```bash
tbox tmc my-template
```

## Notes

- Aliases are replaced before command parsing.
- You can pass arguments as usual
