import axios from 'axios';
import jimp from 'jimp';
import fs from 'fs';
import path from 'path';

export default {
  config: {
    name: "admit",
    aliases: [],
    version: "1.0",
    credits: "Grim",
    cooldown: 5,
    longDescription: "Wholesome avatar for confession.",
    usage: "[mention]"
  },

  onCall: async function({ message }) {
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
      await message.reply({
        body: "⚘૮₍  ˶ᵔ◡ᵔ˶ ₎ა\"",
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
  const image = await jimp.read("https://i.imgur.com/dgWdyl2.png");
  image.resize(515, 503).composite(avatarone.resize(203, 175), 24, 62);
  const imagePath = path.join(global.cachePath, `${messageID}_crush.png`);
  await image.writeAsync(imagePath);
  return imagePath;
}