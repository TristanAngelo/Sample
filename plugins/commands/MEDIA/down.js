import axios from 'axios';

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

const config = {
  name: "download",
  aliases: [],
  description: "Download files from provided URLs.",
  usage: "",
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: "Credits to Eien Mojiki, f/. Mirai, and ndt22w",
  extra: {}
};

const onCall = async ({ message, args, api }) => {
  const i = (url) => axios.get(url, { responseType: "stream" }).then((r) => r.data);

  let links;
  if (message.type == 'message_reply') {
    links = message.reply.body.split('\n');
  } else {
    links = args.join(' ').split('\n');
  }

  const validLinks = [];
  const invalidLinks = [];
  const audioLinks = [];
  const videoLinks = [];
  const mediaLinks = [];

  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    if (!isValidUrl(link)) {
      invalidLinks.push(i + 1);
    } else {
      validLinks.push(link);

      if (link.endsWith('.mp3')) {
        audioLinks.push(link);
      } else if (link.endsWith('.mp4')) {
        videoLinks.push(link);
      } else if (link.endsWith('.gif') || link.endsWith('.jpg') || link.endsWith('.jpeg') || link.endsWith('.png')) {
        mediaLinks.push(link);
      } else {
        invalidLinks.push(i + 1);
      }
    }
  }

  if (invalidLinks.length > 0) {
    const errorMessage = `Link ${invalidLinks.join(', ')} is not in the correct format. Removing...`;
    message.send({ body: errorMessage, attachment: [] });
    links = links.filter((_, index) => !invalidLinks.includes(index + 1));
  }

  const audioAttachments = await Promise.all(audioLinks.map(async link => await i(link)));
  const videoAttachments = await Promise.all(videoLinks.map(async link => await i(link)));
  const mediaAttachments = await Promise.all(mediaLinks.map(async link => await i(link)));
  const successfulDownloads = audioAttachments.filter(Boolean).length + videoAttachments.filter(Boolean).length + mediaAttachments.filter(Boolean).length;

  message.send({
    body: `Downloading ${successfulDownloads} links...`,
    attachment: []
  });

  if (audioAttachments.length > 0) {
    for (const audioAttachment of audioAttachments) {
      message.send({
        body: `Successfully downloaded 1 audio file`,
        attachment: [audioAttachment]
      });
    }
  }

  if (videoAttachments.length > 0) {
    for (const videoAttachment of videoAttachments) {
      message.send({
        body: `Successfully downloaded 1 video.`,
        attachment: [videoAttachment]
      });
    }
  }

  if (mediaAttachments.length > 0) {
    let mediaMessage = `Successfully downloaded ${mediaAttachments.length} images and GIFs`;
    message.send({
      body: mediaMessage,
      attachment: mediaAttachments
    });
  }
};

export default {
  config,
  onCall
};
