import path from "path";
import { z } from "zod";
import { DEFAULT_ALIASES, TBOX_FOLDER_PATH } from "../constants.js";
import { readJsonFIle, writeJsonFile } from "../utils/fileHelpers.js";

const aliasesSchema = z.object({
  aliases: z.record(
    z.object({
      command: z.string().min(1),
      description: z.string().min(1).optional(),
    })
  ),
});

type Aliases = z.infer<typeof aliasesSchema>;

const aliasesPath = path.join(TBOX_FOLDER_PATH, "aliases.json");

export const getAliases = async (): Promise<Aliases> => {
  const data = await readJsonFIle(aliasesPath);
  if (!data) return DEFAULT_ALIASES;

  const result = aliasesSchema.safeParse(data);
  if (!result.success) return DEFAULT_ALIASES;

  return result.data;
};

export const writeAliases = async (newContent: Aliases): Promise<void> => {
  await writeJsonFile(aliasesPath, newContent);
};
