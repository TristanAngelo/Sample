import axios from 'axios';
import fs from 'fs';
import path from 'path';

export const config = {
  name: "randomcapcut",
  version: "1.0.0",
  credits: "Kim Joseph DG Bien",
  description: "Random CapCut Template Video",
  usage: "",
  cooldown: 15,
};

export async function onCall({ message }) {
  try {
    const wait = await message.reply("⏳ | Getting random template...");

    const response = await axios.get('https://random-capcut-template-video.hiroshiapi.repl.co/');
    const videoData = response.data;

    const filePath = path.join(global.cachePath, `${message.threadID}_${message.senderID}_capcutrandom.mp4`);
    const writer = fs.createWriteStream(filePath);

    const videoResponse = await axios({
      method: 'get',
      url: videoData.hiroMP4,
      responseType: 'stream'
    });

    videoResponse.data.pipe(writer);

    writer.on('finish', () => {
      global.api.unsendMessage(wait.messageID);
      message.reply(
        {
          body: `𝐑𝐚𝐧𝐝𝐨𝐦 𝐂𝐚𝐩𝐂𝐮𝐭 𝐓𝐞𝐦𝐩𝐥𝐚𝐭𝐞:\n\n𝐓𝐢𝐭𝐥𝐞: ${videoData.Title}\n𝐏𝐨𝐬𝐭 𝐛𝐲: ${videoData.Name}\n𝐋𝐢𝐧𝐤: ${videoData.tempLINK}`,
          attachment: fs.createReadStream(filePath),
        },
        () => fs.unlinkSync(filePath)
      );
    });

  } catch (error) {
    console.error('Error:', error);
    message.reply("An error occurred while processing the request.");
  }
};
