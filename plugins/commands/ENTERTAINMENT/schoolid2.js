import { loadImage, createCanvas } from 'canvas';
import fs from 'fs-extra';
import axios from 'axios';
import path from 'path';

export const config = {
  name: "schoolid2",
  version: "1.0.0",
  credits: "Kaiden (Converted by Grim)",
  description: "enroll na mga bobo",
  usage: "@mention",
  cooldown: 5
};

export function wrapText(ctx, name, maxWidth) {
  return new Promise(resolve => {
    if (ctx.measureText(name).width < maxWidth) return resolve([name]);
    if (ctx.measureText('W').width > maxWidth) return resolve(null);
    const words = name.split(' ');
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

export async function onCall({ Users, message }) {
  let pathImg = path.join(global.cachePath, `${message.threadID}_${Date.now()}_schoolid.png`);
  const pathAvt1 = path.join(global.cachePath, `${message.threadID}_${Date.now()}_schoolid_avtmot.png`);

  var id = Object.keys(message.mentions)[0] || message.senderID;
  var name = await global.controllers.Users.getName(id);

  var background = [

    "https://i.imgur.com/xJRXL3l.png"
  ];
  var rd = background[Math.floor(Math.random() * background.length)];

  let getAvtmot = (
    await axios.get(
      `https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    )
  ).data;
  fs.writeFileSync(pathAvt1, Buffer.from(getAvtmot, "utf-8"));

  let getbackground = (
    await axios.get(`${rd}`, {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathImg, Buffer.from(getbackground, "utf-8"));

  let baseImage = await loadImage(pathImg);
  let baseAvt1 = await loadImage(pathAvt1);

  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.font = "400 23px Arial";
  ctx.fillStyle = "#1878F3";
  ctx.textAlign = "start";


  const lines = await wrapText(ctx, name, 2000);
  ctx.fillText(lines.join('\n'), 270, 790);//comment
  ctx.beginPath();


  ctx.drawImage(baseAvt1, 168, 225, 360, 360);

  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAvt1);
  return message.reply({ body: `NO ID, NO ENTRY! 🪪`, attachment: fs.createReadStream(pathImg) }, () => fs.unlinkSync(pathImg));
}