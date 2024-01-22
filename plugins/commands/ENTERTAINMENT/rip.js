import { join } from "path";
import { loadImage, createCanvas } from "canvas";

export const config = {
  name: "rip",
  version: "0.0.1-xaviabot-port-refactor",
  credits: "Grim",
  description: "Rest in peace for your friend that you mentioned.",
  usage: "[tag]",
  cooldown: 5
};

const ripPath = join(global.assetsPath, "rip-template.png");
export async function onLoad() {
  global.downloadFile(ripPath, "https://i.imgur.com/LJ7Bi1t.png");
}

export async function makeImage({ one, two }) {
  const template = await loadImage(ripPath);

  let avatarPathOne = join(global.cachePath, `avt_arr_${one}.png`);
  let avatarPathTwo = join(global.cachePath, `avt_arr_${two}.png`);

  await global.downloadFile(avatarPathOne, global.getAvatarURL(one));
  await global.downloadFile(avatarPathTwo, global.getAvatarURL(two));

  const avatarOne = await loadImage(avatarPathOne);
  const avatarTwo = await loadImage(avatarPathTwo);

  const avatarOneCircle = await global.circle(avatarOne, avatarOne.width / 2, avatarOne.height / 2, avatarOne.width / 2);
  const avatarTwoCircle = await global.circle(avatarTwo, avatarTwo.width / 2, avatarTwo.height / 2, avatarTwo.width / 2);

  const canvas = createCanvas(template.width, template.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(template, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(avatarOneCircle, 360, 320, 100, 100);
  ctx.drawImage(avatarTwoCircle, 130, 240, 110, 110);


  const pathImg = join(global.cachePath, `rip_${one}_${two}.png`);
  const imageBuffer = canvas.toBuffer();

  global.deleteFile(avatarPathOne);
  global.deleteFile(avatarPathTwo);

  global.writeFile(pathImg, imageBuffer);
  return pathImg;
}

export async function onCall({ message }) {
  const { senderID, mentions } = message;
  const mention = Object.keys(mentions);
  if (!mention[0]) return message.reply("Mention a person.");
  else {
    const one = senderID, two = mention[0];
    const nameTarget = await global.controllers.Users.getName(two);
    return makeImage({ one, two })
      .then(async path => {
        await message.reply({
          body: `Rest in Peace ${nameTarget} 🪦\nHappy Condolences! 🕊️`,
          mentions: [
            {
              tag: nameTarget,
              id: two
            }
          ],
          attachment: global.reader(path)
        }).catch(e => {
          message.reply("An error occurred, please try again.");
          console.error(e);
        });

        global.deleteFile(path);
      })
      .catch(e => {
        message.reply("An error occurred, please try again.");
        console.error(e);
      });
  }
}
