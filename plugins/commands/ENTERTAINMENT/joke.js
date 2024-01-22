import axios from 'axios';

export const config = {
  name: "jokes",
  version: "1.0.0",
  credits: "August Quinn (Converted by Grim)",
  description: "Get random jokes from the Official Joke API",
  usage: "",
  cooldown: 5
};

const apiEndpoint = "https://official-joke-api.appspot.com/random_joke";

export async function onCall({ message }) {
  try {
    const response = await axios.get(apiEndpoint);
    const joke = response.data;

    const jokeMessage = `🃏 Here's a joke for you:\n\n𝗖𝗔𝗧𝗘𝗚𝗢𝗥𝗬: ${joke.type}\n𝗦𝗘𝗧𝗨𝗣: ${joke.setup}\n𝗣𝗨𝗡𝗖𝗛𝗟𝗜𝗡𝗘: ${joke.punchline}`;
    message.reply(jokeMessage);
  } catch (error) {
    message.reply("An error occurred while fetching jokes. Please try again later.");
    console.error("Jokes API Error:", error.message);
  }
};