import axios from 'axios';
import fs from 'fs';
import path from 'path';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const config = {
  name: 'nasa',
  version: '1.0.0',
  credits: 'August Quinn (Converted by Grim)',
  description: 'Search for NASA images and information.',
  usages: 'image/search [query]',
  cooldowns: 5,
};

const langData = {
  en_US: {
    invalidCommand: 'Invalid command. Please use one of the following formats:\n/nasa image [query]\n/nasa search [query]',
    noImagesFound: 'No NASA images found for the specified query.',
    noResultsFound: 'No NASA search results found for the specified query.',
    error: 'An error occurred while fetching NASA data.',
    imageResult: 'NASA Images:',
    searchResult: '🌟 Search results for "{query}":\n\n{resultText}\n━━━━━━━━━━━━━\nHere are the images:',
  },
};

async function onCall({ api, args, getLang, message }) {
  const threadID = message.threadID;
  const messageID = message.messageID;
  if (args.length < 2) {
    global.api.sendMessage(getLang('invalidCommand'), threadID, messageID);
    return;
  }

  const apiKey = 'PH3BOkVhDPj2TAQKafwWTfECMFQpuQda7itIO8Ah';
  const command = args[0];
  const query = args.slice(1).join(' ');

  try {
    if (command === 'image') {
      const encodedQuery = encodeURIComponent(query); // Encode the query

      // Construct the URL using the URL class
      const apiUrl = new URL('https://images-api.nasa.gov/search');
      apiUrl.searchParams.append('q', encodedQuery);

      const response = await axios.get(apiUrl.toString(), {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });
      await message.react("⏳");

      if (response.data && response.data.collection && response.data.collection.items && response.data.collection.items.length > 0) {
        const items = response.data.collection.items.slice(0, 10);
        const attachments = [];

        for (const item of items) {
          const imageUrl = item.links[0].href;
          const imageStream = await axios.get(imageUrl, { responseType: 'stream' });

          const imagePath = path.join(__dirname, '/cache', path.basename(imageUrl));
          const writer = fs.createWriteStream(imagePath);

          imageStream.data.pipe(writer);

          await new Promise((resolve) => {
            writer.on('finish', resolve);
          });
          attachments.push(fs.createReadStream(imagePath));
        }
        await message.react("✅");
        global.api.sendMessage({ body: getLang('imageResult'), attachment: attachments }, threadID, messageID);
      } else {
        global.api.sendMessage(getLang('noImagesFound'), threadID, messageID);
      }
    } else if (command === 'search') {
      const response = await axios.get(`https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });
      await message.react("⏳");

      if (response.data && response.data.collection && response.data.collection.items && response.data.collection.items.length > 0) {
        const items = response.data.collection.items.slice(0, 5);
        const results = [];

        for (const item of items) {
          const info = {
            title: item.data[0].title,
            description: item.data[0].description,
            keywords: item.data[0].keywords.join(', '),
          };
          results.push(info);
        }

        const resultText = results.map((result, index) => `   — Result ${index + 1}:\n𝗧𝗜𝗧𝗟𝗘: ${result.title}\n𝗗𝗘𝗦𝗖𝗥𝗜𝗣𝗧𝗜𝗢𝗡: ${result.description}\n𝗞𝗘𝗬𝗪𝗢𝗥𝗗𝗦: ${result.keywords}\n`).join('\n');
        await message.react("✅");
        global.api.sendMessage(getLang('searchResult', { query, resultText }), threadID, messageID);
      } else {
        global.api.sendMessage(getLang('noResultsFound'), threadID, messageID);
      }
    }
  } catch (error) {
    message.react("❌");
    console.error(error);
    global.api.sendMessage(getLang('error'), threadID, messageID);
  }
}

export default {
  config,
  langData,
  onCall,
};
