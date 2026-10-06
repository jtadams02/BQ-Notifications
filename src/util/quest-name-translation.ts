import { readFile } from "node:fs/promises";

const questNames = new Map<number, string>();

export async function getQuestName(langFilePath: string, questId: number): Promise<string> {
  if (questNames.size === 0) {
    await populateQuestNames(langFilePath);
  }
  return questNames.get(questId)!
}

async function populateQuestNames(langFilePath: string) {

  const text = await readFile(langFilePath, "utf-8");

  for (const line of text.split("\n")) {
    const splitLine = line.split(".");

    if (splitLine[4]?.startsWith("title") && splitLine[2] == "db") {

      const questId = parseInt(splitLine[3]!);
      const firstEqualIndex = line.indexOf("=");
      const questName = line.slice(firstEqualIndex + 1).trim();

      console.log(`Quest ID: ${questId}, Quest Name: ${questName}`);

      questNames.set(questId, questName);
    }

  }

}

