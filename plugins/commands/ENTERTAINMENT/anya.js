import axios from 'axios';
import fs from 'fs';
import { resolve } from 'path';

const config = {
  name: 'anya',
  version: '1.0.0',
  credits: 'lagyan mo nalang',
  description: 'talk with Anya',
  usages: 'sim',
  cooldowns: 5,
};

const getUserInfo = async (api, userID) => {
  try {
    const userInfo = await global.api.getUserInfo(userID);
    return userInfo[userID].firstName;
  } catch (error) {
    console.error(`Error fetching user info: ${error}`);
    return '';
  }
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

async function onCall({ api, message, args }) {
  const { messageID, threadID, senderID } = message;
  const name = await getUserInfo(api, senderID);
  const ranGreetVar = [`Konichiwa ${name}`, 'Konichiwa senpai', 'Hora'];
  const ranGreet = ranGreetVar[Math.floor(Math.random() * ranGreetVar.length)];
  const chat = args.join(' ');

  if (!args[0]) return global.api.sendMessage(`${ranGreet}`, threadID, messageID);

  try {
    await message.react('⏳');
    const userName = await getUserInfo(api, senderID);
    const resApi = `https://hazeyy-api-blackbox.kyrinwu.repl.co/ask?q=act%20as%20a%20human,%20your%20name%20is%20Anya,%20I'm%20${userName},`;
    const res = await axios.get(`${resApi}${encodeURIComponent(chat)}`);
    const simRes = res.data.message;

    // Translate to Japanese
    const tranChat = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ja&dt=t&q=${encodeURIComponent(simRes)}`);
    const text = tranChat.data[0][0][0];

    // Convert text to audio
    const audioApi = await axios.get(`https://api.tts.quest/v3/voicevox/synthesis?text=${encodeURIComponent(text)}&speaker=3&fbclid=IwAR01Y4UydrYh7kvt0wxmExdzoFTL30VkXsLZZ2HjXjDklJsYy2UR3b9uiHA`);
    const audioUrl = audioApi.data.mp3StreamingUrl;

    const audioPath = resolve(global.cachePath, `anya_${message.threadID}_${message.senderID}.wav`);
    await downloadFile(audioUrl, audioPath);

    // Prepare audio stream
    const att = fs.createReadStream(audioPath);

    await message.react('✅');
    message.reply({ body: `${simRes}`, attachment: att }, () => {
      fs.unlinkSync(audioPath);
    });
  } catch (error) {
    console.error(error);
    global.api.sendMessage('An error occurred while processing your request.', threadID, messageID);
  }
}

export default {
  config,
  onCall,
};
