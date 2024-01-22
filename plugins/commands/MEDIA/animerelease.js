import axios from 'axios';
import moment from 'moment-timezone';

const Timezone = 'Asia/Manila'; // change here
const API_URL = `https://anisched--marok85067.repl.co/?timezone=${Timezone}`;

export default {
  config: {
    name: 'animerelease',
    aliases: ['release', 'newepisode'],
    version: '7.0',
    credits: 'JV Barcenas',
    description: 'Shares the latest anime releases fetched from an API.',
    cooldown: 7
  },

  onCall: async function({ message }) {
    try {
      const response = await axios.get(API_URL);

      if (response.status !== 200 || !response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid or missing response from the API');
      }

      const releases = response.data;
      const currentTime = moment().tz(Timezone);

      let upcomingAnime = [];
      let updatedAnime = [];

      for (const release of releases) {
        if (!release.animeTitle || !release.episode || !release.time || !release.status) {
          throw new Error('Invalid or missing data in the response from the API');
        }

        const releaseDateTime = moment(release.time, 'h:mma', Timezone);
        const releaseTime = moment(releaseDateTime).tz(Timezone);

        if (release.status === 'upcoming') {
          upcomingAnime.push(release);
        } else if (release.status === 'already updated') {
          updatedAnime.push(release);
        }
      }

      let messages = 'Current Time: ' + currentTime.format('h:mma') + '\n\n';

      if (upcomingAnime.length > 0) {
        messages += '≡⊆ 𝐀𝐍𝐈𝐌𝐄 𝐔𝐏𝐂𝐎𝐌𝐈𝐍𝐆 𝐓𝐇𝐈𝐒 𝐅𝐄𝐖 𝐇𝐎𝐔𝐑𝐒 ⊇≡\n\n';
        upcomingAnime.sort((a, b) => moment(a.time, 'h:mma').diff(moment(b.time, 'h:mma')));
        for (const anime of upcomingAnime) {
          messages += `Anime: ${anime.animeTitle}\nEpisode: ${anime.episode}\nTime: ${anime.time}\n\n`;
        }
      }

      if (updatedAnime.length > 0) {
        messages += '≡⊆ 𝐀𝐍𝐈𝐌𝐄 𝐀𝐋𝐑𝐄𝐀𝐃𝐘 𝐔𝐏𝐃𝐀𝐓𝐄𝐃 ⊇≡\n\n';
        updatedAnime.sort((a, b) => moment(a.time, 'h:mma').diff(moment(b.time, 'h:mma')));
        for (const anime of updatedAnime) {
          messages += `Anime: ${anime.animeTitle}\nEpisode: ${anime.episode}\nTime: ${anime.time}\n\n`;
        }
      }

      if (messages === 'Current Time: ' + currentTime.format('h:mma') + '\n\n') {
        messages += 'No anime releases for today.';
      }

      const messageID = await message.reply(messages.trim());
      console.log(`Sent anime releases with message ID ${messageID}`);
    } catch (error) {
      console.error(`Failed to send anime releases: ${error.message}`);
      message.reply(
        'Sorry, something went wrong while trying to share the latest anime releases. Please try again later.'
      );
    }
  }
};