import axios from 'axios';

export default {
  config: {
    name: "extractpastebin",
    aliases: ["extract"],
    permissions: [2],
    version: 1.0,
    author: "LiANE (Converted by Grim)",
    description: "Reads and sends the content of a Pastebin link",
    usage: "<link>"
  },
  onCall: async function({ args, message }) {
    const link = args[0];
    if (!link) {
      message.reply("Invalid Pastebin link provided. Please provide a valid link starting with 'https://pastebin.com/raw/'.");
      return;
    }

    try {
      const response = await axios.get(link);
      const content = response.data;

      message.reply(content);
    } catch (error) {
      message.reply("An error occurred while trying to read the Pastebin link.");
      console.error(error);
    }
  }
};