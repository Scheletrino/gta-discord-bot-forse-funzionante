
// commands/indovinaLuogo.js
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require('discord.js');
const path = require('path');

const luoghi = [
  {
    immagine: 'assets/luoghi/vespucci-beach.jpg',
    opzioni: ['Vespucci Beach', 'Del Perro Pier', 'Vinewood Hills', 'Sandy Shores'],
    rispostaCorretta: 0,
  },
  {
    immagine: 'assets/luoghi/maze-bank.jpg',
    opzioni: ['Maze Bank', 'FIB Building', 'IAA Headquarters', 'Los Santos Tower'],
    rispostaCorretta: 0,
  },
  {
    immagine: 'assets/luoghi/mount-chiliad.jpg',
    opzioni: ['Mount Chiliad', 'Vinewood Hills', 'Paleto Forest', 'Alamo Sea'],
    rispostaCorretta: 0,
  }
];

function prendiLuogoCasuale() {
  return luoghi[Math.floor(Math.random() * luoghi.length)];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('indovinaluogo')
    .setDescription('Indovina il luogo mostrato nella foto di GTA'),

  async execute(interaction) {
    const luogo = prendiLuogoCasuale();

    const embed = new EmbedBuilder()
      .setTitle('📸 Dove si trova questo luogo?')
      .setImage(`attachment://${path.basename(luogo.immagine)}`)
      .setColor('#00BFFF');

    const row = new ActionRowBuilder();
    luogo.opzioni.forEach((opzione, i) => {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`risposta_${i}`)
          .setLabel(opzione)
          .setStyle(ButtonStyle.Primary)
      );
    });

    const allegato = { attachment: path.resolve(luogo.immagine), name: path.basename(luogo.immagine) };
    const messaggio = await interaction.reply({ embeds: [embed], components: [row], files: [allegato], fetchReply: true });

    const collector = messaggio.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15000,
    });

    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({ content: '⛔ Questo quiz è per qualcun altro!', ephemeral: true });
      }

      const scelta = parseInt(i.customId.split('_')[1]);
      const corretta = scelta === luogo.rispostaCorretta;

      await i.reply({ content: corretta ? '✅ Giusto!' : `❌ No! La risposta corretta era: **${luogo.opzioni[luogo.rispostaCorretta]}**`, ephemeral: true });
      collector.stop();
    });

    collector.on('end', () => {
      interaction.editReply({ components: [] });
    });
  },
};
