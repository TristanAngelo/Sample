import axios from 'axios';

export const config = {
  name: "eric",
  version: "1.0.0",
  description: "(Education Resources Information Center) is an authoritative database of indexed and full-text education literature and resources. Sponsored by the Institute of Education Sciences of the U.S. Department of Education, it is an essential tool for education researchers of all kinds.",
  credits: "August Quinn",
  usage: "[search query]",
  cooldown: 5,
};

export async function onCall({ message, args }) {
  const searchQuery = encodeURIComponent(args.join(" "));

  try {
    if (!searchQuery) {
      return message.reply("Please provide a search query for Eric's content.");
    }

    const ericApiUrl = `http://ericeddov.august-api.repl.co/search-eric?search=${searchQuery}`;
    const response = await axios.get(ericApiUrl);

    const { results } = response.data;
    if (!results || results.length === 0) {
      return message.reply("No results found for the given search query.");
    }

    const combinedResults = results.map((result, index) => `⦿ 𝗥𝗘𝗦𝗨𝗟𝗧 ${index + 1}\n𝗧𝗜𝗧𝗟𝗘: ${result.title || 'N/A'}\n𝗔𝗨𝗧𝗛𝗢𝗥: ${result.author || 'N/A'}\n𝗦𝗨𝗕𝗝𝗘𝗖𝗧: ${result.subject || 'N/A'}\n𝗣𝗨𝗕𝗟𝗜𝗦𝗛𝗘𝗥: ${result.publisher || 'N/A'}\n𝗗𝗘𝗦𝗖𝗥𝗜𝗣𝗧𝗜𝗢𝗡: ${result.description || 'N/A'}`).join('\n\n');
    message.reply(`🔎 Search results for "${searchQuery}":\n\n${combinedResults}`);

  } catch (error) {
    console.error('Error:', error.message);
    message.reply('An error occurred while searching. Please try again later.');
  }
};