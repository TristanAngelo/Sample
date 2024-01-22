import axios from 'axios';
import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';

export default {
  config: {
    name: "write",
    aliases: [],
    credits: "kshitiz",  
    version: "2.0",
    cooldown: 5,
    description: "Write text on an image and send. Reply to a photo with 'text1 | text2'.",
    usage: "reply to photo with [text1] | [text2]"
  },
  onCall: async function ({ message, args }) {
    let linkanh = message.messageReply.attachments[0]?.url;

    if (!linkanh) {
      return message.reply('Please reply to a photo with the format "text1 | text2".');
    }

    const cleanedBody = args.join(" ").trim();

    const [text1, text2] = cleanedBody.split('|').map(item => item.trim());

    if (!text1 || !text2) {
      return message.reply('Invalid format. Please provide text1 and text2 separated by |.');
    }

    try {
      const response = await axios.get(linkanh, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data);
      const tempImageFilePath = path.join(global.cachePath, `${message.threadID}_temp_image.jpg`);

      fs.writeFileSync(tempImageFilePath, imageBuffer);

      const background = await loadImage(tempImageFilePath);
      const canvas = createCanvas(background.width, background.height);
      const ctx = canvas.getContext('2d');

      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);


      ctx.font = 'bold 15px Arial'; // Adjust font size 
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';


      const borderWidth = 2;
      ctx.lineWidth = borderWidth;
      ctx.strokeStyle = 'black';

      ctx.strokeText(text1, canvas.width / 4, 12);
      ctx.fillText(text1, canvas.width / 4, 12);

      ctx.textBaseline = 'bottom';


      ctx.strokeText(text2, canvas.width / 4, canvas.height - 12);
      ctx.fillText(text2, canvas.width / 4, canvas.height - 12);

      const modifiedImageBuffer = canvas.toBuffer();
      const modifiedImageFilePath = path.join(global.cachePath, `${message.threadID}_modified_image.jpg`);

      fs.writeFileSync(modifiedImageFilePath, modifiedImageBuffer);

      message.reply(
        {
          body: 'Here is your modified image 🖼️',
          attachment: fs.createReadStream(modifiedImageFilePath),
        },
        (err, messageInfo) => {
          fs.unlinkSync(tempImageFilePath);
          fs.unlinkSync(modifiedImageFilePath);

          if (err) {
            console.error('Error sending message:', err);
            message.reply('An error occurred ');
          }
        }
      );
    } catch (error) {
      console.error(error);
      return message.reply('An error occurred while processing the image.\nPlease try again later.');
    }
  }
};