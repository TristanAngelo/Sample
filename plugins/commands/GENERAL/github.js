import moment from 'moment';
import fetch from 'node-fetch';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

export default {
  config: {
    name: "github",
    author: "junjam",
    cooldown: 5,
    description: "Retrieve the information of the user from github.",
    usage: "[username]"
  },

  onCall: async function ({ message, args }) {
    if (!args[0]) {
      message.reply("Please provide a GitHub username!");
      return;
    }

    fetch(`https://api.github.com/users/${encodeURI(args.join(" "))}`)
      .then((res) => res.json())
      .then(async (body) => {
        if (body.message) {
          message.reply("User not found. Please provide a valid username!");
          return;
        }
        const { login, avatar_url, name, id, html_url, public_repos, followers, following, location, created_at, bio } = body;
        const info = `>>${login} Information!<<\n\nUsername: ${login}\nID: ${id}\nBio: ${bio || "No Bio"}\nPublic Repositories: ${public_repos || "None"}\nFollowers: ${followers}\nFollowing: ${following}\nLocation: ${location || "No Location"}\nAccount Created: ${moment.utc(created_at).format("dddd, MMMM Do YYYY")}\nAvatar:`;
        const imgPath = path.join(global.cachePath, `${message.threadID}_avatargithub.png`);

        const imageBuffer = await axios.get(avatar_url, { responseType: "arraybuffer" }).then((res) => res.data);
        fs.writeFileSync(imgPath, Buffer.from(imageBuffer, "utf-8"));

        message.reply(
          {
            attachment: fs.createReadStream(imgPath),
            body: info,
          },
          () => fs.unlinkSync(imgPath)
        );
      })
      .catch((err) => {
        console.error(err);
        message.reply("An error occurred while fetching the user's information. Please try again later.");
      });
  },
};