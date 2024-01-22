import axios from 'axios';
import xml2js from 'xml2js';

const config = {
  name: 'arxiv',
  version: '1.0.0',
  credits: 'August Quinn',
  description: 'Search for research articles on Arxiv.',
  usages: '[query]',
  cooldowns: 5,
};

async function onCall({ message, args }) {
  const query = args.join(' ');

  if (!query) {
    message.reply('Please provide a search query for Arxiv.');
    return;
  }

  try {
    message.react('')
    const response = await axios.get(`http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}`);
    const xmlData = response.data;

    const parser = new xml2js.Parser();
    parser.parseString(xmlData, (error, result) => {
      if (error) {
        message.reply('An error occurred while parsing Arxiv data.');
        console.error(error);
        return;
      }

      const entries = result.feed.entry;

      if (!entries || entries.length === 0) {
        message.reply('No research articles found on Arxiv for the given query.');
        return;
      }

      const article = entries[0];
      const title = article.title[0];
      const summary = article.summary[0];
      const authors = article.author.map((author) => author.name[0]);
      const published = article.published[0];

      const responseMessage = `📚 Arxiv Research Article\n\n📝 Title: ${title}\n\n👥 Authors: ${authors.join(', ')}\n\n🗓️ Published Date: ${published}\n\n📖 Summary: ${summary}`;

      message.reply(responseMessage);
    });
  } catch (error) {
    console.error(error);
    message.reply('An error occurred while fetching Arxiv data.');
  }
};

export default {
  config,
  onCall
}