import { loadImage, createCanvas } from 'canvas';
import fs from 'fs-extra';
import axios from 'axios';
import path from 'path';

export const config = {
  name: "fblite",
  version: "1.0.1",
  credits: "Joland Manzano (Converted by Grim)",
  description: "Something wrong with fblite.",
  usage: "[text]",
  cooldown: 10,
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
  let pathImg = path.join(global.cachePath, `${message.threadID}_${Date.now()}_fblite.png`);
  var text = args.join(" ");
  if (!text) return message.reply("Enter the content of the comment on the board.");
  let getPorn = (await axios.get(`https://i.imgur.com/QBOGwjx.jpeg`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(pathImg, Buffer.from(getPorn, 'utf-8'));
  let baseImage = await loadImage(pathImg);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.font = "400 32px Arial";
  ctx.fillStyle = "#7C7D7F";
  ctx.textAlign = "start";
  let fontSize = 250;
  while (ctx.measureText(text).width > 2000) {
    fontSize--;
    ctx.font = `400 ${fontSize}px Arial, sans-serif`;
  }
  const lines = await wrapText(ctx, text, 610);
  ctx.fillText(lines.join('\n'), 90, 670);//comment
  ctx.beginPath();
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  return message.reply({ attachment: fs.createReadStream(pathImg) }, () => fs.unlinkSync(pathImg));
}
