
const { SlashCommandBuilder } = require('discord.js');
const questions = require('../data/questions.json');
const activeQuestions = {};

module.exports = {
  data: new SlashCommandBuilder().setName('minigioco').setDescription('Inizia un quiz GTA!'),
  async execute(interaction) {
    const random = questions[Math.floor(Math.random() * questions.length)];
    const formatted = random.options.join('\n');
    activeQuestions[interaction.user.username] = random.correct;
    interaction.client.activeQuestions = activeQuestions;

    await interaction.reply(`🎮 **Domanda:** ${random.question}\n\n${formatted}\n\nUsa \`/risposta <lettera>\``);
  }
};
