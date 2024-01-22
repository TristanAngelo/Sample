import path from 'path';
import Scraper from 'mal-scraper';
import request from 'request';
import fs from 'fs';

export const config = {
  name: "mal",
  version: "1.0.0",
  credits: "Mr.Aik3ro (Converted by Grim)",
  description: "Search Anime from Myanimelist",
  usage: "[name of anime]",
  cooldown: 5
};


export async function onCall({ message }) {
  let input = message.body;

  var query = input; query = input.substring(5)
  let data = input.split(" ");

  let Replaced = query.replace(/ /g, " ");
  message.reply(`🔎Searching for "${Replaced}"...`);

  const Anime = await Scraper.getInfoFromName(Replaced)
    .catch(err => {
      message.reply("⚠️" + err);
    });

  let getURL = Anime.picture;

  let ext = getURL.substring(getURL.lastIndexOf(".") + 1);

  if (!Anime.genres[0] || Anime.genres[0] === null) Anime.genres[0] = "None";

  var title = Anime.title;
  var japTitle = Anime.japaneseTitle
  var type = Anime.type;
  var status = Anime.status;
  var premiered = Anime.premiered;
  var broadcast = Anime.broadcast;
  var aired = Anime.aired;
  var producers = Anime.producers;
  var studios = Anime.studios;
  var source = Anime.source;
  var episodes = Anime.episodes;
  var duration = Anime.duration;
  var genres = Anime.genres.join(", ");
  var popularity = Anime.popularity;
  var ranked = Anime.ranked;
  var score = Anime.score;
  var rating = Anime.rating;
  var synopsis = Anime.synopsis;
  var url = Anime.url;
  var endD = Anime.end_date;

  let pathImg = path.join(
          global.cachePath, `${Date.now()}_mal_${message.messageID}.${ext}`);

  let callback = function() {
    message.reply({
      body: `Title: ${title}\nJapanese: ${japTitle}\nType: ${type}\nStatus: ${status}\nPremiered: ${premiered}\nBroadcast: ${broadcast}\nAired: ${aired}\nProducers: ${producers}\nStudios: ${studios}\nSource: ${source}\nEpisodes: ${episodes}\nDuration: ${duration}\nGenres: ${genres}\nPopularity: ${popularity}\nRanked: ${ranked}\nScore: ${score}\nRating: ${rating}\n\nSynopsis: \n${synopsis}\nLink: ${url}`,
      attachment: fs.createReadStream(pathImg)
    }, () => fs.unlinkSync(pathImg))
  }
  request(getURL).pipe(fs.createWriteStream(pathImg)).on("close", callback)
}


