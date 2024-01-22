import axios from "axios";

export default {
  config: {
    name: "llama",
    credits: "KENLIEPLAYS",
    description: "Use Llama AI",
    usage: `[question] | [query]`,
  },
  onCall: async function({ args, message }) {
    const text = args.join(" ");

    try {
      if (!text) {
        return message.reply(
          "Please provide a query!"
        );
      }

      const wait = await message.reply("⏳ | Generating response, please wait...");

      const response = await axios.get(`https://llama.aliestercrowley.com/api?prompt=${text}`);

      const respond = response.data.response;
      global.api.unsendMessage(wait.messageID);
      message.reply(respond);
      console.log(respond)

    } catch (error) {
      console.error("An error occurred:", error);
      message.reply("Oops! Something went wrong.");
    }
  },
};