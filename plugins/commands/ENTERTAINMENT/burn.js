import path from 'path';
import fs from 'fs';
import request from 'request';

export const config = {
  name: "burn",
  version: "1.0.1",
  credits: "Deku",
  description: "Burn SpongeBob",
  cooldowns: 5,
  usages: "/uid/reply/mention"
};

export async function onCall({ message, args }) {
  const { senderID } = message;
  let p = path.join(global.cachePath, `burn_${message.threadID}_mf.png`);
  if (args.join().indexOf('@') !== -1) { var id = Object.keys(message.mentions) }
  else var id = args[0] || senderID;
  if (message.type == "message_reply") { var id = message.messageReply.senderID }
  var callback = () => message.reply({ attachment: fs.createReadStream(p) }, () => fs.unlinkSync(p));
  request(encodeURI(`https://free-api.ainz-sama101.repl.co/canvas/burn?uid=${id}`)).pipe(fs.createWriteStream(p)).on('close', () => callback());
}
