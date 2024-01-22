export const config = {
  name: "setemoji",
  version: "1.0.0",
  permissions: [1, 2],
  credits: "bao",
  description: "Set the emoji reaction for the group.",
  usage: "[emoji]",
  cooldown: 5
};

export async function onCall({ message, args }) {
  const emoji = args.join(" ")
  global.api.changeThreadEmoji(`${args.join(" ")}`, message.threadID, message.messagaID);
}