import { watch, type FSWatcher } from "node:fs";
import readLastLines from "read-last-lines";

export function startLogForwarder(logFilePath: string, notificationAddress: string) {
  let previousContent = "";
  let watcher: FSWatcher;

  function setupWatcher() {
    watcher = watch(logFilePath, (eventType) => {
      if (eventType === "rename") {
        console.log("[Log Watcher] Log file renamed. Restarting watcher...");
        watcher.close();
        setTimeout(setupWatcher, 1000);
        return;
      }

      if (eventType !== "change") return;

      readLastLines.read(logFilePath, 1).then(async (line) => {
        if (line !== "" && line !== previousContent) {
          console.log(`[Log Watcher]: ${line}`);
          previousContent = line;

          await fetch(`http://${notificationAddress}/minecraft/logs`, {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: line,
          });
        }
      }).catch(console.error);
    });
  }

  setupWatcher();
}
