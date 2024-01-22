import fs from 'fs-extra';
import axios from 'axios';
import path from 'path';

export const config = {
  name: "rem",
  version: "1.0.1",
  credits: `Deku (fixed by Siegfried Sama)`,
  description: "GFX Banner.",
  usage: "[text]",
  cooldown: 5,
};

export async function onCall({ api, message, args, Users, prefix }) {
  let { threadID, messageID } = message;
  let pathImg = path.join(
    global.cachePath,
    `${Date.now()}_gfx5_${message.messageID}.png`
  );
  let text = args.join(" ");
  if (text.length > 5) {
    return global.api.sendMessage("Maximum of 5 characters allowed.", threadID, messageID);
  }
  if (!text) return global.api.sendMessage(`Wrong fomat\nUse: ${prefix}${config.name} [text]`, message.threadID, message.messageID);
  let getWanted = (
    await axios.get(`https://tanjiro-api.onrender.com/gfx5?text=${text}&api_key=tanjiro`, {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathImg, Buffer.from(getWanted, "utf-8"));
  return global.api.sendMessage(
    { attachment: fs.createReadStream(pathImg) },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};