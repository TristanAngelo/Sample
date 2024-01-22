import axios from "axios";

export default {
  config: {
    name: "insult",
    version: "1.0",
    credits: "Lahatra (Converted by Grim)",
    description: "This command searches for insults based on a given term.",
    usage: ""
  },

  onCall: async function ({ message, args }) {
    try {
      const searchTerm = args.join(" ");
      const url = `https://evilinsult.com/generate_insult.php?lang=en&type=json`;

      const response = await axios.get(url);
      const insult = response.data.insult;

      message.reply(`😈 | 𝗜𝗡𝗦𝗨𝗟𝗧:\n\n➩ ${insult}`);

    } catch (error) {
      console.error(error);
      message.reply("Oops, I couldn't generate an insult for you.");
    }
  },
};
