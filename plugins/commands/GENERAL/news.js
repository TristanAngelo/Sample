import axios from 'axios';

export default {
  config: {
    name: "news",
    aliases: [],
    author: "kshitiz (Converted by Grim)",
    version: "2.0",
    cooldown: 5,
    description: "Get latest news.",
    usage: ""
  },
  onCall: async function({ message }) {
    try {
      const apiKey = 'pub_32542fb7ed1cd71f0c1feae1dac284b5d842b'; // Replace with your actual API key
      const country = 'ph';
      const response = await axios.get(`https://newsdata.io/api/1/news?country=${country}&apikey=${apiKey}`);
      const newsdata = response.data.results;

      const articlesPerPage = 5;
      let messages = 'Latest news:\n\n';
      let page = 1;

      for (const article of newsdata) {
        messages += `Title: ${article.title}\nSource: ${article.source}\nDescription: ${article.description}\nLink: ${article.link}\n\n`;

        if (messages.length > 4000) {
          break;
        }
      }

      if (messages === 'Latest news:\n\n') {
        messages = 'No news articles found.';
      }

      message.reply(messages);
    } catch (error) {
      console.error('Something went wrong:', error);
      message.reply('Something went wrong while fetching from the API. Please try again.');
    }
  }
};