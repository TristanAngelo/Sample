import { loadImage, createCanvas } from 'canvas';
import fs from 'fs-extra';
import axios from 'axios';
import path from 'path';

export const config = {
  name: "einstein",
  version: "3.1.1",
  credits: "John Lester (Converted by Grim)",
  description: "Comment on the board",
  usage: "[text]",
  cooldown: 5,
};

export function wrapText(ctx, text, maxWidth) {
  return new Promise(resolve => {
    if (ctx.measureText(text).width < maxWidth) return resolve([text]);
    if (ctx.measureText('W').width > maxWidth) return resolve(null);
    const words = text.split(' ');
    const lines = [];
    let line = '';
    while (words.length > 0) {
      let split = false;
      while (ctx.measureText(words[0]).width >= maxWidth) {
        const temp = words[0];
        words[0] = temp.slice(0, -1);
        if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
        else {
          split = true;
          words.splice(1, 0, temp.slice(-1));
        }
      }
      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
      else {
        lines.push(line.trim());
        line = '';
      }
      if (words.length === 0) lines.push(line.trim());
    }
    return resolve(lines);
  });
}

export async function onCall({ message, args }) {
  const pathImg = path.join(global.cachePath, `${message.threadID}_${Date.now()}_einstein.jpg`);
  var text = args.join(" ");
  if (!text) return message.reply("Enter the content of the comment on the board");
  let getPorn = (await axios.get(`https://i.ibb.co/941yM5Y/Picsart-22-08-13-21-34-35-220.jpg`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(pathImg, Buffer.from(getPorn, 'utf-8'));
  let baseImage = await loadImage(pathImg);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.font = "400 35px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "start";
  let fontSize = 45;
  while (ctx.measureText(text).width > 2250) {
    fontSize--;
    ctx.font = `400 ${fontSize}px Arial, sans-serif`;
  }
  const lines = await wrapText(ctx, text, 320);
  ctx.fillText(lines.join('\n'), 300, 90);//comment
  ctx.beginPath();
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  return message.reply({ attachment: fs.createReadStream(pathImg) }, () => fs.unlinkSync(pathImg));
}
