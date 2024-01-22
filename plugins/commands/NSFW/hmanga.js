import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const config = {
  name: "hentaifox",
  alieases: ['hfox'],
  version: "1.0.0",
  credits: "Minn",
  description: "Sends the page image by sauce & page",
  usages: "<sauce id> <page number>",
  cooldowns: 3,
};

async function onCall({ api, message, args, prefix }) {
  const threadID = message.threadID;
  const messageID = message.messageID;
  try {
    if (args.length !== 2 || isNaN(args[0]) || isNaN(args[1])) {
      global.api.sendMessage(`Invalid input!\nExpected input: ${prefix}hentaifox <id> <page>`, threadID, messageID);
      return;
    }
    const id = args[0];
    const page = args[1];
    const url1 = `https://hentaifox.com/gallery/${id}/`;
    const getresponse = await axios.get(url1);
    const gresponse = getresponse.data;
    const $gallery = cheerio.load(gresponse);
    const totalpages = parseInt($gallery('span.i_text.pages').text().split(':')[1].trim());
    if (page < 1 || page > totalpages) {
      global.api.sendMessage(`invalid page number. total pages: ${totalpages}`, threadID, messageID);
      return;
    }
    const url2 = `https://hentaifox.com/g/${id}/${page}/`;
    const getpage2 = await axios.get(url2);
    const getpage = getpage2.data;
    const $image = cheerio.load(getpage);
    const jpgurl = $image('a.next_img img').attr('data-src');
    const getimg = await axios.get(jpgurl, { responseType: 'arraybuffer' });
    const imgbuffer = Buffer.from(getimg.data);
    const dname = `cache/hentaifox.${uuidv4()}.jpg`;
    const imgpath = path.join(__dirname, dname);

    if (!fs.existsSync(path.dirname(imgpath))) {
      fs.mkdirSync(path.dirname(imgpath), { recursive: true });
    }

    fs.writeFileSync(path.join(imgpath), imgbuffer);
    const msg = `${page}/${totalpages}`;
    message.reply({ body: msg, attachment: fs.createReadStream(path.join(imgpath)) }, threadID);
  } catch (error) {
    console.error(error);
    global.api.sendMessage('An error occurred.', threadID, messageID);
  }
}

export default {
  config,
  onCall,
};
