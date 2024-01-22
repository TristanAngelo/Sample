import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';

export const config = {
  name: "prodia",
  version: "1.0.0",
  credits: "Grim",
  description: "Generate images with Prodia.",
  usage: "[text]",
  cooldown: 5,
};

export async function onCall({ args, message }) {
  try {
    const text = args.join(" ");

    await message.react("⏳");
    const response = await axios.get(`https://clumsy-subsequent-monkey.glitch.me/genimg?prompt=${encodeURIComponent(text)}&api=genme`);

    const imgResponse = await axios.get(response.data.prodia, { responseType: 'arraybuffer' });
    const imgPath = path.join(global.cachePath, `${message.threadID}_prodia.jpg`);

    await fs.outputFile(imgPath, imgResponse.data);

    const imgData = [fs.createReadStream(imgPath)];

    if (imgData.length > 0) {
      message.react("✅");
      await message.reply({
        body: `Generated Images with Prodia:`,
        attachment: imgData
      });

      // Delete images after sending them as attachments
      for (const stream of imgData) {
        const imgPath = stream.path;
        await fs.unlink(imgPath);
      }
    } else {
      await message.reply('No images generated.');
    }

  } catch (error) {
    console.error(error);
    message.react("❌");
    await message.reply(`Image generation failed!\nError: ${error.message}`);
  }
}
