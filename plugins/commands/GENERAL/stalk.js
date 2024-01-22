import Canvas from 'canvas';
import axios from 'axios';
import fs from 'fs-extra';
import request from 'request';
import path from 'path';

const config = {
  name: 'stalk',
  version: '1.0.0',
  credits: 'Deku & Yan Maglinte (Converted by Grim)', // Added Canvas Design by Yan
  description: 'Get info using uid/mention/reply to a message',
  usage: '[reply/uid/@mention/url]',
  cooldown: 0,
};

const background = 'https://i.imgur.com/zQ7JY17.jpg';
const fontlink = 'https://drive.google.com/u/0/uc?id=1ZwFqYB-x6S9MjPfYm3t3SP1joohGl4iw&export=download';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

async function onCall({ api, message, args }) {
  try {
    let { threadID, senderID, messageID, type, messageReply } = message;

    var id;
    if (args.join().indexOf('@') !== -1) {
      id = Object.keys(message.mentions);
    } else if (args[0]) {
      id = args[0];
    } else {
      id = senderID;
    }

    if (type == 'message_reply') {
      id = messageReply.senderID;
    } else if (args.join().indexOf('.com/') !== -1) {
      const res = await axios.get(`https://api.reikomods.repl.co/sus/fuid?link=${args.join(' ')}`);
      id = res.data.result;
    }

    let name = (await global.api.getUserInfo(id))[id].name;
    let username = (await global.api.getUserInfo(id))[id].vanity === 'unknown' ? 'Not Found' : id;
    let url = (await global.api.getUserInfo(id))[id].profileUrl;

    let callback = async function () {
      const profilePic = await Canvas.loadImage(__dirname + '/cache/avt.png');
      const canvas = Canvas.createCanvas(626, 352);
      const ctx = canvas.getContext('2d');
      const backgroundImage = await Canvas.loadImage(background);
      ctx.drawImage(backgroundImage, 0, 0, 626, 352);

      ctx.save();
      let size = 250;
      let x = 90;
      let y = (canvas.height - size) / 2;
      let radius = 10;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + size - radius, y);
      ctx.arcTo(x + size, y, x + size, y + radius, radius);
      ctx.lineTo(x + size, y + size - radius);
      ctx.arcTo(x + size, y + size, x + size - radius, y + size, radius);
      ctx.lineTo(x + radius, y + size);
      ctx.arcTo(x, y + size, x, y + size - radius, radius);
      ctx.lineTo(x, y + radius);
      ctx.arcTo(x, y, x + radius, y, radius);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(profilePic, x, y, size, size);
      ctx.restore();

      const fontBuffer = (await axios.get(fontlink, { responseType: 'arraybuffer' })).data;
      fs.writeFileSync(__dirname + '/font/Semi.ttf', Buffer.from(fontBuffer, 'utf-8'));
      Canvas.registerFont(__dirname + '/font/Semi.ttf', { family: 'Semi' });

      let fontSize = 30;
      ctx.font = `${fontSize}px Semi`;

      while (ctx.measureText(name).width > size) {
        fontSize -= 2;
        ctx.font = `${fontSize}px Semi`;
      }

      let textX = x + size / 2 - ctx.measureText(name).width / 2;
      let textY = y + size + fontSize + 10;

      ctx.fillStyle = 'white';
      ctx.fillText(name, textX, textY);

      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(__dirname + '/cache/Image.png', buffer);

      return global.api.sendMessage(
        {
          body: `❍━[INFORMATION]━❍\n\nName: ${name}\nFacebook URL: https://facebook.com/${username}\nUID: ${id}\n\n❍━━━━━━━━━━━━❍`,
          attachment: fs.createReadStream(__dirname + '/cache/Image.png'),
        },
        threadID,
        () => fs.unlinkSync(__dirname + '/cache/Image.png'),
        messageID
      );
    };

    return request(encodeURI(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
      .pipe(fs.createWriteStream(__dirname + '/cache/avt.png'))
      .on('close', callback);
  } catch (err) {
    console.log(err);
    return global.api.sendMessage('Error', threadID);
  }
};

export default {
  config,
  onCall
};
