import { readFile } from "node:fs/promises";

export interface Completion{
  "claimed:1": number;
  "timestamp:4": number;
  "uuid:8": string;
}

export interface Quest {
  "questID:3": number;
  "completed:9": Record<string, Completion>;
  "tasks:9": Record<string, unknown>;
}

export interface QuestProgressFile {
  "questProgress:9": Record<string, Quest>;
}

export async function readQuestFile(filePath: string): Promise<QuestProgressFile> {

  if (!filePath) { filePath = "QuestProgress.json" }
  // Read the raw data from the quest file
  try {
    const data = await readFile(filePath, "utf-8"); 
    return parseQuestData(data);
  } catch (error) {
    console.error(`Error reading quest file: ${error}`);
    throw error;
  }
}

function parseQuestData(data: string): QuestProgressFile {
  try {
    const parsedData = JSON.parse(data);
    return parsedData;
  } catch (error) {
    console.error(`Error parsing quest data: ${error}`);
    throw error;
  }   
}
