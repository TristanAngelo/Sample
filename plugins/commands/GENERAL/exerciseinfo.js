import axios from 'axios';

export default {
  config: {
    name: 'exerciseinfo',
    aliases: ["exercises", "exercise"],
    version: '1.0',
    credits: 'JV Barcenas',
    description: 'Retrieves information about a specified exercise from the Exercise API.',
    usage: ''
  },
  onCall: async function({ message, args }) {
    try {
      // Check if the user provided an exercise
      if (!args[0]) {
        const guideMessage = `
          Guide: 
          abdominals,
          abductors,
          adductors,
          biceps,
          calves,
          chest,
          forearms,
          glutes,
          hamstrings,
          lats,
          lower_back,
          middle_back,
          neck,
          quadriceps,
          traps,
          triceps
        `;
        message.reply(guideMessage);
        return;
      }

      const exercise = args[0];
      const apiUrl = `https://exercise-api.dreamcorps.repl.co/api/exercises?exercise=${exercise}`;

      const response = await axios.get(apiUrl);

      if (response.status !== 200 || !response.data || response.data.length === 0) {
        throw new Error('Invalid or missing response from Exercise API');
      }

      const exercises = response.data;

      const randomIndex = Math.floor(Math.random() * exercises.length);
      const randomExercise = exercises[randomIndex];

      const {
        name,
        type,
        muscle,
        equipment,
        difficulty,
        instructions
      } = randomExercise;

      const messages = `
        Exercise: ${name}
        Type: ${type}
        Muscle: ${muscle}
        Equipment: ${equipment}
        Difficulty: ${difficulty}
        Instructions: ${instructions}
      `;

      const messageID = await message.reply(messages);
      if (!messageID) {
        throw new Error('Failed to send message');
      }

      console.log(`Sent exercise information with message ID ${messageID}`);
    } catch (error) {
      console.error(`Failed to send exercise information: ${error.message}`);
      message.reply('Sorry, something went wrong while trying to retrieve exercise information. Please try again later.');
    }
  }
};