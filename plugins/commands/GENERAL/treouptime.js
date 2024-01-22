import axios from 'axios';

const config = {
  name: "treoupt",
  aliases: ["treolink", "treouptime"],
  description: "Ping a URL for uptime monitoring.",
  usage: "",
  cooldown: 3,
  permissions: [0, 1, 3],
  credits: "ndt22w",
  extra: {}
};

const onCall = async ({ message, args, prefix }) => {
  const name = args[0];
  const url = args[1];

  if (!name || !url) {
    message.reply(`Please provide a name and URL to ping. For example: ${prefix}${config.name} <url>`);
    return;
  }

  try {
    const response = await axios.get(`http://server.nexcord.com:10813/api/ping?name=${encodeURIComponent(name)}&url=${encodeURIComponent(url)}`);

    if (response.status === 200) {
      message.reply(`☑️ | URL '${name}' will be monitored for uptime.`);
    } else {
      message.reply("Unable to ping the URL. Please try again later.");
    }
  } catch (error) {
    console.error("An error occurred while pinging the URL:", error);
    message.reply("There's an issue with this URL, no need for further actions.");
  }
};

export default {
  config,
  onCall
};
