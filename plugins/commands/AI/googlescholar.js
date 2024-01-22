import axios from 'axios';

const config = {
  name: 'googlescholar',
  aliases: ['gscholar'],
  description: 'Retrieve data from google scholar.',
  cooldown: 3,
  credits: 'Grim',
  usage: '[query]',
};

async function onCall({ message, args }) {
  if (!args[0]) {
    message.reply('⚠️ | Please provide a search query.');
    return;
  }
  const query = args.join(" ");
  try {
    const response = await axios.get(`https://gscholar-node-scrape.kyrinwu.repl.co/search=${encodeURIComponent(query)}`);
    if (response.status === 200 && response.data) {
      const answers = response.data;
      let msg = `📑 | Results for "${query}"\n`;
      for (const answer of answers) {
        msg += `\nTitle: ${answer.title}`;
        msg += `\nDesc: ${answer.description}`;
        msg += `\nAuthor: ${answer.authors.map(author => author).join(", ")}`;
        msg += `\nPublication: ${answer.publication}`;
        msg += `\nYear: ${answer.year}`;
        const url1 = await thisurl(answer.url);
        msg += `\nUrl: ${url1}`;
        const citation1 = await thisurl(answer.citationUrl);
        msg += `\nCitation Url: ${citation1}`;
        const related1 = await thisurl(answer.relatedUrl);
        msg += `\nRelated Url: ${related1}\n\n`;
      }
      if (msg) {
        message.reply(msg);
      } else {
        message.reply(`❌ | No results found for "${query}"`);
      }
    } else {
      message.reply(`❌ | No results found for "${query}"`);
    }
  } catch (error) {
    console.error(error);
    message.reply('an error occurred.');
    return;
  }
}

async function thisurl(url) {
  try {
    const response = await axios.get(`https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`);
    if (response.status === 200 && response.data.shorturl) {
      return response.data.shorturl;
    }
  } catch (error) {
    console.error(error);
  }
  return url;
}

export default {
  config,
  onCall
};
