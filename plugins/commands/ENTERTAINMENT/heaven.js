import { join } from "path";
import { loadImage, createCanvas } from "canvas";

export const config = {
  name: "heaven",
  version: "0.0.1-xaviabot-port-refactor",
  credits: "Grim",
  description: "Farewell for your friend that you mentioned.",
  usage: "[tag]",
  cooldown: 5
};

const heavenPath = join(global.assetsPath, "heaven_template.png");
export async function onLoad() {
  global.downloadFile(heavenPath, "https://i.postimg.cc/XJcHTYr2/heaven-gcb4836a03-1920.jpg");
}

export async function makeImage({ two }) {
  const template = await loadImage(heavenPath);

  let avatarPathTwo = join(global.cachePath, `avt_heav_${two}.png`);

  await global.downloadFile(avatarPathTwo, global.getAvatarURL(two));

  const avatarTwo = await loadImage(avatarPathTwo);

  const avatarTwoCircle = await global.circle(avatarTwo, avatarTwo.width / 2, avatarTwo.height / 2, avatarTwo.width / 2);

  const canvas = createCanvas(template.width, template.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(template, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(avatarTwoCircle, 530, 385, 140, 140);


  const pathImg = join(global.cachePath, `heaven_${two}.png`);
  const imageBuffer = canvas.toBuffer();

  global.deleteFile(avatarPathTwo);

  global.writeFile(pathImg, imageBuffer);
  return pathImg;
}

export async function onCall({ message }) {
  const { mentions } = message;
  const mention = Object.keys(mentions);
  if (!mention[0]) return message.reply("Mention a person.");
  else {
    const two = mention[0];
    const nameTarget = await global.controllers.Users.getName(two);
    return makeImage({ two })
      .then(async path => {
        await message.reply({
          body: `Farewell ${nameTarget}! 👼`,
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
