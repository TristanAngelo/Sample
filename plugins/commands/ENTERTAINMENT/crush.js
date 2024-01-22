import axios from 'axios';
import jimp from 'jimp';
import fs from 'fs';
import path from 'path';

export default {
  config: {
    name: "crush",
    aliases: [],
    version: "1.0",
    author: "AceGun",
    credits: "Grim",
    cooldown: 5,
    longDescription: "wholesome avatar for crush/lover",
    usage: "[mention]"
  },

  onCall: async function({ message, args }) {
    const mention = Object.keys(message.mentions);
    if (mention.length == 0) {
      message.reply("Mention a person.");
      return;
    }

    let one;
    if (mention.length == 1) {
      one = mention[0];
    } else {
      one = mention[0];
    }

    try {
      const imagePath = await bal(one);
      //૮ ˶ᵔ ᵕ ᵔ˶ ა
      await message.reply({
        body: "「 So cringe. 💀 」",
        attachment: fs.createReadStream(imagePath)
      });
    } catch (error) {
      console.error("Error while running command:", error);
      await message.reply("An error occurred!");
    }
  }
};
async function bal(one, message) {
  const messageID = message;
  const avatarone = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
  const image = await jimp.read("https://i.imgur.com/BnWiVXT.jpg");
  image.resize(512, 512).composite(avatarone.resize(173, 173), 70, 186);
  const imagePath = path.join(global.cachePath, `${messageID}_crush.png`);
  await image.writeAsync(imagePath);
  return imagePath;
}