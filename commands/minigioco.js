
const { SlashCommandBuilder } = require('discord.js');
const questions = require('../data/questions.json');

const CANALE_AUTORIZZATO = '1372183510500114543';
const activeQuestions = {};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('minigioco')
    .setDescription('Inizia un quiz GTA!'),
  async execute(interaction) {
    if (interaction.channel.id !== CANALE_AUTORIZZATO) {
      return interaction.reply({ content: '❌ Questo comando può essere usato solo nel canale designato.', ephemeral: true });
    }
    const random = questions[Math.floor(Math.random() * questions.length)];
    const formatted = random.options.join('\n');
    activeQuestions[interaction.user.username] = random.correct;
    interaction.client.activeQuestions = activeQuestions;
    await interaction.reply(`🎮 **Domanda:** ${random.question}\n\n${formatted}\n\nUsa \`/risposta <lettera>\``);
  }
};

