import axios from 'axios';
import fs from 'fs';
import path from 'path';
import stream from 'stream';


async function getStream(url) {
  const response = await axios.get(url, { responseType: 'stream' });
  return response.data;
}

export const config = {
  name: "cornhub",// api from jarif
  aliases: [],
  author: "kshitiz",
  version: "2.0",
  cooldown: 5,
  description: "Play a video from 🌽hub.",
  usage: "[category] (example: !cornhub sex)\nReply by number.",
  nsfw: true
};

export async function onCall({ message, args, prefix }) {
  const category = args.join(' ');

  if (!category) {
    message.reply({ body: `Please provide a category. (${prefix}${config.name} sex)`, mentions: [{ tag: 'pornhub', id: '100049894418762' }] });
    return;
  }

  try {
    message.react("🌽");
    const { data } = await axios.get(`https://project-pornhub.onrender.com/ph?q=${category}&fbclid=IwAR0C2yig1ndXdOKrkbMg98OKIlNG-irVi9f_2q8NjvK03Ep3WYuf4nyvY44`);

    if (!data || data.length === 0) {
      message.reply({ body: `No titles found for the category: ${category}.` });
      return;
    }

    const titles = data.map((video, index) => `${index + 1}. ${video.title}`);
    const messages = 'Choose a video by replying with its number:\n\n' + titles.join('\n');

    const tempFilePath = path.join(global.cachePath, `${message.threadID}_cornhub_response.json`);
    fs.writeFileSync(tempFilePath, JSON.stringify(data));

    message.react("✅");
    message.reply(messages)
      .then((d) => {
        d.addReplyEvent({
          callback: handleReply,
          category: category,
          tempFilePath: tempFilePath
        });
      });
  } catch (error) {
    console.error(error);
    message.reply('An error occurred while fetching data.\nPlease try again later.');
  }
};

async function handleReply({ eventData, message }) {
  const { author, tempFilePath } = eventData;

  if (message.senderID !== author || !tempFilePath) {
    return;
  }

  const videoIndex = parseInt(message.body);
  if (isNaN(videoIndex) || videoIndex < 1) {
    message.reply("Please reply with a valid number corresponding to the question.");
    return;
  }

  try {
    message.reply("⏳ | Sending video, please wait..")
    const data = JSON.parse(fs.readFileSync(tempFilePath, 'utf-8'));

    if (!data || data.length === 0 || videoIndex > data.length) {
      message.reply('Invalid video number. Please choose a number within the range.');
      return;
    }

    const selectedVideo = data[videoIndex - 1];
    const videoUrl = selectedVideo.video_url;

    if (!videoUrl) {
      message.reply('Error: Video not found.');
      return;
    }

    const videoStream = await getStream(videoUrl);

    await message.reply({
      body: 'Here is your video:',
      attachment: videoStream,
    });
  } catch (error) {
    console.error(error);
    message.reply('An error occurred while processing the video.\nPlease try again later.');
  }
};
