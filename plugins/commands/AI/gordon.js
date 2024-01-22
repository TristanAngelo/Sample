import axios from 'axios';

export const config = {
  name: "gordon",
  version: "1.0.0",
  credits: "Liane",
  usage: "[prompt]",
  cooldown: 5
};

export async function onCall({ message, args }) {
  try {
    const query = args.join(" ") || "Hello";

    if (query) {
      message.react("⏳");
      const processingMessage = await message.reply(`👨🏻‍🍳 | Gordon AI, please wait a moment...`);

      const apiUrl = `https://lianeapi.onrender.com/@renn/api/GordonAI?key=j86bwkwo-8hako-12C&query=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.message) {
        const trimmedMessage = response.data.message.trim();
        message.react("✅");
        await message.reply({ body: trimmedMessage });

        console.log(`Sent 👨🏻‍🍳 | Gordon AI's response to the user`);
      } else {
        throw new Error(`Invalid or missing response from 👨🏻‍🍳 | Gordon AI API`);
      }

      await global.api.unsendMessage(processingMessage.messageID);
    }
  } catch (error) {
    console.error(`❌ | Failed to get 👨🏻‍🍳 | Gordon AI's response: ${error.message}`);
    const errorMessage = `❌ | An error occurred. You can try typing your query again or resending it. There might be an issue with the server that's causing the problem, and it might resolve on retrying.`;
    message.reply(errorMessage);
  }
};
