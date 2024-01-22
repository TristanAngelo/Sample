import axios from 'axios';

export const config = {
    name: "imgur",
    version: "2.1.0",
    credits: "KENLIEPLAYS (Converted by Grim)",
    description: "imgur upload",
    usage: "[reply to image]",
    cooldown: 3,
};

export async function onCall({ message }) {
    var kenliegwapokaayo = message.messageReply.attachments[0].url; 
    if (!kenliegwapokaayo) return message.reply('Please reply to image.');

    const res = await axios.get(`https://api.kenliejugarap.com/imgur/?imageLink=${encodeURIComponent(kenliegwapokaayo)}`);

    if (res.data.error) {
        return message.reply(res.data.error);
    }

    var imgur = res.data.link;
    return message.reply(`Here is your imgur link:\n${imgur}`);
};