const { SlashCommandBuilder } = require('discord.js');

const RUOLO_FAN_ID = '1371221318124703805';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('diventafan')
    .setDescription('Ricevi il ruolo GTA Fan'),
  async execute(interaction) {
    try {
      const member = interaction.member;
      if (member.roles.cache.has(RUOLO_FAN_ID)) {
        return interaction.reply({ content: 'Sei già un fan di GTA!', ephemeral: true });
      }
      await member.roles.add(RUOLO_FAN_ID);
      await interaction.reply('🎉 Ora sei un fan di GTA! Ruolo assegnato.');
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ Non posso assegnarti il ruolo. Contatta un admin.', ephemeral: true });
    }
  }
};
