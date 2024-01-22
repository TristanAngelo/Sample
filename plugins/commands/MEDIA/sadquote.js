import axios from "axios";

export default {
  config: {
    name: "sadquote",
    aliases: ["sad"],
    version: "1.0",
    credits: "RICKCIEL X KSHITIZ",
    cooldown: 5,
    description: "Get random sad quotes.",
    usage: ""
  },

  onCall: async function ({ message }) {
    try {
      const response = await axios.get("https://api-1.chatbotmesss.repl.co/api/sadquotes1");
      const { quote, author } = response.data;
      const messages = `🌧️ | ${quote}`;
      return message.reply(messages);
    } catch (error) {
      console.error(error);
    }
  },
};