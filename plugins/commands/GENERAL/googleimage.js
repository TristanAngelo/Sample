import cheerio from 'cheerio';
import axios from 'axios';

export default {
  config: {
    name: "googleimage",
    credits: "luffy",
    version: "2.0",
    description: "Search for images using Google Images and return a specified number of results. (LOW QUALITIES)",
  },

  onCall: async function({ args, message }) {
    try {
      const query = args.join(' ');
      const encodedQuery = encodeURIComponent(query);
      const numResults = parseInt(args[0]) || 6; // Default to 5 if no number is provided
      const url = `https://www.google.com/search?q=${encodedQuery}&tbm=isch`;

      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      const results = [];
      $('img[src^="https://"]').each(function() {
        results.push($(this).attr('src'));
      });

      const attachments = await Promise.all(results.slice(0, numResults).map(url => global.getStream(url)));

      return message.reply({ body: `Here are the top ${numResults} image results for "${query}":`, attachment: attachments });
    } catch (error) {
      console.error(error);
      return message.reply("Sorry, I couldn't find any results.");
    }
  }
}