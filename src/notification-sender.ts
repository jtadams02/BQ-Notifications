
export async function sendNotification(notificationAddress: string, playerName: string, questName: string): Promise<void> {

  const response = await fetch(`http://${notificationAddress}/notify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({playerName, questName}),
    signal: AbortSignal.timeout(5000) // Set a timeout of 5 seconds
  });

  if (!response.ok) {
    console.error(`Failed to send notification for player ${playerName} and quest ${questName}. Status: ${response.status}`);
  }
}