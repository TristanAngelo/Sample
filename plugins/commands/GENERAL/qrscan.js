import fs from 'fs';
import jimp from 'jimp';
import path from 'path';
import QrCode from 'qrcode-reader';
import imageDownloader from 'image-downloader';

export default {
  config: {
    name: "qrscan",
    aliases: ['qrs'],
    version: "1.0",
    author: "Samir",
    cooldown: 5,
    description: "QR Code scanner",
    usage: "Reply to qr code",
  },

  onCall: async function({ message }) {
    const pathImg = path.join(global.cachePath, `${Date.now()}_${message.threadID}_qrcode.png`);

    const {  type, messageReply } = message;
    if (type !== "message_reply" || messageReply.attachments.length !== 1) {
      return message.reply("You must respond to the qrcode image to be scanned.");
    }

    if (messageReply.attachments[0].type === 'photo') {
      try {
        await imageDownloader.image({ url: messageReply.attachments[0].url, dest: pathImg });
        const img = await jimp.read(fs.readFileSync(pathImg));
        const qr = new QrCode();
        const value = await new Promise((resolve, reject) => {
          qr.callback = (err, v) => err !== null ? reject(err) : resolve(v);
          qr.decode(img.bitmap);
        });
        return message.reply(`Result: ${value.result}`);
      } catch (error) {
        console.error(error);
        return message.reply("An error occurred while executing the command");
      }
    }

    return message.reply("An error occurred while executing the command");
  }
};

