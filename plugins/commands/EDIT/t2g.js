import axios from 'axios';

export default {
  config: {
    name: "t2g",
    version: "1.0",
    credits: "Samir Œ",
    cooldown: 5,
    description: "Create gif image.",
    category: "image",
    usage: "<text>"
  },

  onCall: async function({ args, message }) {
    const text = args.join(" ");
    if (!text) {
      return message.reply("Please provide a prompt.");
    }

    const wait = await message.reply("Initializing image, please wait...");
    try {
      const API = `https://gif.samirzyx.repl.co/t2g?q=${encodeURIComponent(text)}`;
      const imageStream = await global.getStream(API);
      global.api.unsendMessage(wait.messageID);
      message.reply({
        body: `Here's your GIF:`,
        attachment: imageStream
      });
    } catch (error) {
      console.error(error);
      message.reply(`Error: ${error}`);
    }
  }
};