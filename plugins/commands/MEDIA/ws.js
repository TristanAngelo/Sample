import axios from 'axios';
import fs from 'fs';
import path from 'path';

const config = {
  name: "wallpaper",
  aliases: [""],
  author: "kshitiz",
  version: "2.0",
  cooldowns: 5,
  description: "Search for wallpapers based on a keyword.",
  usage: "<keyword> - [amount]"
};

async function onCall({ message, args }) {
  if (args.length < 1) {
    message.reply('Please provide a keyword for the wallpaper search.');
    return;
  }

  let [keyword, amountStr] = args.join(' ').split('-').map(arg => arg.trim());
  let amount = parseInt(amountStr || 1);

  if (isNaN(amount) || amount <= 0) {
    message.reply('Please provide a valid positive integer for the amount.');
    return;
  }

  try {
    const response = await axios.get(`https://antr4x.onrender.com/get/searchwallpaper?keyword=${keyword}`);

    if (response.data.status && response.data.img.length > 0) {
      amount = Math.min(amount, response.data.img.length);

      const imgData = [];
      for (let i = 0; i < amount; i++) {
        const image = response.data.img[i];
        const imagePath = path.join(global.cachePath, `${message.threadID}_${message.senderID}_wallpaper_${i + 1}.jpg`);

        try {
          const imageResponse = await axios.get(image, { responseType: 'arraybuffer' });
          await fs.promises.writeFile(imagePath, Buffer.from(imageResponse.data, 'binary'));
          imgData.push(imagePath);
        } catch (error) {
          console.error("Error downloading image:", error);
          message.reply('An error occurred while downloading images. Please try again later.');
          return;
        }
      }

      message.reply({
        attachment: imgData.map(imgPath => fs.createReadStream(imgPath)),
        body: `Wallpapers based on '${keyword}' 🌟`,
      }, (err) => {
        if (err) {
          console.error("Error sending images:", err);
        }

        imgData.forEach(imgPath => {
          fs.unlinkSync(imgPath);
        });
      });
    } else {
      message.reply('No wallpapers found for the given keyword.');
    }
  } catch (error) {
    console.error('Error fetching wallpaper images:', error);
    message.reply('Please provide a single keyword or try again with different keywords.');
  }
};

export default {
  config,
  onCall
}
