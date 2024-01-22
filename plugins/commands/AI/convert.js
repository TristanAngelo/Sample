import axios from 'axios';
import fs from 'fs';

const config = {
  name: 'convert',
  version: '1.0.0',
  hasPermission: 0,
  credits: 'August Quinn',
  description: 'Convert media from a link (supports jpeg, jpg, png, mp4, gif, wav)',
  commandCategory: 'Media',
  usages: "<link>",
  cooldowns: 5,
};

async function onCall({ api, event, args, message }) {
  const url = args[0];
  const { threadID, messageID } = message;

  if (!url) {
    return global.api.sendMessage('Please provide a valid link to convert media from.', threadID, messageID);
  }

  const validExtensions = ['.jpeg', '.jpg', '.png', '.mp4', '.mp3', '.pdf', '.raw', '.docx', '.txt', '.gif', '.wav'];
  const extension = url.substring(url.lastIndexOf('.'));

  if (!validExtensions.includes(extension.toLowerCase())) {
    return global.api.sendMessage('Unsupported file format. Supported formats: jpeg, jpg, png, mp4, mp3, pdf, raw, docx, txt, gif, wav.', threadID, messageID);
  }

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    if (response.status !== 200) {
      return global.api.sendMessage('Failed to fetch the media from the provided link.', threadID, messageID);
    }

    const filename = `converted${extension}`;
    fs.writeFileSync(filename, Buffer.from(response.data, 'binary'));

    global.api.sendMessage(
      {
        body: `Converted media from the provided link: ${url}`,
        attachment: fs.createReadStream(filename),
      },
      threadID,
      () => fs.unlinkSync(filename)
    );
  } catch (error) {
    global.api.sendMessage('An error occurred while converting the media.', threadID, messageID);
    console.error(error);
  }
}

export default {
  config,
  onCall
};
