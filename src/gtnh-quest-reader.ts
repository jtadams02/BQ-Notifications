import { readFile } from "node:fs/promises";

export interface Name {
    "name:8": string;
    "uuid:8": string;
    "isOP:1": number;
}

export interface NameCache {
    "nameCache:9": Record<string, Name>;
}

interface Completion {
    "timestamp:4": number;
    "claimed:1": number;
    "uuid:8": string;
}

interface QuestProgress {
    "questIDHigh:4": bigint;
    "questIDLow:4": bigint;
    "completed:9": Record<string, Completion>;
}

interface QuestProgressFile {
    "questProgress:9": Record<string, QuestProgress>;
}

interface PlayerQuestData {
    name: string;
    uuid: string;
    questProgress: QuestProgressFile;
}

export async function readQuestFile(betterQuestFolderPath: string): Promise<PlayerQuestData[]> {
    // First gather names from the NameCache.json file 
    const [uuids, names] = await readNameCache(`${betterQuestFolderPath}/NameCache.json`);
    const playerData: PlayerQuestData[] = [];
    for (let i = 0; i < uuids.length; i++) {
        const playerProgressPath = `${betterQuestFolderPath}/QuestProgress/${uuids[i]}.json`;
        const playerQuestData = await parseQuestData(playerProgressPath);
        if (playerQuestData) {
            playerData.push({
            name: names[i]!,
            uuid: uuids[i]!,
            questProgress: playerQuestData
            });
        }
    }

    return playerData;
}


async function readNameCache(nameCacheFilePath: string): Promise<[string[], string[]]> {
    const data = await readFile(nameCacheFilePath, "utf-8");
    const nameCache: NameCache = JSON.parse(data);

    const uuidList: string[] = [];
    const nameList: string[] = [];
    for (const entry of Object.values(nameCache["nameCache:9"])) {
        uuidList.push(entry["uuid:8"]);
        nameList.push(entry["name:8"]);
    }

    return [uuidList, nameList];
}

async function parseQuestData(questDataFilePath: string): Promise<QuestProgressFile | null> {
    try {
        const data = await readFile(questDataFilePath, "utf-8");
        return JSON.parse(data, (key, value, context?: any) => {
        if (key === "questIDHigh:4" || key === "questIDLow:4") {
            return BigInt(context.source);
        }
        return value;
    });
    } catch (error) {
        if (error instanceof Error && "code" in error && error.code === "ENOENT") {
            return null;
        }
        console.error(`Error reading quest data file at ${questDataFilePath}:`, error);
    }

    return null;
    
}
