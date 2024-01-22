import fs from 'fs';
import path from 'path';
import axios from 'axios';

export const config = {
  name: "zedge",
  version: "1.0.0",
  hasPermssion: 1, //1 admin default note: you make it 0 
  credits: "EASY API",
  description: "",
  cooldown: 5,
};

export async function onCall({ args, message }) {
  const query = args.join(" ");

  if (!query) {
    message.reply("Please provide a query.");
    return;
  }

  message.reply("🔍 | Searching image, please wait...").then(async (messageInfo) => {
    try {
      const res = await axios.get(`https://api.easy0.repl.co/api/zedge?s=${query}`);
      const imgUrls = res.data.data;
      const imgCount = imgUrls.length;

      if (imgCount === 0) {
        message.reply(`No image results found for "${query}"`);
        return;
      }

      const randomIndices = getRandomIndices(imgCount, Math.min(10, imgCount));
      const attachments = [];

      for (let i = 0; i < randomIndices.length; i++) {
        const index = randomIndices[i];
        const url = imgUrls[index];
        const imageResponse = await axios.get(url, { responseType: "arraybuffer" });
        const imagePath = path.join(global.cachePath, `${message.threadID}_${Date.now()}_zedge_${i}.png`);
        fs.writeFileSync(imagePath, Buffer.from(imageResponse.data));
        attachments.push(fs.createReadStream(imagePath));
      }

      message.reply({
        body: `This is the 10 random Image Result \nTotal Result of ${imgCount}`,
        attachment: attachments,
      }, (err, msgInfo) => {
        if (!err) {
          global.api.unsendMessage(messageInfo.messageID);
        } else {
          console.error(err);
        }
      });
    } catch (error) {
      console.error(error);
    }
  });
};

function getRandomIndices(max, count) {
  const indices = Array.from({ length: max }, (_, i) => i);
  for (let i = max - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, count);
}