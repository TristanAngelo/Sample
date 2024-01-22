import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const config = {
  name: 'sayjap',
  description: 'Japanese text to speech.',
  credits: 'Grim',
  usage: '[text]',
  cooldown: 10,
};

async function onCall({ message, args }) {
  try {
    const text = args.join(' ');
    if (!text) {
      message.reply('Please provide a text.');
      return;
    }
    const response = await axios.get(`https://api.tts.quest/v3/voicevox/synthesis?text=${encodeURIComponent(text)}&speaker=1`);
    const { mp3StreamingUrl } = response.data;
    if (mp3StreamingUrl) {
      const fpath = path.join(global.cachePath, `${message.threadID}_wtts.${uuidv4()}.mp3`);
      const response1 = await axios.get(mp3StreamingUrl, {
        responseType: 'arraybuffer',
      });
      fs.writeFileSync(fpath, response1.data);
      message.reply({
        attachment: fs.createReadStream(fpath),
      }, () => {
        fs.unlinkSync(fpath);
      });
    } else {
      message.reply("Couldn't generate tts at the moment, please try again later.");
    }
  } catch (error) {
    console.error(error);
    message.reply('An error occurred.');
  }
}

export default {
  config,
  onCall,
};
