import axios from 'axios';
import fs from 'fs';
import path from 'path';

export const config = {
  name: "flame",
  version: "1.1",
  permission: 0,
  credits: "Hazeyy (Converted by Grim)",
  description: "( 𝙁𝙡𝙖𝙢𝙚 𝙂𝙞𝙛 𝙏𝙚𝙭𝙩 )",
  usage: "[text]",
  cooldown: 3,
};

export async function onCall({ message }) {
  const body = message.body || '';
  const args = body.split(/\s+/);
  args.shift();

  const text = args.join(" ");

  if (!text)
    return message.reply("✨ 𝙷𝚎𝚕𝚕𝚘 𝚝𝚘 𝚞𝚜𝚎 𝙵𝚕𝚊𝚖𝚎 𝙶𝚒𝚏, \n\n𝚄𝚜𝚎: 𝚏𝚕𝚊𝚖𝚎 [ 𝚝𝚎𝚡𝚝 ] 𝚝𝚘 𝚌𝚘𝚗𝚟𝚎𝚛𝚝 𝚝𝚎𝚡𝚝 𝚒𝚗𝚝𝚘 𝚐𝚒𝚏.");

  const wait = await message.reply("🕟 | 𝙲𝚘𝚗𝚟𝚎𝚛𝚝𝚒𝚗𝚐 𝚢𝚘𝚞𝚛 𝚝𝚎𝚡𝚝 𝚒𝚗𝚝𝚘 𝙶𝚒𝚏, 𝚙𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝...");

  try {
    const url = `https://hazeyy-apis-combine.kyrinwu.repl.co/api/gen/flame?text=${text}`;
    const response = await axios.get(url, { responseType: "stream" });
    const data = response.data;
    const pathImg = path.join(global.cachePath, `${message.messageID}_flame.gif`);

    await new Promise((resolve) => {
      data.pipe(fs.createWriteStream(pathImg)).on("close", resolve);
    });

    const combinedMessage = {
      body: "🟢 | 𝙷𝚎𝚛𝚎'𝚜 𝚢𝚘𝚞𝚛 𝚌𝚘𝚗𝚟𝚎𝚛𝚝𝚎𝚍 𝚝𝚎𝚡𝚝 𝚒𝚗𝚝𝚘 𝙶𝚒𝚏!",
      attachment: fs.createReadStream(pathImg),
    };

    global.api.unsendMessage(wait.messageID);
    message.reply(combinedMessage);

    // Delete the file after sending it
    fs.unlink(pathImg, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("File deleted successfully");
      }
    });
  } catch (error) {
    console.error(error);
    message.reply("🔴 | 𝙴𝚛𝚛𝚘𝚛 𝚐𝚎𝚗𝚎𝚛𝚊𝚝𝚒𝚗𝚐 𝚏𝚕𝚊𝚖𝚎 𝙶𝚒𝚏.");
  }
};
