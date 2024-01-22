import fs from 'fs-extra';
import request from 'request';
import path from 'path';

export const config = {
    name: "catsay",
    version: "1.0.1",
    credits: "SaikiDesu",
    description: "Random cat with text.",
    cooldown: 5,
};
export async function onCall({ api, message, args }) {
    {
        const { threadID, messageID, senderID, body } = message;
        let text = args.toString().replace(/,/g, '  ');
        if (!text)
            return global.api.sendMessage("[Text]", threadID, messageID);
        let pathImg = path.join(
          global.cachePath,
          `${Date.now()}_catsay_${message.messageID}.png`
        );
        var callback = () => global.api.sendMessage({
            body: ``,
            attachment: fs.createReadStream(pathImg)
        }, threadID, () => fs.unlinkSync(pathImg), messageID);
        return request(encodeURI(`https://cataas.com/cat/cute/says/${text}`)).pipe(fs.createWriteStream(pathImg)).on('close', () => callback());
    }
}