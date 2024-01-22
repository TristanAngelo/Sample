import axios from 'axios';

export default {
  config: {
    name: "university",
    version: "1.0",
    credits: "Samir Œ",
    cooldown: 5,
    description: "search university in your country",
  },
  onCall: async function({ args, message }) {
    const text = args[0];
    const apiUrl = `http://universities.hipolabs.com/search?country=${text}`;

    try {
      const response = await axios.get(apiUrl);
      const universities = response.data;
      const header = "𝗨𝗻𝗶𝘃𝗲𝗿𝘀𝗶𝘁𝘆 ";

      const shuffledUniversities = universities.sort(() => Math.random() - 0.5);
      const randomInfo = shuffledUniversities.slice(0, 5).map((university, index) => `${index + 1}. ${header}\n🌟 Name: ${university.name}\n🌎 Website: ${university.web_pages.join(', ')}`);
      message.reply({ body: randomInfo.join('\n\n') });
    } catch (error) {
      console.error('Error:', error);
    }
  },
};