import { readFile } from "node:fs/promises";

const nameMap = new Map<string, string>();


interface NameCacheEntry {
    "uuid:8": string;
    "name:8": string;
    "isOP:1": number;
}

interface NameCacheFile {
    "nameCache:9": Record<string, NameCacheEntry>;
}

export async function getNameFromUUID(nameFilePath: string, uuid: string): Promise<string> {
    if (nameMap.has(uuid)) {
        return nameMap.get(uuid)!;
    } else {
        const data = await readFile(nameFilePath, "utf-8");
        const nameData: NameCacheFile = JSON.parse(data);
        
        for (const entry of Object.values(nameData["nameCache:9"])) {
            nameMap.set(entry["uuid:8"], entry["name:8"]);
        }
    }
    return nameMap.get(uuid)!;
}