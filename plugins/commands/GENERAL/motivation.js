import axios from 'axios';
import { createReadStream, unlinkSync } from 'fs';
import { resolve } from 'path';
import fs from 'fs';

export default {
  config: {
    name: 'motivation',
    aliases: [],
    credits: 'kshitiz',
    version: '2.0',
    cooldown: 5,
    description: 'get a random inspirational quote with audio',
    usage: ''
  },
  onCall: async function({ message }) {
    const apiKey = '0Hr3RnpBTgQvQ9np4ibDrQ==CkYJq9yAT5yk6vIn';
    const category = 'inspirational';

    try {

      const response = await axios.get(`https://api.api-ninjas.com/v1/quotes?category=${category}`, {
        headers: {
          'X-Api-Key': apiKey,
          'Content-Type': 'application/json',
        },
      });

      const quote = response.data[0].quote;

      const cacheFilePath = resolve(global.cachePath, `${message.threadID}_randomQuote.txt`);
      await fs.promises.writeFile(cacheFilePath, quote);

      const languageToSay = 'en';
      const audioFilePath = resolve(global.cachePath, `${message.threadID}_motivation_${message.senderID}.mp3`);
      await global.utils.downloadFile(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(quote)}&tl=${languageToSay}&client=tw-ob`, audioFilePath);

      message.reply({ attachment: createReadStream(audioFilePath), body: quote }, () => {
        unlinkSync(audioFilePath);
        unlinkSync(cacheFilePath);
      });
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      message.reply(`Error fetching the quote. Details: ${error.message}`);
    }
  },
};
