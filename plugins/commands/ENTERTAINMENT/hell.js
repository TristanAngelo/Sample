import fs from 'fs';
import path from 'path';
import jimp from 'jimp';

export default {
  config: {
    name: "hell",
    version: "1.1",
    credits: "NIB",
    cooldown: 5,
    description: "From hell.",
    usage: "<mention or reply to an image>"
  },

  onCall: async function({ message }) {

    let url;

    if (message.type == "message_reply" && message.messageReply.attachments.length > 0 && (message.messageReply.attachments[0].type == "photo" || "animated_image")) {
      url = message.messageReply.attachments[0].url
    } else {
      const uid = Object.keys(message.mentions)[0]
      if (!uid) return message.reply("Mention someone or Reply to an image");

      url = await global.getAvatarURL(uid);
    }
    let img = await jimp.read("https://preview.redd.it/bulmm46zcfy91.png?auto=webp&s=8032342154184d32912f8077393de67a2f6bd421")
    let imgg = await jimp.read(url)

    img.composite(imgg.resize(360, 370), 40, 260).composite(imgg.resize(360, 370), 40, 980)

    const pathImg = path.join(global.cachePath, `${message.threadID}_${message.senderID}_hell.png`);
    await img.writeAsync(pathImg);
    message.reply({ body: "🌞🌞", attachment: fs.createReadStream(pathImg) })
  }
}