import axios from 'axios';

export const config = {
  name: "vicuna",
  version: "1.0.1",
  credits: "Grim",// credits the api by hazeyy
  description: "Get response from Vicuna. (Unfiltered)",
  usage: "[query]",
  cooldown: 5,
};

export async function onCall({ message, args }) {
  if (!args[0]) return message.reply("Please input your question");
  const question = encodeURIComponent(args.join(" "));
  const apiUrl = `https://www.api.vyturex.com/mistral?input=${question}`;

  try {
    const wait = await message.reply("😈 | Please wait...");
    const response = await axios.get(apiUrl);
    if (response.data && response.data.trim() !== "") {
      global.api.unsendMessage(wait.messageID)
      message.reply(`💀 | ️${response.data}`);
    } else {
      message.reply("Liner AI did not provide a valid response.");
    }
  } catch (error) {
    message.reply("Sorry, I can't get a response from Replit AI at the moment.");
    console.error(error);
  }
};