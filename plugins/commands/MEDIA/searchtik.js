import axios from 'axios';
import fs from 'fs';
import path from 'path';

export default {
  config: {
    name: "tiksearch",
    version: "2.0",
    credits: "kshitiz (Converted by Grim)",
    cooldown: 20,
    description: "Search for TikTok videos",
    usage: "[search text]"
  },

  onCall: async function({ args, message, prefix }) {
    const { messageID, threadID } = message;
    const searchQuery = args.join(" ");

    if (!searchQuery) {
      message.reply(`Usage: ${prefix}tiksearch <search text>`);
      return;
    }

    let searchMessageID;

    message.reply("🔍 | Searching, please wait...", (err, messageInfo) => {
      searchMessageID = messageInfo.messageID;
    });

    try {
      const apiUrl = `https://hiroshi.hiroshiapi.repl.co/tiktok/searchvideo?keywords=${encodeURIComponent(searchQuery)}`;

      const response = await axios.get(apiUrl);
      const videos = response.data.data.videos;

      if (!videos || videos.length === 0) {
        message.reply("No TikTok videos found for your query.");
      } else {
        const videoData = videos[0];
        const videoUrl = videoData.play;
        const messages = `Posted by: ${videoData.author.unique_id}`;
        const filePath = path.join(global.cachePath, `${threadID}_tiksearch_video.mp4`);
        const writer = fs.createWriteStream(filePath);

        const videoResponse = await axios({ method: 'get', url: videoUrl, responseType: 'stream' });
        videoResponse.data.pipe(writer);

        writer.on('finish', async () => {

          await message.reply({
            body: messages,
            attachment: fs.createReadStream(filePath)
          });

          fs.unlinkSync(filePath);

          if (searchMessageID) {
            global.api.unsendMessage(searchMessageID);
          }
        });
      }
    } catch (error) {
      console.error('Error:', error);
      message.reply("An error occurred while processing the request.");
      if (searchMessageID) {
        global.api.unsendMessage(searchMessageID);
      }
    }
  }
};