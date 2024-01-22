import axios from 'axios';

export const config = {
    name: "sim",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "KENLIEPLAYS",
    description: "Talk to sim",
    commandCategory: "sim",
    usages: "[ask]",
    cooldowns: 2,
};

export async function onCall({ message, args }) {
    const content = encodeURIComponent(args.join(" "));
    if (!args[0]) return message.reply("Please type a message...");
    try {
        const res = await axios.get(`https://simsimi.fun/api/v2/?mode=talk&lang=ph&message=${content}&filter=false`);
        const respond = res.data.success;
        if (res.data.error) {
            message.reply(`Error: ${res.data.error}`, (error, info) => {
                if (error) {
                    console.error(error);
                }
            });
        } else {
            message.reply(respond, (error, info) => {
                if (error) {
                    console.error(error);
                }
            });
        }
    } catch (error) {
        console.error(error);
        message.reply("An error occurred while fetching the data.");
    }
};