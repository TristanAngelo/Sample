import axios from 'axios';
import fs from 'fs';
import path from 'path';
import request from 'request';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const config = {
  name: "rr",
  version: "1",
  permissions: [2],
  credits: "MARJHUN BAYLON",
  description: "BOLD IS BETTER THAN CHEATING",
  cooldown: 300,
  nsfw: true
  
};

async function onCall({ api, message }) {
  try {
    axios.get('https://jhunapi.mrbaylon4.repl.co/nsfw/?apikey=Marjhunapi').then(async (res) => {
      const ext = res.data.url.substring(res.data.url.lastIndexOf(".") + 1);
      const rrPath = path.join(
    global.cachePath, `codm.${ext}`
  );
      const callback = function () {
        global.api.sendMessage({
          body: "YOUR REDROOM REQUEST IS DONE MY SENPAI",
          attachment: fs.createReadStream(rrPath)
        }, message.threadID, () => fs.unlinkSync(rrPath), message.messageID);
      };
      request(res.data.url).pipe(fs.createWriteStream(rrPath)).on("close", callback);
    }).catch((err) => {
      global.api.sendMessage("[ CODM ]\nApi error status: 200\nContact the owner to fix immediately", message.threadID, message.messageID);
      global.api.setMessageReaction("❌", message.messageID, (err) => {}, true);
    });
  } catch (error) {
    console.error('Error fetching or sending the video', error);
    global.api.sendMessage("Error sending video", message.threadID);
  }
}

export default {
  config,
  onCall
};
