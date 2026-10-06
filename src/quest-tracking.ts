import { readQuestFile } from "./quest-reader.js";
import { sendNotification } from "./notification-sender.js";
import { getNameFromUUID } from "./util/uuid-to-name.js";
import { getQuestName } from "./util/quest-name-translation.js";

let firstRun = true;
const playerCompletedQuests: Map<string, Set<number>> = new Map();


export async function processQuests(questFilePath: string, nameCacheFilePath: string, langFilePath: string, notificationAddress: string): Promise<void> {

  const questJson = await readQuestFile(questFilePath);

  for (const quest of Object.values(questJson["questProgress:9"])) {
    const completionData = quest["completed:9"];
    const questId = quest["questID:3"];

    if (Object.keys(completionData).length > 0) {
      for (const completion of Object.values(completionData)) {
        const name = await getNameFromUUID(nameCacheFilePath, completion["uuid:8"]);
        if (firstRun) {

          // Need to populate entire map on first run
          if (!playerCompletedQuests.has(name)) {
            playerCompletedQuests.set(name, new Set());
          }
          playerCompletedQuests.get(name)?.add(questId);

        } else {

          // Check if player has already completed this quest
          if (!playerCompletedQuests.get(name)?.has(questId)) {
            playerCompletedQuests.get(name)?.add(questId);
            await sendNotification(notificationAddress, name, await getQuestName(langFilePath, questId));
          }

        }

      }
    }
    // Flip the firstRun flag to false after processing the first file
    firstRun = false;
  }
}