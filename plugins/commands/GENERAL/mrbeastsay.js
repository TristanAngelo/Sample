import axios from 'axios';
import fs from 'fs';
import { resolve } from 'path';
import { createReadStream, unlinkSync } from 'fs';

const config = {
  name: 'mrbeastsay',
  aliases: ['mrbeast'],
  version: '1.0.0',
  credits: 'Grim',
  description: 'Mr. Beast talk to speech.',
  usage: '[query]',
  cooldown: 5,
};

async function downloadFile(url, destinationPath) {
  const response = await axios.get(url, { responseType: 'stream' });
  const writer = fs.createWriteStream(destinationPath);

  return new Promise((resolve, reject) => {
    response.data.pipe(writer);

    writer.on('finish', () => {
      writer.close();
      resolve();
    });

    writer.on('error', (error) => {
      reject(error);
    });
  });
}

async function onCall({ message, args }) {
  const chat = args.join(' ');

  try {
    message.react("⏳");
    const audioApi = await axios.get(`https://www.api.vyturex.com/beast?query=${encodeURIComponent(chat)}`);
    const audioUrl = audioApi.data.audio;
    const text = audioApi.data.txt;

    const audioPath = resolve(global.cachePath, `mrbeast_${message.threadID}_${message.senderID}.mp3`);
    await downloadFile(audioUrl, audioPath);
    const att = createReadStream(audioPath);

    await message.react('✅');
    message.reply({ body: `Text: ${text}`, attachment: att }, () => {
      unlinkSync(audioPath);
    });
  } catch (error) {
    console.error(error);
    message.reply('An error occurred while processing your request.');
  }
}

export default {
  config,
  onCall,
};
