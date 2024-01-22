import axios from 'axios';
import request from 'request';
import fs from 'fs';
import path from 'path';

export const config = {
  name: "randomanime",
  version: "1",
  credits: "MARJHUN BAYLON (Converted by Grim)", // WAG MO PALITAN CRED KUNDI MAG SISISI KA
  description: "Random anime video",
  cooldown: 10,
  usage: ""
};

export async function onCall({ message }) {
  try {
    message.react("⏳");
    const response = await axios.get('https://jhunapi.mrbaylon4.repl.co/snauzk/?apikey=Marjhunapi');
    const ext = response.data.url.substring(response.data.url.lastIndexOf(".") + 1);
    const animePath = path.join(global.cachePath, `randomanime_${message.threadID}.${ext}`);
    
    const callback = () => {
      message.react("☑️");
      message.reply({
        body: `🎥 | YOUR ANIME REQUEST IS DONE MY SENPAI`,
        attachment: fs.createReadStream(animePath)
      }, () => fs.unlinkSync(animePath));
    };
    
    request(response.data.url).pipe(fs.createWriteStream(animePath)).on("close", callback);
  } catch (err) {
    message.reply("[ ANIME ]\nApi error status: 200\nContact the owner to fix immediately");
    message.react("❌");
  }
}
