import axios from 'axios';
import fs from 'fs';
import path from 'path';

export const config = {
  name: "remini",
  version: "2.2",
  hasPermssion: 0,
  credits: "Hazeyy",
  description: "( 𝚁𝚎𝚖𝚒𝚗𝚒 )",
  commandCategory: "𝚗𝚘 𝚙𝚛𝚎𝚏𝚒𝚡",
  usages: "( 𝙴𝚗𝚌𝚑𝚊𝚗𝚌𝚎 𝙸𝚖𝚊𝚐𝚎𝚜 )",
  cooldowns: 2,
};

export async function onCall({ message }) {
  const args = message.body.split(/\s+/);
  args.shift();

  const pathie = path.join(global.cachePath, `${message.threadID}_${Date.now()}_enhanced.jpg`);

  const photoUrl = message.messageReply.attachments[0] ? message.messageReply.attachments[0].url : args.join(" ");

  if (!photoUrl) {
    message.reply("📸 | 𝙿𝚕𝚎𝚊𝚜𝚎 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚙𝚑𝚘𝚝𝚘 𝚝𝚘 𝚙𝚛𝚘𝚌𝚎𝚎𝚍 𝚎𝚗𝚑𝚊𝚗𝚌𝚒𝚗𝚐 𝚒𝚖𝚊𝚐𝚎𝚜.");
    return;
  }

  const wait = await message.reply("🕟 | 𝙴𝚗𝚑𝚊𝚗𝚌𝚒𝚗𝚐, 𝚙𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝 𝚏𝚘𝚛 𝚊 𝚖𝚘𝚖𝚎𝚗𝚝..");
    try {
      const response = await axios.get(`https://code-merge-api-hazeyy01.replit.app/api/try/remini?url=${encodeURIComponent(photoUrl)}`);
      const processedImageURL = response.data.image_data;
      const img = (await axios.get(processedImageURL, { responseType: "arraybuffer" })).data;

      fs.writeFileSync(pathie, Buffer.from(img, 'binary'));

      message.reply({
        body: "✨ 𝙴𝚗𝚑𝚊𝚗𝚌𝚎𝚍 𝚂𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢",
        attachment: fs.createReadStream(pathie)
      }, () => fs.unlinkSync(pathie));
    } catch (error) {
      message.reply(`🚫 𝙴𝚛𝚛𝚘𝚛 𝚙𝚛𝚘𝚌𝚎𝚜𝚜𝚒𝚗𝚐 𝚒𝚖𝚊𝚐𝚎: ${error}`);
    }
};
