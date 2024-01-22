import axios from "axios";
import fs from "fs";
import request from "request";
import path from "path";

function convert(time) {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const formattedDate = `${day < 10 ? "0" + day : day}/${month < 10 ? "0" + month : month}/${year}||${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  return formattedDate;
}

const headers = {
  "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like) Version/12.0 eWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1",
  "accept": "application/json, text/plain, /"
};

export default {
  config: {
    name: "stalkfb",
    aliases: ["fbstalk"],
    version: "1.0",
    author: "Deku & Eugene Aguilar",
    cooldown: 5,
    description: "Get info using uid/mention/reply to a message",
    usage: "reply/uid/@mention",
  },

  onCall: async function({ message, args }) {
    let pathImg = path.join(global.cachePath, `${message.threadID}_infofacebook.png`);
    const token = "EAAD6V7os0gcBO2aUDSZBhLGzreMcWtcCv1DONhlZCcdMIR4greGiFuJn9bL5IPQL0C3UolS5Iq4F9Uk0dwZAsMd2hScJJN9l5JP3wXFgUEqYjBTsP96FHOBdbqYRgGwbAaO7jvUZAyfe5aeqpqch58bAYKNTFRGvHrKWc9SbscoZBWE4uP5pdJdqQjIVV0yVWUwZDZD"; //*get your EAAD6V7 token here https://acess.ainz-sama101.repl.co/facebook/token?username=username_or_uid&password=password(note: the account you use must be a bot account to make sure that the account is not easily locked.)*/

    let id;
    if (args.join().includes('@')) {
      id = Object.keys(message.mentions)[0];
    } else {
      id = args[0] || message.senderID;
    }

    if (message.type === "message_reply") {
      id = message.messageReply.senderID;
    }

    try {
      const resp = await axios.get(`https://graph.facebook.com/${id}?fields=id,is_verified,cover,created_time,work,hometown,username,link,name,locale,location,about,website,birthday,gender,relationship_status,significant_other,quotes,first_name,subscribers.limit(0)&access_token=${token}`, { headers });

      const name = resp.data.name;
      const link_profile = resp.data.link;
      const uid = resp.data.id;
      const first_name = resp.data.first_name;
      const username = resp.data.username || "No data!";
      const created_time = convert(resp.data.created_time);
      const web = resp.data.website || "No data!";
      const gender = resp.data.gender || "No data!";
      const relationship_status = resp.data.relationship_status || "No data!";
      const love = resp.data.significant_other || "No data!";
      const bday = resp.data.birthday || "No data!";
      const follower = resp.data.subscribers.summary.total_count || "No data!";
      const is_verified = resp.data.is_verified;
      const quotes = resp.data.quotes || "No data!";
      const about = resp.data.about || "No data!";
      const locale = resp.data.locale || "No data!";
      const hometown = !!resp.data.hometown ? resp.data.hometown.name : "No Hometown";
      const cover = resp.data.cover || "No Cover photo";
      const avatar = `https://graph.facebook.com/${id}/picture?width=1500&height=1500&access_token=1174099472704185|0722a7d5b5a4ac06b11450f7114eb2e9`;


      const cb = function() {
        message.reply({
          body: `•——INFORMATION——•
    Name: ${name}
    First name: ${first_name}
    Creation Date: ${created_time}
    Profile link: ${link_profile}
    UID: ${uid}
    Username: ${username}
    About: ${about}
    Gender: ${gender}
    Relationship Status: ${relationship_status}
    Birthday: ${bday}
    Follower(s): ${follower}
    Hometown: ${hometown}
    Locale: ${locale}
    •——END——•`,
          attachment: fs.createReadStream(pathImg)
        }, () => fs.unlinkSync(pathImg));
      };
      request(encodeURI(avatar)).pipe(fs.createWriteStream(pathImg)).on("close", cb);
    } catch (err) {
      message.reply(`Error: ${err.message}`);
    }
  }
};