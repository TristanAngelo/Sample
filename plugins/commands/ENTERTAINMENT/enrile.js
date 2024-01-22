import { loadImage, createCanvas } from "canvas";
import fs from "fs-extra";
import axios from "axios";
import path from 'path';

export const config = {
  name: "enrile",
  version: "1.0.1",
  credits: "JolandManzano (Converted by Grim)",
  description: "Enrile said.",
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
  let pathImg = path.join(global.cachePath, `${Date.now()}_enrile.jpg`);
  var text = args.join(" ");
  if (!text) return message.reply("Enter the content of the comment on the board");
  let getPorn = (await axios.get(`https://i.imgur.com/1plDf6o.png`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(pathImg, Buffer.from(getPorn, 'utf-8'));
  let baseImage = await loadImage(pathImg);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.font = "400 60px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "start";
  let fontSize = 250;
  while (ctx.measureText(text).width > 1450) {
    fontSize--;
    ctx.font = `400 ${fontSize}px Arial, sans-serif`;
  }
  const lines = await wrapText(ctx, text, 600);
  ctx.fillText(lines.join('\n'), 500, 450);//comment
  ctx.beginPath();
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  return message.reply({ attachment: fs.createReadStream(pathImg) }, () => fs.unlinkSync(pathImg));
}