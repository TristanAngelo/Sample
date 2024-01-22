import path from 'path';
import fs from 'fs';
import request from 'request';

export const config = {
  name: "patrick",
  version: "1.0.1",
  credits: "Deku",
  description: "Patrick",
  cooldowns: 5,
  usage: "/uid/reply/mention"
};

export async function onCall({ message, args }) {
  let p = path.join(global.cachePath, `meme_${message.threadID}_patrick.png`);
  const { senderID } = message;
  if (args.join().indexOf('@') !== -1) { var id = Object.keys(message.mentions) }
  else var id = args[0] || senderID;
  if (message.type == "message_reply") { var id = message.messageReply.senderID }
  var callback = () => message.reply({ attachment: fs.createReadStream(p) }, () => fs.unlinkSync(p));
  request(encodeURI(`https://free-api.ainz-sama101.repl.co/canvas/patrick?uid=${id}`)).pipe(fs.createWriteStream(p)).on('close', () => callback());
};