export const config = {
  name: "disco",
  aliases: ["rainbow"],
  version: "1.0.0",
  credits: "BerVer",
  description: "Change color conversation continuously according to the amount",
  usages: "rainbow [amount of colors]",
  cooldown: 300,
  permissions: [1, 2]
};

export async function onCall({ message, args }) {
  var value = args.join();
  if (isNaN(value)) return message.reply(`It is not a number!`);
  if (value > 500) return message.reply(`Color amount must be less than 500!`);
  var color = ['196241301102133', '169463077092846', '2442142322678320', '234137870477637', '980963458735625', '175615189761153', '2136751179887052', '2058653964378557', '2129984390566328', '174636906462322', '1928399724138152', '417639218648241', '930060997172551', '164535220883264', '370940413392601', '205488546921017', '809305022860427'];
  for (var i = 0; i < value; i++) {
    global.api.changeThreadColor(color[Math.floor(Math.random() * color.length)], message.threadID)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return;
}