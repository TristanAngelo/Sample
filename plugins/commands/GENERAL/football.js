import axios from 'axios';
import path from 'path';
import fs from 'fs';

export default {
  config: {
    name: "football",
    aliases: [],
    credits: "kshitiz",
    version: "2.0",
    cooldown: 5,
    description: "get latest football updates",
    usage: "click on vdo url"
  },
  
  onCall: async function ({ message }) {
    try {
      const response = await axios.get('https://free-football-soccer-videos.p.rapidapi.com/', {
        headers: {
          'X-RapidAPI-Key': 'b38444b5b7mshc6ce6bcd5c9e446p154fa1jsn7bbcfb025b3b',
          'X-RapidAPI-Host': 'free-football-soccer-videos.p.rapidapi.com'
        }
      });

      const randomVideoIndex = Math.floor(Math.random() * response.data.length);
      const randomVideo = response.data[randomVideoIndex];

      const title = randomVideo.title;
      const thumbnail = randomVideo.thumbnail;
      const videoUrl = randomVideo.url;


      const tempFilePath = path.join(global.cachePath, `${message.threadID}_tempApiResponse.json`);
      fs.writeFileSync(tempFilePath, JSON.stringify(response.data));


      const cacheDirectory = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDirectory)) {
        fs.mkdirSync(cacheDirectory, { recursive: true });
      }
      const cacheFilePath = path.join(cacheDirectory, 'thumbnailCache.jpg');


      const thumbnailResponse = await axios.get(thumbnail, { responseType: 'stream' });


      const thumbnailWriteStream = fs.createWriteStream(cacheFilePath);
      thumbnailResponse.data.pipe(thumbnailWriteStream);


      await new Promise((resolve, reject) => {
        thumbnailWriteStream.on('finish', resolve);
        thumbnailWriteStream.on('error', reject);
      });


      const message = `𝗧𝗜𝗧𝗜𝗟𝗘 : ${title}\n│ 𝗗𝗘𝗧𝗔𝗜𝗟𝗦&𝗩𝗗𝗢_𝗨𝗥𝗟: ${videoUrl}`;


      api.sendMessage(
        { body: message, attachment: fs.createReadStream(cacheFilePath) },
        event.threadID,
        () => {

          fs.unlinkSync(cacheFilePath);

          fs.unlinkSync(tempFilePath);
        }
      );
    } catch (error) {
      console.error(error);

    }
  }
};