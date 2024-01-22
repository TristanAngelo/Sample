import axios from 'axios';

const config = {
  name: "teachsim",
  version: "1.0.0",
  credits: "KENLIEPLAYS",
  description: "Teach to sim",
  usage: "[ask] = [answer]",
  cooldown: 2,
};

async function onCall({ api, message, args, prefix }) {
    let { messageID, threadID, senderID, body } = message;
    let tid = threadID,
    mid = messageID;
    const input = args.join(" ").split("=");

    if (input.length < 2) {
        if(args.length == 0){
            return global.api.sendMessage(`Usage: ${prefix}teachsim [ask] = [answer]`, tid, mid);
        } else if(args.join(" ").includes("=")) {
            return global.api.sendMessage("Please provide both a question and an answer.", tid, mid);
        } else {
            return global.api.sendMessage("Please use '=' character to separate the question and answer.", tid, mid);
        }
    }

    const ask = encodeURIComponent(input[0].trim());
    const answer = encodeURIComponent(input[1].trim());

    try {
        const res = await axios.get(`https://simsimi.fun/api/v2/?mode=teach&lang=en&message=${ask}&answer=${answer}`);
        const respond = res.data.success;
        if (res.data.error) {
            global.api.sendMessage(`Error: ${res.data.error}`, tid, (error, info) => {
                if (error) {
                    console.error(error);
                }
            }, mid);
        } else {
            global.api.sendMessage(respond, tid, (error, info) => {
                if (error) {
                    console.error(error);
                }
            }, mid);
        }
    } catch (error) {
        console.error(error);
        global.api.sendMessage("An error occurred while fetching the data.", tid, mid);
    }
};

export default{
  config,
  onCall
}