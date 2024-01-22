import { createCanvas, loadImage } from 'canvas';
import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';

export const config = {
  name: "hack",
  version: "1.0.0",
  credits: "John Lester (Converted by Grim)",
  description: "Prank hack.",
  usages: "@mention",
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

export async function onCall({ message }) {
  try {
    let { senderID, threadID, messageID, mentions } = message;
    const canvas = createCanvas(720, 1391);
    const ctx = canvas.getContext('2d');
    let pathImg = path.join(
      global.cachePath,
      `${Date.now()}_background_${message.messageID}.png`
    );
    let pathAvt1 = path.join(
      global.cachePath,
      `${Date.now()}_Avtmot_${message.messageID}.png`
    );

    const id = Object.keys(mentions)[0] || senderID;
    const name = await global.controllers.Users.getName(id);

    const background = [
      "https://i.imgur.com/VQXViKI.png"
    ];
    const rd = background[Math.floor(Math.random() * background.length)];

    const getAvtmot = (
      await axios.get(
        `https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: "arraybuffer" }
      )
    ).data;
    fs.writeFileSync(pathAvt1, Buffer.from(getAvtmot, "utf-8"));

    const getbackground = (
      await axios.get(rd, {
        responseType: "arraybuffer",
      })
    ).data;
    fs.writeFileSync(pathImg, Buffer.from(getbackground, "utf-8"));

    const baseImage = await loadImage(pathImg);
    const baseAvt1 = await loadImage(pathAvt1);

    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.font = "400 23px Arial";
    ctx.fillStyle = "#1878F3";
    ctx.textAlign = "start";

    const lines = await wrapText(ctx, name, 1160);
    ctx.fillText(lines.join('\n'), 200, 497);
    ctx.beginPath();

    ctx.drawImage(baseAvt1, 83, 437, 100, 101);

    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    fs.removeSync(pathAvt1);

    global.api.sendMessage({ body: ` `, attachment: fs.createReadStream(pathImg) }, threadID, () => fs.unlinkSync(pathImg), messageID);
  } catch (error) {
    console.error(error);
    message.reply("An error occurred while creating the hack image.");
  }
}
