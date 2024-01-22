import { createCanvas, loadImage } from 'canvas';
import axios from 'axios';
import fs from 'fs-extra';
import request from 'request';
import path from 'path';
import jimp from 'jimp';

const config = {
  name: "cover",
  version: "1.0.1",
  credits: "JRT mod by Clarence-DK",
  description: "Create an interesting banner image",
  usages: "cover [text1 - text2]",
  cooldown: 10,
};

async function circle(image) {
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
}

async function onCall({ api, message, args }) {
  let { senderID, threadID, messageID } = message;
  const canvas = createCanvas(1920, 1080);
  const ctx = canvas.getContext('2d');
  let pathImg = path.join(
      global.cachePath, `${Date.now()}_cover_${senderID}.png`
    );
  let pathAva = path.join(
      global.cachePath, `${Date.now()}_avtuser_${senderID}.png`
    );
  let text = args.join(" ");
  if (!text) {
    return global.api.sendMessage('💢 | Please enter the correct format [text1 - text2]', threadID, messageID);
  }
  const text1 = text.substr(0, text.indexOf(' - '));
  if (!text1) {
    return global.api.sendMessage('💢 | Please enter the correct format [text1 - text2]', threadID, messageID);
  }
  const text2 = text.split(" - ").pop();
  if (!text2) {
    return global.api.sendMessage('💢 | Please enter the correct format [text1 - text2]', threadID, messageID);
  }
  let Avatar = (
    await axios.get(
      `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    )
  ).data;
  let getWanted = (
    await axios.get(encodeURI(`https://i.ibb.co/cCpB1sQ/Ph-i-b-a-trung-thu.png`), {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathAva, Buffer.from(Avatar, "utf-8"));
  const avatar = await circle(pathAva);
  fs.writeFileSync(pathImg, Buffer.from(getWanted, "utf-8"));
  let baseImage = await loadImage(pathImg);
  let baseAva = await loadImage(avatar);
  ctx.drawImage(baseImage, 0, 0, 1920, 1080);
  ctx.drawImage(baseAva, 820, 315, 283, 283);
  ctx.font = "bold 70px Manrope";
  ctx.fillStyle = "#ffff";
  ctx.textAlign = "center";
  ctx.fontSize = 40;
  ctx.fillText(text1, 965, 715);
  ctx.font = "55px Manrope";
  ctx.fillStyle = "#ffff";
  ctx.textAlign = "center";
  ctx.fontSize = 20;
  ctx.fillText(text2, 965, 800);
  ctx.beginPath();
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAva);
  global.api.sendMessage(
    { attachment: fs.createReadStream(pathImg) },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
}

export default {
  config,
  onCall
};
