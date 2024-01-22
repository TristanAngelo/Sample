import axios from 'axios';

export const config = {
  name: 'duckgo',
  version: '1.0.0',
  credits: 'Yan Maglinte (Converted by Grim)',
  description: 'Searches the DuckDuckGo API for information.',
  usage: '[query]',
  cooldown: 5
};

export async function onCall({ message, args }) {
  const { messageID, threadID } = message;
  let query = args.join(' ');
  if (!query) {
    m('⚠️ |Missing Input', threadID, messageID);
  }
  try {
    const response = await axios.get(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&pretty=1`);
    let heading = response.data.Heading;
    let abstract = response.data.Abstract;
    if (!heading) {
      heading = 'Not Found';
    }
    if (!abstract) {
      abstract = 'Not Found';
    }
    const gogo = `🔎 You searched for: ${query}\n\nTopic: ${heading}\n\n${abstract}`;

    global.api.sendMessage(gogo, threadID, messageID);
  } catch (error) {
    m(`❌ ${error.gogo}`, threadID, messageID);
  }
};