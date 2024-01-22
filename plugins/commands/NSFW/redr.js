import axios from 'axios';
import fs from 'fs';
import path from 'path';
import request from 'request';

const cooldowns = {};

const config = {
  name: "redroomv2",
  version: "1.5.8",
  permissions: [1, 2],
  credits: "Hazeyy",
  description: "( 𝙍𝙖𝙣𝙙𝙤𝙢 𝙍𝙚𝙙𝙧𝙤𝙤𝙢𝙫2 𝙑𝙞𝙙𝙨 )",
  usage: ["redroomv2"],
  cooldown: 300,
  nsfw: true
};

async function onCall({ api, message }) {
  const threadID = message.threadID;
  try {
    const userId = message.senderID;
    if (
      cooldowns[userId] &&
      Date.now() - cooldowns[userId] < config.cooldown * 1000
    ) {
      const remainingTime = Math.ceil(
        (cooldowns[userId] +
          config.cooldown * 1000 -
          Date.now()) /
          1000
      );
      message.reply(
        `🕦 𝖧𝖾𝗒 𝖺𝗋𝖾 𝗒𝗈𝗎 𝗌𝗍𝗎𝗉𝗂𝖽? 𝖼𝖺𝗇\'𝗍 𝗒𝗈𝗎 𝗌𝖾𝖾? 𝖨\'𝗆 𝗈𝗇 𝖼𝗈𝗈𝗅𝖽𝗈𝗐𝗇 𝗂𝗇 [ ${remainingTime} ] 𝗌𝖾𝖼𝗈𝗇𝖽𝗌,  `,
        threadID
      );
      return;
    }

    const args = message.body.split(/\s+/);
    args.shift();

    message.react("💽");
    global.api.sendMessage("📀 | 𝘚𝘦𝘯𝘥𝘪𝘯𝘨 𝘷𝘪𝘥𝘦𝘰...", threadID);

    let url = "https://hazeyy-redroom-v2-api.kyrinwu.repl.co";

    let response = await axios.get(url + "/files");
    let data = response.data;
    let getFiles = await axios.get(url + "/" + data.file, {
      responseType: "arraybuffer",
    });

    const randomFileName = `${Math.floor(Math.random() * 99999999)}${data.type}`;
    const filePath = path.join(
    global.cachePath, randomFileName
  );

    fs.writeFileSync(filePath, Buffer.from(getFiles.data, 'binary'));

    const replyMessage = {
      body: "🎥 𝖧𝖾𝗋𝖾\'𝗌 𝗒𝗈𝗎𝗋 𝗏𝗂𝖾𝗈 𝗐𝖺𝗍𝖼𝗁 𝗐𝖾𝗅𝗅.",
      attachment: fs.createReadStream(filePath),
    };

    global.api.sendMessage(replyMessage, threadID);

    cooldowns[userId] = Date.now();

    global.api.sendMessage(
      "📬 | 𝖱𝖾𝗆𝗂𝗇𝖽𝖾𝗋: 𝖳𝗁𝖾 𝗏𝗂𝖽𝖾𝗈 𝗐𝗂𝗅𝗅 𝖻𝖾 𝗌𝖾𝗇𝗍 𝗂𝗇 𝖺 𝖿𝖾𝗐 𝗆𝗂𝗇𝗎𝗍𝖾𝗌, 𝖯𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍 𝖿𝗈𝗋 𝖺 𝗆𝗈𝗆𝖾𝗇𝗍.",
      threadID
    );
  } catch (error) {
    console.error('🔴 𝗘𝗿𝗿𝗼𝗿 𝗳𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗼𝗿 𝘀𝗲𝗻𝗱𝗶𝗻𝗴 𝘁𝗵𝗲 𝘃𝗶𝗱𝗲𝗼', error);
    global.api.sendMessage('🔴 𝗘𝗿𝗿𝗼𝗿 𝘀𝗲𝗻𝗱𝗶𝗻𝗴 𝘃𝗶𝗱𝗲𝗼', threadID);
  }
}

export default {
  config,
  onCall,
};
