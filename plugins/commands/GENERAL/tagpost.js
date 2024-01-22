import { v4 as uuidv4 } from 'uuid';

const postCost = 100000;

export const config = {
  name: 'tagpostconfess',
  aliases: ['tpc', 'tagpost'],
  description: 'Make a confession post on the target\'s timeline.',
  usage: '[fblink] | [target name] | [message] | [codename]',
  cooldown: 50,
  permissions: [0],
  credits: 'Grim'
};

function extractIDFromLink(link) {
  const match = link.match(/[?&]id=(\d+)/);
  if (match && match[1]) {
    return match[1];
  }
  return null;
};

export async function onCall({ message, args }) {
  const { Users } = global.controllers;
  const userMoney = await Users.getMoney(message.senderID);
  try {

    if (userMoney < postCost) {
      message.reply(`You don\'t have ₱${postCost.toLocaleString()} to use this command.`);
      return;
    }

    // Deduct the posting cost
    await Users.decreaseMoney(message.senderID, userMoney);

    const botID = global.api.getCurrentUserID();
    const uuid = uuidv4();
    const input = args.join(' ').split('|').map(arg => arg.trim());
    if (input.length !== 4) {
      message.reply('Please provide the input in the format: fblink | target name | message | codename');
      return;
    }
    const fblink = input[0];
    const targetName = input[1];
    const messageContent = input[2];
    const codename = input[3];

    let targetID = extractIDFromLink(fblink);

    if (!targetID) {
      const response = await fetch('https://id.traodoisub.com/api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          link: fblink,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      targetID = result.id; // Assuming 'id' contains the target's ID
    }

    if (!targetID) {
      message.reply('Unable to retrieve target ID from the provided link.');
      return;
    }

    const postOutput = `
✉️ | Anonymous Message:

To: ${targetName}

📜 | Message:
      — ${messageContent}

From: ${codename}`;

    const formData = {
      "input": {
        "composer_entry_point": "inline_composer",
        "composer_source_surface": "timeline",
        "idempotence_token": uuid + "_FEED",
        "source": "WWW",
        "attachments": [],
        "audience": {
          "to_id": `${targetID}`
        },
        "message": {
          "ranges": [],
          "text": `${postOutput}`
        },
        "with_tags_ids": [],
        "inline_activities": [],
        "explicit_place_id": "0",
        "text_format_preset_id": "0",
        "logging": {
          "composer_session_id": uuid
        },
        "tracking": [
          null
        ],
        "actor_id": botID,
        "client_mutation_id": Math.floor(Math.random() * 17)
      },
      "displayCommentsFeedbackContext": null,
      "displayCommentsContextEnableComment": null,
      "displayCommentsContextIsAdPreview": null,
      "displayCommentsContextIsAggregatedShare": null,
      "displayCommentsContextIsStorySet": null,
      "feedLocation": "TIMELINE",
      "feedbackSource": 0,
      "focusCommentID": null,
      "gridMediaWidth": 230,
      "groupID": null,
      "scale": 3,
      "privacySelectorRenderLocation": "COMET_STREAM",
      "renderLocation": "timeline",
      "useDefaultActor": false,
      "inviteShortLinkKey": null,
      "isFeed": false,
      "isFundraiser": false,
      "isFunFactPost": false,
      "isGroup": false,
      "isTimeline": true,
      "isSocialLearning": false,
      "isPageNewsFeed": false,
      "isProfileReviews": false,
      "isWorkSharedDraft": false,
      "UFI2CommentsProvider_commentsKey": "ProfileCometTimelineRoute",
      "hashtag": null,
      "canUserManageOffers": false
    };

    const form = {
      av: botID,
      fb_api_req_friendly_name: "ComposerStoryCreateMutation",
      fb_api_caller_class: "RelayModern",
      doc_id: "7711610262190099",
      variables: JSON.stringify(formData)
    };

    message.reply(`⏳ | Posting "${messageContent}", please wait.`);
    global.api.httpPost('https://www.facebook.com/api/graphql/', form, (error, response) => {
      if (!error) {
        message.reply(`✅ | Successfully posted on ${targetName}'s timeline!`);
      } else {
        console.error(error);
        message.reply('An error occurred while posting.');
      }
    });
  } catch (error) {
    console.error(error);
    message.reply('An error occurred.');
  }
}
