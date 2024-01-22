import axios from 'axios';
import fs from 'fs';
import path from 'path';

const apiKey = "RdjJDazKqAvUqNNsqDMb43cN";

export default {
  config: {
    name: "removebg",
    version: "2.0",
    aliases: ["rvb"],
    credits: "SiAM",
    cooldown: 10,
    description: "Remove Background from Image",
    usage: "reply an image URL | add URL",
  },

  onCall: async function({ args, message }) {

    let imageUrl;
    let type;
    if (message.type === "message_reply") {
      if (["photo", "sticker"].includes(message.messageReply.attachments[0].type)) {
        imageUrl = message.messageReply.attachments[0].url;
        type = isNaN(args[0]) ? 1 : Number(args[0]);
      }
    } else if (args[0]?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/g)) {
      imageUrl = args[0];
      type = isNaN(args[1]) ? 1 : Number(args[1]);
    } else {
      return message.reply("Please Provide an image URL or Reply an Image..!⚠️");
    }

    const processingMessage = message.reply("⏳ | Removing background..");

    try {
      const response = await axios.post(
        "https://api.remove.bg/v1.0/removebg",
        {
          image_url: imageUrl,
          size: "auto",
        },
        {
          headers: {
            "X-Api-Key": apiKey,
            "Content-Type": "application/json",
          },
          responseType: "arraybuffer",
        }
      );

      const outputBuffer = Buffer.from(response.data, "binary");

      const filePath = path.join(global.cachePath, `${message.threadID}_${message.senderID}_removebg.png`)

      fs.writeFileSync(filePath, outputBuffer);
      message.reply(
        {
          attachment: fs.createReadStream(filePath),
        },
        () => fs.unlinkSync(filePath)
      );

    } catch (error) {
      console.log(error);
      message.reply("Something went wrong, please try again later!");
    }

    global.api.unsendMessage((await processingMessage).messageID);
  },
};