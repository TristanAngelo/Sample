import axios from 'axios';
import fs from 'fs';
import tinyurl from 'tinyurl';

export default {
  config: {
    name: "trace",
    aliases: ['sauce'],
    version: "1.0",
    credits: "JARiF",
    description: "Finding sauce from image.",
    usage: "Reply to an image",
    cooldown: 7
  },

  onCall: async function({ message, args }) {
    let imageUrl;

    if (message.type === "message_reply") {
      const replyAttachment = message.messageReply.attachments[0];

      if (["photo", "sticker"].includes(replyAttachment?.type)) {
        imageUrl = replyAttachment.url;
      } else {
        return message.reply("❌ | Reply must be an image.");
      }
    } else if (args[0]?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/g)) {
      imageUrl = args[0];
    } else {
      return message.reply("❌ | Reply to an image.");
    }

    const url = await tinyurl.shorten(imageUrl);

    const replyMessage = await message.reply("Please wait...");

    try {
      const traceResponse = await axios.get(
        `https://www.api.vyturex.com/trace?imgurl=${url}`
      );
      const firstResult = traceResponse.data.result[0];

      const fu = firstResult.filename.replace(".mp4", "");
      global.api.unsendMessage(replyMessage.messageID);
      message.reply({
        body: `Name: ${fu}\nSimilarity: ${firstResult.similarity}`,
        attachment: await global.getStream(firstResult.video),
      });
    } catch (err) {
      global.api.unsendMessage(replyMessage.messageID);
      message.reply(err.message);
      console.log(err);
    }
  },
};