import axios from 'axios';

export const config = {
  name: "recipe",
  version: "1.0",
  credits: "RICKCIEL / Adjusted by Draffodils",
  description: "Fetch a specific recipe.",
  cooldown: 5,
};

export async function onCall({ message, args }) {
  const searchTerm = args.join(" ");

  try {

    const apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`;

    const response = await axios.get(apiUrl);
    const recipes = response.data.meals;

    if (recipes) {
      const recipe = recipes[0];
      const messages = `🍽️ | Recipe: ${recipe.strMeal}\n\n🥗 | Category: ${recipe.strCategory}\n\n📝 | Instructions:\n${recipe.strInstructions}`;

      message.reply(messages);
    } else {
      message.reply(`No recipe found for "${searchTerm}".`);
    }
  } catch (error) {
    console.error('Error fetching recipe:', error);
    message.reply("An error occurred while fetching the recipe.");
  }
};
