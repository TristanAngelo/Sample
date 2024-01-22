import { v4 as uuidv4 } from 'uuid';

const postCost = 100000;

export const config = {
  name: 'rantwall',
  description: 'Make a rant post in bot timeline.',
  usage: '[target name] | [message] | [codename]',
  cooldown: 50,
  permissions: [0],
  credits: 'Grim'
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
    if (input.length !== 3) {
      message.reply('Please provide the input in the format: target name | message | codename');
      return;
    }
    const targetName = input[0];
    const messageContent = input[1];
    const codename = input[2];

    const postOutput = `
🧱 | Rant Wall

To: ${targetName}

📃 | Message:
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
          "privacy": {
            "allow": [],
            "base_state": "EVERYONE",
            "deny": [],
            "tag_expansion_state": "UNSPECIFIED"
          }
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

    message.reply(`✅ | Posting "${messageContent}", please wait...`);
    global.api.httpPost('https://www.facebook.com/api/graphql/', form, (error, response) => {
      if (!error) {
        message.reply(`✅ | Successfully posted!\n━━━━━━━━━━━━━${postOutput}`);
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