import fs from 'fs';
import request from 'request';
import axios from 'axios';
import path from 'path';

export default {
  config: {
    name: 'animeme',
    aliases: ['anime-meme'],
    author: 'Xemon',
    version: '1.0.0',
    description: 'Get random anime meme from reddit',
    usage: ""
  },

  onCall: async function({ message }) {

    try {
      const response = await axios.get('https://www.reddit.com/r/anime_irl+animemes+Animemes+Memes_Of_The_Dank+awwnime/top.json?sort=top&t=week&limit=100');
      const posts = response.data.data.children;
      const post = posts[Math.floor(Math.random() * posts.length)].data;

      const title = post.title;
      const imageUrl = post.url;
      const imgPath = path.join(global.cachePath, `${message.threadID}_animeme.png`)

      const callback = () => {
        message.reply({
          body: `Title: ${title}`,
          attachment: fs.createReadStream(imgPath)
        }, () => fs.unlinkSync(imgPath));
      };

      request(encodeURI(imageUrl)).pipe(fs.createWriteStream(imgPath)).on('close', callback);
    } catch (error) {
      console.error(error);
      await message.reply('Error occurred while fetching an anime meme!');
    }
  }
};