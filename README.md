# BetterQuesting Notifications

This is just a simple service that will monitor the BetterQuest progress of your server and send a configurable POST request out to a waiting bot. 
I believe this can be easily adaptable to other modpacks, but this was made specifically for DivineJourney 2. I am planning on testing its portability when I start re-playing GTNH.

## To Use:
Simply clone this repo inside the main folder of your server. Configure the .env file with the locations of your BetterQuest JSON files within your server (Usually just in /world/BetterQuesting)  
You may need to upload the en_us.lang file associated with your modpack's QuestBook as the serverpacks don't always seem to include them. I dropped DJ2's respective file in the same directory as my index.ts
Configure where you want the output of the POST request to go and you're golden!
