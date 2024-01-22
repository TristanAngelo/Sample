import axios from 'axios';

const config = {
  name: "prompt",
  version: "1.0",
  credits: "JARiF (Converted by Dymyrius)",
  cooldown: 5,
  description: "Get midjourney prompts.",
  usage: "",
  permissions: [0, 1, 2]
};

async function onCall({ message, args }) {
  const { messageReply, type } = message;
  try {
    const prompt = args.join(" ");
    let imageUrl;

    if (type === "message_reply") {
      if (["photo", "sticker"].includes(messageReply.attachments[0]?.type)) {
        imageUrl = messageReply.attachments[0].url;
      } else {
        return message.reply("❌ | Reply must be an image.");
      }
    } else if (args[0]?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/g)) {
      imageUrl = args[0];
    } else if (!prompt) {
      return message.reply("❌ | Reply to an image or provide a prompt.");
    }

    if (imageUrl) {
      const response = await axios.get(`https://www.annie-jarif.repl.co/describe?url=${encodeURIComponent(imageUrl)}`);
      const description = response.data;
      await message.reply(`𝗭𝗵𝘂𝗴𝗲: ${description}`);
      
    } else if (prompt) {
      const response = await axios.get(`https://www.annie-jarif.repl.co/promptgen?content=${encodeURIComponent(prompt)}`);
      const res = response.data;
      await message.reply(`𝗭𝗵𝘂𝗴𝗲: ${res}`);
    }
  } catch (error) {
    message.reply(`${error}`);
  }
};

export default {
  config,
  onCall
}