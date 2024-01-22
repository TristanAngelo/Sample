import axios from 'axios';

export const config = {
  name: "zenmaster",
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
      const processingMessage = await message.reply(`🧘🏻‍♂️ | ZenMaster, please wait a moment...`);

      const apiUrl = `https://lianeapi.onrender.com/@nealianacagara/api/zenmaster_by_serenity?key=j86bwkwo-8hako-12C&query=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.message) {
        const trimmedMessage = response.data.message.trim();
        message.react("✅");
        await message.reply({ body: trimmedMessage });

        console.log(`Sent 🧘🏻‍♂️ | ZenMaster response to the user`);
      } else {
        throw new Error(`Invalid or missing response from 🧘🏻‍♂️ | ZenMaster API`);
      }

      await global.api.unsendMessage(processingMessage.messageID);
    }
  } catch (error) {
    console.error(`❌ | Failed to get 🧘🏻‍♂️ | ZenMaster response: ${error.message}`);
    const errorMessage = `❌ | An error occurred. You can try typing your query again or resending it. There might be an issue with the server that's causing the problem, and it might resolve on retrying.`;
    message.reply(errorMessage);
  }
};
