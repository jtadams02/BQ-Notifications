import { processQuests } from "./quest-tracking.js";
import "dotenv/config";

await processQuests(
  process.env.BetterQuestFilePath!,
  process.env.NameCacheFilePath!,
  process.env.LangFilePath!,
  process.env.NotificationAddress!
);
