import axios from 'axios';
import fs from 'fs-extra';
import ytdl from 'ytdl-core';
import yts from 'yt-search';
import path from 'path';

const config = {
  name: 'sing',
  version: '2.0.4',
  credits: 'KSHITIZ/kira (Converted by Dymyrius)',
  description: 'Play a song with lyrics.',
  usage: '[title]',
  cooldown: 5,
};

async function onCall({ message }) {
  const input = message.body;
  const text = input.substring(12);
  const data = input.split(' ');

  if (data.length < 2) {
    return message.reply('Please write music name.');
  }

  data.shift();
  const song = data.join(' ');

  try {
    await message.reply(`Searching for "${song}". ⏳`)

    const res = await axios.get(`https://api.popcat.xyz/lyrics?song=${encodeURIComponent(song)}`);
    const lyrics = res.data.lyrics || 'Not found!';
    const title = res.data.title || 'Not found!';
    const artist = res.data.artist || 'Not found!';

    const searchResults = await yts(song);
    if (!searchResults.videos.length) {
      return message.reply('Error: Invalid request.');
    }

    const video = searchResults.videos[0];
    const videoUrl = video.url;

    const stream = ytdl(videoUrl, { filter: 'audioonly' });

    const filePath = path.join(
    global.cachePath, `${Date.now()}_sing_${message.messageID}.mp3`);
    stream.pipe(fs.createWriteStream(filePath));

    stream.on('response', () => {
      console.info('[DOWNLOADER]', 'Starting download now!');
    });

    stream.on('info', (info) => {
      console.info('[DOWNLOADER]', `Downloading ${info.videoDetails.title} by ${info.videoDetails.author.name}`);
    });

    stream.on('end', () => {
      console.info('[DOWNLOADER] Downloaded');

      if (fs.statSync(filePath).size > 26214400) {
        fs.unlinkSync(filePath);
        return message.reply('[ERR] The file could not be sent because it is larger than 25MB.');
      }

      const messages = {
        body: `❏ 𝗧𝗶𝘁𝗹𝗲: ${title}\n❏ 𝗔𝗿𝘁𝗶𝘀𝘁: ${artist}\n━━━━━━[𝗟𝘆𝗿𝗶𝗰𝘀]━━━━━━\n${lyrics}`,
        attachment: fs.createReadStream(filePath),
      };
      message.reply(messages, (err) => {
        if (err) {
          console.error('[ERROR]', err);
                             }
        fs.unlinkSync(filePath);
      });
    });
  } catch (error) {
    console.error('[ERROR]', error);
    message.reply('Try again later.');
  }
};

export default {
  config,
  onCall,
};
