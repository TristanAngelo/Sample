import path from 'path';
import jimp from "jimp";
import fs from "fs";

export default {
  config: {
    name: "mistake",
    aliases: ["mistake"],
    version: "1.0",
    credits: "Jai Shree Ram",//don't change credit otherwise I'm gonna fuck your mom
    cooldown: 10,//to avoid spam i did 10sec you can change
    description: "a small mistake (mention someone)",//suuuuuuuuuuuuuuuuuuuuiiiiii 
    category: "ENTERTAINMENT",
  },

  onCall: async function({ message }) {
    const mention = Object.keys(message.mentions);
    if (mention.length == 0) {
      message.reply("You must select tag a perso.");
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
        body: "「The Biggest Mistake」",
        attachment: fs.createReadStream(imagePath)
      });
    } catch (error) {
      console.error("Error while running command:", error);
      await message.reply("an error occurred");
    }
  }
};

async function bal(one) {
  const avatarone = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
  const image = await jimp.read("https://i.postimg.cc/2ST7x1Dw/received-6010166635719509.jpg");
  image.resize(512, 512).composite(avatarone.resize(220, 203), 145, 305);
  const imagePath = path.join(global.cachePath, `${Date.now()}_mistake.png`);
  await image.writeAsync(imagePath);
  return imagePath;
}