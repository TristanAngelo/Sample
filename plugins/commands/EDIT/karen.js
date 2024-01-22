import fs from 'fs-extra';
import axios from 'axios';
import path from 'path';

export const config = {
    name: "karen",
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
    `${Date.now()}_gfx2_${message.messageID}.png`
  );
  let text = args.join(" ");
  if (text.length > 6) {
    return global.api.sendMessage("Maximum of 6 characters allowed.", threadID, messageID);
  }
  if (!text) return global.api.sendMessage(`Wrong fomat\nUse: ${prefix}${config.name} text`, threadID, messageID);
  let getWanted = (
    await axios.get(`https://tanjiro-api.onrender.com/gfx2?name=${text}&api_key=tanjiro`, {
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