import axios from 'axios';

export default {
  config: {
    name: "instastalk",
    version: "1.0.0",
    author: "MILAN (Converted by Grim)",
    cooldown: 10,
    description: "This command allows you to retrieve information about an Instagram user, such as their username, full name, biography, follower count, following count, category, PK, privacy status, verification status, mutual followers count, guide availability, business contact method, and external URL. It also displays the user's profile picture."
    },

  onCall: async function ({ args, message }) {
    try {
      const username = args.join(" ");
      if (!username)
        return message.reply(`Please provide an Instagram username.`);

      const response = await axios.get(`https://milanbhandari.imageapi.repl.co/iginfo?username=${username}`);

      if (response.data.length > 0) {
        const data = response.data[0];
        const messages = {
          body: `===${data.full_name}===
────────────
❏ Username: ${data.username}
❏ Full Name: ${data.full_name}
❏ Biography: ${data.biography}
❏ Follower Count: ${data.follower_count}
❏ Following Count: ${data.following_count}
❏ Category: ${data.category}
❏ PK: ${data.pk}
❏ Is Private: ${data.is_private}
❏ Is Verified: ${data.is_verified}
❏ Mutual Followers Count: ${data.mutual_followers_count}
❏ Has Guides: ${data.has_guides}
❏ Business Contact Method: ${data.business_contact_method}
❏ External URL: ${data.external_url}
`,
          //attachment: await global.getStream(data.profile_pic_url_hd)
        };

        return message.reply(messages);
      } else {
        return message.reply(`No Instagram user found with that username.`);
      }
    } catch (error) {
      console.error(error);
      message.reply("An error occurred while fetching Instagram user data.");
    }
  }
};