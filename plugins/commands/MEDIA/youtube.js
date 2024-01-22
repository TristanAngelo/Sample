import fs from 'fs';
import path from 'path';
import ytdl from '@distube/ytdl-core';
import yts from 'yt-search';

export const config = {
  name: "youtube",
  version: "1.0",
  credits: "kshitiz",
  cooldown: 20,
  description: "send YouTube video",
  usage: "<video name>"
};

export async function onCall({ message }) {
  const input = message.body;
  const data = input.split(" ");

  if (data.length < 2) {
    return message.reply("Please specify a video name.");
  }

  data.shift();
  const videoName = data.join(" ");

  try {
    message.reply(`✅ | Searching video for "${videoName}".\n⏳ | Please wait...`);

    const searchResults = await yts(videoName);
    if (!searchResults.videos.length) {
      return message.reply("No video found.");
    }

    const video = searchResults.videos[0];
    const videoUrl = video.url;

    const stream = ytdl(videoUrl, { filter: "audioandvideo" });

    const filePath = path.join(global.cachePath, `${message.threadID}_${message.senderID}.mp4`);

    stream.pipe(fs.createWriteStream(filePath));

    stream.on('response', () => {
      console.info('[DOWNLOADER]', 'Starting download now!');
    });

    stream.on('info', (info) => {
      console.info('[DOWNLOADER]', `Downloading video: ${info.videoDetails.title}`);
    });

    stream.on('end', () => {
      console.info('[DOWNLOADER] Downloaded');

      if (fs.statSync(filePath).size > 26214400) {
        fs.unlinkSync(filePath);
        return message.reply('The file could not be sent because it is larger than 25MB.');
      }

      const messages = {
        body: `📹 | Here's your video\n\n🔮 | Title: ${video.title}\n⏰ | Duration: ${video.duration.timestamp}`,
        attachment: fs.createReadStream(filePath)
      };

      message.reply(messages, () => {
        fs.unlinkSync(filePath);
      });
    });
  } catch (error) {
    console.error('[ERROR]', error);
    message.reply(' An error occurred while processing the command.');
  }
};