import { processQuests } from "./quest-tracking.js";
import { processGTNHQuests } from "./gtnh-quest-tracker.js";
import { startLogForwarder } from "./log-forwarder.js";
import { setTimeout } from "node:timers/promises";
import "dotenv/config";

if (process.env.MinecraftLogFilePath) {
  startLogForwarder(process.env.MinecraftLogFilePath, process.env.NotificationAddress!, process.env.ServerType!);
}

const serverType = process.env.ServerType!


while (true) {
  try {
    if (serverType != null && serverType.toLowerCase() === "gtnh") {
      await processGTNHQuests(
        process.env.BetterQuestFolderPath!,
        process.env.NotificationAddress!,
      );
    } else {
      await processQuests(
        process.env.BetterQuestFilePath!,
        process.env.NameCacheFilePath!,
        process.env.LangFilePath!,
        process.env.NotificationAddress!
      );
    }
  } catch (error) {
    console.error("Failed to process quests:", error);
  }

  await setTimeout(2500);
}
