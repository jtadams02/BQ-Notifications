import { processQuests } from "./quest-tracking.js";
import { startLogForwarder } from "./log-forwarder.js";
import "dotenv/config";

if (process.env.MinecraftLogFilePath) {
  startLogForwarder(process.env.MinecraftLogFilePath, process.env.NotificationAddress!);
}

await processQuests(
  process.env.BetterQuestFilePath!,
  process.env.NameCacheFilePath!,
  process.env.LangFilePath!,
  process.env.NotificationAddress!
);
