import { processQuests } from "./quest-tracking.js";
import { startLogForwarder } from "./log-forwarder.js";
import { setTimeout } from "node:timers/promises";
import "dotenv/config";

if (process.env.MinecraftLogFilePath) {
  startLogForwarder(process.env.MinecraftLogFilePath, process.env.NotificationAddress!);
}

while (true) {
  try {
    await processQuests(
      process.env.BetterQuestFilePath!,
      process.env.NameCacheFilePath!,
      process.env.LangFilePath!,
      process.env.NotificationAddress!
    );
  } catch (error) {
    console.error("Failed to process quests:", error);
  }

  await setTimeout(2500);
}
