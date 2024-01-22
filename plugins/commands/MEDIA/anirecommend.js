import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const config = {
  name: 'anirecommend',
  version: '1.0.0',
  credits: 'Minn',
  description: 'Sends random anime recommendation',
  usages: '',
  cooldowns: 3,
};

async function onCall({ api, event, message }) {
  const { threadID, messageID } = message;
  await message.react("⏳")
  try {
    const getrandom = await axios.get('https://aniwatch.to/random');
    const html = getrandom.data;
    const $ = cheerio.load(html);
    const title = $('h2.film-name.dynamic-name').text();
    const description = $('.film-description.m-hide .text').text().trim();
    const aired = $('.item-title:contains("Aired:") .name').text();
    const premiered = $('.item-title:contains("Premiered:") .name').text();
    const duration = $('.item-title:contains("Duration:") .name').text();
    const status = $('.item-title:contains("Status:") .name').text();
    const malscore = $('.item-title:contains("MAL Score:") .name').text();
    const producers = $('.item-title:contains("Producers:") .name').text();
    const studios = $('.item-title:contains("Studios:") .name').text();
    const imgurl = $('.film-poster-img').attr('src');
    const getimg = await axios.get(imgurl, { responseType: 'arraybuffer' });
    const imgdata = Buffer.from(getimg.data);
    const watchlink = $('a.btn-play').attr('href');
    const baseurl = `https://aniwatch.to${watchlink}`;
    const imgpath = path.join(__dirname, `cache/anirecommend.${uuidv4()}.jpg`);
    fs.writeFileSync(imgpath, imgdata);
    const msg = `𝗧𝗶𝘁𝗹𝗲: ${title}\n𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${description}\n\n𝗔𝗶𝗿𝗲𝗱: ${aired}\n𝗣𝗿𝗲𝗺𝗶𝗲𝗿𝗲𝗱: ${premiered}\n𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻: ${duration}\n𝗦𝘁𝗮𝘁𝘂𝘀: ${status}\n𝗠𝗔𝗟 𝗦𝗰𝗼𝗿𝗲: ${malscore}\n𝗣𝗿𝗼𝗱𝘂𝗰𝗲𝗿𝘀: ${producers}\n𝗦𝘁𝘂𝗱𝗶𝗼𝘀: ${studios}\n\n𝗪𝗮𝘁𝗰𝗵 𝗮𝗻𝗱 𝗿𝗲𝗮𝗱 𝗺𝗼𝗿𝗲 𝗮𝘁 ${baseurl}`;
    await message.react("✅");
    global.api.sendMessage({ body: msg, attachment: fs.createReadStream(imgpath) }, threadID, messageID);
  } catch (error) {
    await message.react("❌")
    global.api.sendMessage('An error occurred.', threadID, messageID);
  }
}

export default {
  config,
  onCall,
};
