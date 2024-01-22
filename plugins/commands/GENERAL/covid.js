import axios from 'axios';
import request from 'request';
import fs from 'fs';
import path from 'path';

export const config = {
  name: "covid",
  version: "1.0.0",
  credits: "Thiệu Trung Kiên (Converted by Grim)",
  description: "View covid19 information",
  usage: "[Name of the country]",
  cooldown: 5
};

export async function onCall({ message, args }) {
  var tip = args.join(" ");
  let pathImg = path.join(global.cachePath, `${Date.now()}_covid_${message.threadID}.png`);
  if (!tip) return message.reply(`Enter a country 🌎 name`);
  else {
    axios.get(`https://disease.sh/v3/covid-19/countries/${encodeURIComponent(tip)}`).then(res => {
      let nhiem = res.data.cases,
        chet = res.data.deaths,
        dieutri = res.data.recovered,
        danso = res.data.population,
        chauluc = res.data.continent,
        quocgia = res.data.country
      var flag = res.data.countryInfo.flag;
      let callback = function() {
        message.reply(
          {
            body: `🌎 | Country : ${quocgia}\n\n🦠 | Infection: ${nhiem}\n☠️ | Death: ${chet} \n❤️ | Treatment : ${dieutri}\n📝 | Population : ${danso}\n🔎 | Continent: ${chauluc}\n`,
            attachment: fs.createReadStream(pathImg)
          }, () => fs.unlinkSync(pathImg));
      };
      request(encodeURI(flag)).pipe(fs.createWriteStream(pathImg)).on("close", callback);
    })
  }
}