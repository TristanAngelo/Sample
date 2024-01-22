import path from 'path';
import { join } from 'path';
import { loadImage, createCanvas } from 'canvas';

const config = {
  name: 'skkagawad',
  aliases: ['kagawad', 'sk'],
  version: '1.0',
  credits: 'Grim',
  cooldown: 5,
  description: 'Generate your poster for SK Kagawad!',
  usage: '',
};

let imageUrls = [
  "https://i.imgur.com/plIyEWO.png",
  "https://i.imgur.com/tyJnFJh.png",
  "https://i.imgur.com/UuamNr6.png",
  "https://i.imgur.com/H6l3HVy.png",
  "https://i.imgur.com/lPYQq1M.png",
  "https://i.imgur.com/8RyTsr9.png",
  "https://i.imgur.com/2xpHyW6.png",
  "https://i.imgur.com/3tjbS7r.png",
  "https://i.imgur.com/VtdWUja.png",
  "https://i.imgur.com/aCmX8MJ.png",
  "https://i.imgur.com/N5lACKi.png"
];

// Function to shuffle the array randomly
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function onCall({ message, data }) {
  try {
    const { senderID } = message;

    let avatarPath = join(global.cachePath, `sk_avt_${senderID}_${Date.now()}.png`);
    const senderName = data.user.info.name;

    await global.downloadFile(avatarPath, global.getAvatarURL(senderID));
    const pathImg = path.join(global.cachePath, 'sk_image.png');

    // Shuffle the imageUrls array
    shuffleArray(imageUrls);

    // Select the first image from the shuffled array
    const randomBackground = imageUrls[0];

    await global.downloadFile(pathImg, randomBackground);

    let baseImage = await loadImage(pathImg);
    let image = await loadImage(avatarPath);

    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext('2d');
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 290, 323, 530, 573);

    ctx.beginPath();
    const imageBuffer = canvas.toBuffer();
    global.writeFile(pathImg, imageBuffer);

    await message.reply({
      body: `—»【 𝗩𝗢𝗧𝗘 𝗙𝗢𝗥 】«—\n☑️ | ${senderName}`,
      attachment: global.reader(pathImg)
    }).catch(console.error);

    global.deleteFile(pathImg);
    global.deleteFile(avatarPath);
  } catch (error) {
    console.error('Error while running command:', error);
    await message.reply('An error occurred!');
  }
}

export default {
  config,
  onCall
};
