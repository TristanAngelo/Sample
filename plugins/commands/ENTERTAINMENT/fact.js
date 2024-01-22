import fs from 'fs';
import request from 'request';
import path from 'path';

export const config = {
  name: "fact",
  version: "1.0.1",
  credits: "Joshua Sy (Converted by Grim)",
  description: "",
  usage: "text",
  cooldown: 5,
};

export async function onCall({ message, args }) {
  {
    let text = args.toString().replace(/,/g, '  ');
    if (!text)
      return message.reply("Add text lmao.");

    const imagePath = path.join(global.cachePath, `${message.threadID}_${Date.now()}_facts.jpg`);

    var callback = () => message.reply({ body: `FACTS`, attachment: fs.createReadStream(imagePath) }, () => fs.unlinkSync(imagePath));
    return request(encodeURI(`https://api.popcat.xyz/facts?text=${text}`)).pipe(fs.createWriteStream(imagePath)).on('close', () => callback());
  }
}
