import path from 'path';
import fs from 'fs';
import request from 'request';

export const config = {
  name: "hornylicense",
  version: "1.0.1",
  credits: "Deku",
  description: "License to be horny.",
  cooldown: 5,
  usages: "/uid/reply/mention"
};

export async function onCall({ message, args }) {
  let p = path.join(global.cachePath, `horny_${message.threadID}_license.png`);
  const { senderID } = message;
  if (args.join().indexOf('@') !== -1) { var id = Object.keys(message.mentions) }
  else var id = args[0] || message.senderID;
  if (message.type == "message_reply") { var id = message.messageReply.senderID }
  var callback = () => message.reply({ attachment: fs.createReadStream(p) }, () => fs.unlinkSync(p));
  request(encodeURI("https://free-api.ainz-sama101.repl.co/canvas/" + "\u0068\u006f\u0072\u006e\u0079" + `?uid=${id}`)).pipe(fs.createWriteStream(p)).on('close', () => callback());
};