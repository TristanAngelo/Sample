import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const config = {
  name: 'movieinfo',
  version: '1.0.0',
  credits: 'August Quinn (Converted by Dymyrius)',
  description: 'Get information about a movie',
  usage: '[title]',
  cooldown: 5,
};

const langData = {
  en_US: {
    pleaseProvideTitle: 'Please provide a movie title.',
    movieNotFound: 'Movie not found or an error occurred.',
    errorFetchingInfo: 'An error occurred while fetching movie information.',
    trailerNotFound: 'Trailer not found.',
    movieInfo: `🎬 Movie Info for "{title}" ({year}):
🎭 Cast: {cast}
📖 Plot: {plot}
📊 Ratings:
{ratings}
🎥 Trailer: {trailerUrl}
🖼️ Poster Image URL: {posterUrl}`,
    trailerVideo: 'Trailer Video:',
  },
};

async function onCall({ api, event, args, message }) {
  const { threadID, messageID } = message;
  const apiKey = 'db4f9cfb';
  const youtubeApiKey = 'AIzaSyBkeljYcuoBOHfx523FH2AEENlciKnm3jM';
  const title = args.join(' ');

  if (!title) {
    global.api.sendMessage(langData.en_US.pleaseProvideTitle, threadID, messageID);
    return;
  }

  const apiUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;

  try {
    const response = await axios.get(apiUrl);
    const movieData = response.data;

    if (movieData.Response === 'False') {
      global.api.sendMessage(langData.en_US.movieNotFound, threadID, messageID);
      return;
    }

    const movieInfo = constructMovieInfo(movieData);

    const posterPath = path.join(__dirname, 'cache', 'movie_poster.jpg');
    const hasError = await downloadImage(movieData.Poster, posterPath);

    if (!hasError) {
      // Send the movie info and poster as an attachment
      const attachment = fs.createReadStream(posterPath);
      global.api.sendMessage(
        {
          body: movieInfo,
          attachment: attachment,
        },
        threadID,
        async () => {
          // Remove the temporary poster file after sending
          fs.unlinkSync(posterPath);

          try {
            // Handle sending the trailer video here
            const trailerUrl = await getMovieTrailer(title, youtubeApiKey);
            const trailerVideoBuffer = await getTrailerVideo(trailerUrl);

            // Send the trailer video as an attachment
            const trailerAttachment = fs.createReadStream(trailerVideoBuffer.path);
            global.api.sendMessage(
              {
                body: langData.en_US.trailerVideo,
                attachment: trailerAttachment,
              },
              threadID,
              () => {
                // Remove the temporary trailer video file after sending
                fs.unlinkSync(trailerVideoBuffer.path);
              }
            );
          } catch (error) {
            console.error(error);
            global.api.sendMessage(langData.en_US.trailerNotFound, threadID);
          }
        }
      );
    } else {
      global.api.sendMessage(movieInfo, threadID, messageID);
    }
  } catch (error) {
    console.error(error);
    global.api.sendMessage(langData.en_US.errorFetchingInfo, threadID, messageID);
  }
}

async function getMovieTrailer(movieTitle, apiKey) {
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(
    `${movieTitle} official trailer`
  )}&key=${apiKey}&maxResults=1&type=video`;

  try {
    const response = await axios.get(searchUrl);
    const videoId = response.data.items[0].id.videoId;
    return `https://www.youtube.com/watch?v=${videoId}`;
  } catch (error) {
    console.error(error);
    return langData.en_US.trailerNotFound;
  }
}

async function getTrailerVideo(trailerUrl) {
  const path = `${__dirname}/cache/trailer_video.mp4`;
  const response = await axios.get(trailerUrl, { responseType: 'arraybuffer' });
  fs.writeFileSync(path, Buffer.from(response.data, 'binary'));
  return { path };
}

function constructMovieInfo(movieData) {
  const { Title, Year, Actors, Plot, Ratings, Poster } = movieData;
  const ratingsText = Ratings.map((rating) => `${rating.Source}: ${rating.Value}`).join('\n');

  return langData.en_US.movieInfo
    .replace('{title}', Title)
    .replace('{year}', Year)
    .replace('{cast}', Actors)
    .replace('{plot}', Plot)
    .replace('{ratings}', ratingsText)
    .replace('{posterUrl}', Poster);
}

async function downloadImage(url, path) {
  try {
    const imageResponse = await axios.get(url, { responseType: 'arraybuffer' });
    fs.writeFileSync(path, Buffer.from(imageResponse.data, 'binary'));
    return false; // No error
  } catch (error) {
    console.error(error);
    return true; // Error occurred
  }
}

export default {
  config,
  langData,
  onCall,
};
