import { builtInFunctions } from "./builtins.js";

export const replacePlaceholders = (
  content: string,
  variables: Record<string, string>,
  builtIns: Record<string, () => string> = builtInFunctions
) => {
  return content.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
    if (key.trim().startsWith("__")) {
      // Built-in: __year, __date, ecc.
      const fnName = key.replace("__", "");
      if (builtIns[fnName]) return builtIns[fnName]();
      return "";
    }

    if (key.trim().startsWith("!")) {
      // Comment: remove everything
      return "";
    }

    // Variable with default possible: "name=default"
    const [varName] = key.split("=");

    return variables[varName] ?? "";
  });
};
