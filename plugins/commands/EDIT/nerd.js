import fs from 'fs-extra';
import axios from 'axios';
import path from 'path';

export const config = {
  name: "nerd",
  version: "1.0.1",
  credits: `Deku (fixed by Siegfried Sama)`,
  description: "GFX Banner.",
  usage: "[text]",
  cooldown: 5,
};

export async function onCall({ api, message, args, Users, prefix }) {
  let { senderID, threadID, messageID } = message;
  let pathImg = path.join(
    global.cachePath,
    `${Date.now()}_gfx4_${message.messageID}.png`
  );
  let [text1, text2] = args.join(' ').split('|').map((text) => text.trim());
  if (text1 && text1.length > 5) {
    return global.api.sendMessage("Maximum of 5 characters allowed.", threadID, messageID);
  }
  if (text2 && text2.length > 5) {
    return global.api.sendMessage("Maximum of 5 characters allowed.", threadID, messageID);
  }
  if (!text1 || !text2) {
    return global.api.sendMessage(
      `Wrong format\nUse: ${prefix}${config.name} [text1] | [text2]`,
      threadID,
      messageID
    );
  }

  let getWanted = (
    await axios.get(`https://tanjiro-api.onrender.com/gfx4?text=${text1}&text2=${text2}&api_key=tanjiro`, {
      responseType: 'arraybuffer',
    })
  ).data;
  fs.writeFileSync(pathImg, Buffer.from(getWanted, 'utf-8'));
  return global.api.sendMessage(
    { attachment: fs.createReadStream(pathImg) },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
}
