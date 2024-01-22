import axios from 'axios';

export const config = {
  name: "history",
  version: "1.1.0",
  credits: "Blue (Converted by Grim)",
  description: "Get information about historical events or topics.",
  cooldown: 5,
  usage: "[search_query]",
};

export async function onCall({ message, args }) {
  const searchQuery = args.join(" ");

  if (!searchQuery) {
    return message.reply("Please provide a search query (e.g., history World War 3).");
  }

  try {
    const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchQuery)}`);

    if (response.data.title && response.data.extract) {
      const title = response.data.title;
      const extract = response.data.extract;

      message.reply(`Information about "${title}":\n${extract}`);
    } else {
      message.reply(`No information found for "${searchQuery}".`);
    }
  } catch (error) {
    console.error("Error fetching historical information:", error);
    message.reply("An error occurred while fetching historical information.");
  }
};