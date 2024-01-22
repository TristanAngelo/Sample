const config = {
  name: "linkbio",
  credits: "XaviaTeam",
  usage: "[<uid> | <text>] or <text>",
};

async function onCall({ message, args, prefix }) {
  const input = args.join(" ");
  const { mentions, reply, senderID, type } = message;

  if (!input) {
    return reply(`Invalid usage! Example usage: ${prefix}${config.name} <uid> | <text> or <text>`);
  }

  let uid;
  let text;

  if (input.includes("|")) {
    const parts = input.split("|").map((part) => part.trim());
    uid = parts[0];
    text = parts[1];
  } else {
    text = input;
  }

  if (uid) {
    uid = uid.replace(/@/g, ""); 
  } else {
    if (Object.keys(mentions).length === 0) {
      uid = type === "message_reply" ? message.messageReply.senderID : senderID;
    } else {
      uid = Object.entries(mentions).map((e) => e[0])[0];
    }
  }

  if (!uid) {
    return reply("Could not determine the user.");
  }

  return reply(`@[${uid}:999:${text}]`);
}

export default {
  config,
  onCall,
};
