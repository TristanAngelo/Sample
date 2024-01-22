import fs from 'fs';
import ytdl from '@neoxr/ytdl-core';
import yts from 'yt-search';
import tinyurl from 'tinyurl';
import path from 'path';

export default {
  config: {
    name: "esaudio",
    version: "1.3",
    credits: "JARiF",
    cooldown: 5,
    description: 'Extract the audio from the video or search for a song.',
    usage: '[reply to a video | song name]'
  },

  onCall: async function({ message }) {
    try {
      if (message.type === "message_reply" && ["audio", "video"].includes(message.messageReply.attachments[0].type)) {
        const attachmentUrl = message.messageReply.attachments[0].url;
        const urls = await tinyurl.shorten(attachmentUrl) || args.join(' ');
        const response = await axios.get(`https://www.api.vyturex.com/songr?url=${urls}`);

        if (response.data && response.data.title) {
          const song = response.data.title;
          const originalMessage = await message.reply(`Searching for "${song}"...`);
          const searchResults = await yts(song);

          if (!searchResults.videos.length) {
            return message.reply("Error: Song not found.");
          }

          const video = searchResults.videos[0];
          const videoUrl = video.url;
          const stream = ytdl(videoUrl, { filter: "audioonly" });
          const filePath = path.join(global.cachePath, `${message.threadID}_$extracted_audio.mp3`);

          stream.pipe(fs.createWriteStream(filePath));

          stream.on('response', () => {
            console.info('[DOWNLOADER]', 'Starting download now!');
          });

          stream.on('info', (info) => {
            console.info('[DOWNLOADER]', `Downloading ${info.videoDetails.title} by ${info.videoDetails.author.name}`);
          });

          stream.on('end', async () => {
            console.info('[DOWNLOADER] Downloaded');
            if (fs.statSync(filePath).size > 87380608) {
              fs.unlinkSync(filePath);
              return message.reply('[ERR] The file could not be sent because it is larger than 83mb.');
            }
            const replyMessage = {
              body: `Title: ${video.title}\nArtist: ${video.author.name}`,
              attachment: fs.createReadStream(filePath),
            };
            await global.api.unsendMessage(originalMessage.messageID);
            await message.reply(replyMessage, () => {
              fs.unlinkSync(filePath);
            });
          });
        } else {
          return message.reply("Error: Song information not found.");
        }
      } else {
        const input = message.body;
        const text = input.substring(12);
        const data = input.split(" ");

        if (data.length < 2) {
          return message.reply("Please put a song");
        }

        data.shift();
        const song = data.join(" ");
        const originalMessage = await message.reply(`Searching your song named "${song}"...`);
        const searchResults = await yts(song);

        if (!searchResults.videos.length) {
          return message.reply("Error: Invalid request.");
        }

        const video = searchResults.videos[0];
        const videoUrl = video.url;
        const stream = ytdl(videoUrl, { filter: "audioonly" });
        const filePath = path.join(global.cachePath, `${message.threadID}_extracted_audio.mp3`);

        stream.pipe(fs.createWriteStream(filePath));

        stream.on('response', () => {
          console.info('[DOWNLOADER]', 'Starting download now!');
        });

        stream.on('info', (info) => {
          console.info('[DOWNLOADER]', `Downloading ${info.videoDetails.title} by ${info.videoDetails.author.name}`);
        });

        stream.on('end', async () => {
          console.info('[DOWNLOADER] Downloaded');
          if (fs.statSync(filePath).size > 26214400) {
            fs.unlinkSync(filePath);
            return message.reply('[ERR] The file could not be sent because it is larger than 25MB.');
          }
          const replyMessage = {
            body: `Title: ${video.title}\nArtist: ${video.author.name}`,
            attachment: fs.createReadStream(filePath),
          };
          await global.api.unsendMessage(originalMessage.messageID);
          await message.reply(replyMessage, () => {
            fs.unlinkSync(filePath);
          });
        });
      }
    } catch (error) {
      console.error('[ERROR]', error);
      message.reply("This song is not available.");
    }
  },
};