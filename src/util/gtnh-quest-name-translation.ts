import { readFile } from "node:fs/promises";

interface Quest {
    "questIDHigh:4": bigint;
    "questIDLow:4": bigint;
    "properties:10": {
        "betterquesting:10" : {
            "name:8": string;
        }
    };
}

interface QuestDatabase {
    "questDatabase:9": Record<string, Quest>;
}

const questNameCache: Map<string, string> = new Map();

export async function getQuestName(questIdHigh: bigint, questIdLow: bigint, questFolderPath: string): Promise<string> {

    const questIdKey = `${questIdHigh.toString()}:${questIdLow.toString()}`;
    if (questNameCache.size === 0) {
        const data = await readFile(`${questFolderPath}/QuestDatabase.json`, "utf-8");

        const database: QuestDatabase = JSON.parse(
            data,
            (key: string, value: any, context?: any) => {
                if (key === "questIDHigh:4" || key === "questIDLow:4") {
                    return BigInt(context.source);
                }

                return value;
            }
        );

        for (const quest of Object.values(database["questDatabase:9"])) {
            const questId = `${quest["questIDHigh:4"]}:${quest["questIDLow:4"]}`;
            const questName = quest["properties:10"]["betterquesting:10"]["name:8"];

            const cleanName = questName.replace(/§[0-9a-fk-or]/gi, "");

            console.log(`Quest ID: ${questId}, Quest Name: ${cleanName}`);
            questNameCache.set(questId, cleanName);
        }
    }

    return questNameCache.get(questIdKey) || `Unknown Quest (${questIdKey})`;
}