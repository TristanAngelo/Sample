import axios from 'axios';

export const config = {
  name: "liner",
  version: "1.0.0",
  credits: "Grim",// credits the api by hazeyy
  description: "Get response from Liner AI.",
  usage: "[query]",
  cooldown: 5,
};

export async function onCall({ message, args }) {
  if (!args[0]) return message.reply("Please input your question");
  const question = encodeURIComponent(args.join(" "));
  const apiUrl = `https://www.api.vyturex.com/liner?prompt=${question}`;

  try {
    const wait = await message.reply("⏱️ | Please wait...");
    const response = await axios.get(apiUrl);
    if (response.data && response.data.answer && response.data.answer.trim() !== "") {
      global.api.unsendMessage(wait.messageID)
      message.reply(`〽 | ️${response.data.answer}`);
    } else {
      message.reply("Liner AI did not provide a valid response.");
    }
  } catch (error) {
    message.reply("Sorry, I can't get a response from Replit AI at the moment.");
    console.error(error);
  }
};