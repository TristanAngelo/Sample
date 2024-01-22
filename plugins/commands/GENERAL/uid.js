import axios from 'axios';

const config = {
  name: "uid",
  aliases: [],
  description: "Get user's UID.",
  usage: "",
  cooldown: 3,
  permissions: [0],
  credits: "ndt22w",
  extra: {}
};

const onCall = async ({ message, args, event }) => {
  const { senderID, mentions, reply, type } = message;
  let uid;

  if (!args[0]) {
    uid = message.senderID;
  } else {
    if (args[0].startsWith('https://')) {
      const link = args[0];
      try {
        const res = await global.api.getUserID(link || message.messageReply.body);
        uid = res;
      } catch (error) {
        return message.reply('Unable to retrieve UID from the link.');
      }
    } else {
      uid = args[0];
    }
  }

  if (message.type === "message_reply") {
    uid = message.messageReply.senderID;
  }

  if (args.join().indexOf("@") !== -1) {
    uid = Object.keys(message.mentions)[0];
  }

  message.reply(`${uid}`);
};

export default {
  config,
  onCall
};
