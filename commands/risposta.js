const { SlashCommandBuilder } = require('discord.js');
const { addPoints } = require('../utils/scoreManager');

const CANALE_AUTORIZZATO = '1372183510500114543';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('risposta')
    .setDescription('Rispondi al quiz')
    .addStringOption(opt =>
      opt.setName('lettera')
         .setDescription('La tua risposta (A, B, C, D)')
         .setRequired(true)
    ),
  async execute(interaction) {
    if (interaction.channel.id !== CANALE_AUTORIZZATO) {
      return interaction.reply({ content: '❌ Questo comando può essere usato solo nel canale designato.', ephemeral: true });
    }

    const answer = interaction.options.getString('lettera').toUpperCase();
    const map = interaction.client.activeQuestions || {};
    const correct = map[interaction.user.username];

    if (!correct) {
      return interaction.reply('❌ Nessuna domanda attiva. Usa `/minigioco`!');
    }

    if (answer === correct) {
      addPoints(interaction.user.username, 1);
      await interaction.reply(`✅ Risposta corretta! Hai guadagnato 1 punto.`);
    } else {
      await interaction.reply(`❌ Sbagliato! La risposta giusta era **${correct}**.`);
    }

    delete map[interaction.user.username];
  }
};
