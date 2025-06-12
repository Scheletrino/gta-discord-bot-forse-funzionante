const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

// Array domande luogo
const domandeLuogo = [
  {
    descrizione: 'Questa zona desertica ospita Sandy Shores e l’aeroporto abbandonato.',
    opzioni: ['Paleto Bay', 'Harmony', 'Sandy Shores', 'Grapeseed'],
    rispostaCorretta: 2,
    immagine: 'https://i.imgur.com/abc1234.jpg'
  },
  {
    descrizione: 'Questa zona balneare è famosa per la sua spiaggia e la ruota panoramica.',
    opzioni: ['Del Perro', 'Vespucci Beach', 'Paleto Cove', 'Chumash'],
    rispostaCorretta: 1,
    immagine: 'https://i.imgur.com/def5678.jpg'
  },
  // Aggiungi altre domande...
];

let ultimaDomandaLuogo = null;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('indovinaluogo')
    .setDescription('Indovina il luogo mostrato in un\'immagine di GTA'),

  async execute(interaction) {
    let domanda;
    do {
      domanda = domandeLuogo[Math.floor(Math.random() * domandeLuogo.length)];
    } while (domanda === ultimaDomandaLuogo && domandeLuogo.length > 1);
    ultimaDomandaLuogo = domanda;

    const embed = new EmbedBuilder()
      .setTitle('📍 Indovina il luogo')
      .setDescription(domanda.descrizione)
      .setColor('#00BFFF')
      .setImage(domanda.immagine);

    const buttons = new ActionRowBuilder();
    domanda.opzioni.forEach((opzione, index) => {
      buttons.addComponents(
        new ButtonBuilder()
          .setCustomId(`luogo_${index}`)
          .setLabel(opzione)
          .setStyle(ButtonStyle.Primary)
      );
    });

    const message = await interaction.reply({
      embeds: [embed],
      components: [buttons],
      fetchReply: true
    });

    const collector = message.createMessageComponentCollector({ time: 15000 });

    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({ content: '❌ Questo quiz non è per te!', ephemeral: true });
      }

      const selected = parseInt(i.customId.split('_')[1], 10);
      const correct = selected === domanda.rispostaCorretta;

      await i.update({
        content: correct ? '✅ Giusto!' : `❌ No! Era **${domanda.opzioni[domanda.rispostaCorretta]}**.`,
        embeds: [],
        components: []
      });

      collector.stop();
    });

    collector.on('end', async collected => {
      if (collected.size === 0) {
        await interaction.editReply({
          content: '⏱️ Tempo scaduto!',
          embeds: [],
          components: []
        });
      }
    });
  }
};
