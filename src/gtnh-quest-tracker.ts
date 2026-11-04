import { readQuestFile } from "./gtnh-quest-reader.js";
import { sendNotification } from "./notification-sender.js";
import { getQuestName } from "./util/gtnh-quest-name-translation.js";

let firstRun = true;
const playerCompletedQuests: Map<string, Set<string>> = new Map();

export async function processGTNHQuests(questFolderPath: string, notificationAddress: string): Promise<void> {
   
    const playerDataArray = await readQuestFile(questFolderPath);

    // Build a map of player names to their completed quests
    for (const playerData of playerDataArray) {
        const name = playerData.name;
        const uuid = playerData.uuid;
        const questProgress = playerData.questProgress;

        if (!playerCompletedQuests.has(name)) {
            playerCompletedQuests.set(name, new Set());
        }

        for (const quest of Object.values(questProgress["questProgress:9"])) {
            const completionData = quest["completed:9"];
            const questIdHigh = quest["questIDHigh:4"];
            const questIdLow = quest["questIDLow:4"];

            if (Object.keys(completionData).length > 0) {
                // Player has completed the quest, if this is the first run, we just populate the map, otherwise we send a notification
                const questIdSet = `${questIdHigh.toString()}:${questIdLow.toString()}`;
                if (firstRun) {
                    playerCompletedQuests.get(name)?.add(questIdSet);
                } else {
                    // Notify
                    if (!playerCompletedQuests.get(name)?.has(questIdSet)) {
                        playerCompletedQuests.get(name)?.add(questIdSet);

                        await sendNotification(notificationAddress, "gtnh", name, await getQuestName(questIdHigh, questIdLow, questFolderPath));
                    }
                }
            }
        }
    }
    firstRun = false;
}