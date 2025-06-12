const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

// Array di domande quiz
const domandeQuiz = [
  {
    categoria: 'GTA V',
    domanda: 'Chi è il protagonista principale di GTA V?',
    opzioni: ['Niko Bellic', 'CJ', 'Tommy Vercetti', 'Michael De Santa'],
    rispostaCorretta: 3,
  },
  {
    categoria: 'GTA San Andreas',
    domanda: 'Qual è il nome completo di CJ?',
    opzioni: ['Carl Johnson', 'Christopher Johnson', 'Clarence Jones', 'Carlos Jimenez'],
    rispostaCorretta: 0,
  },
  // Aggiungi altre domande...
];

let ultimaDomandaQuiz = null;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('minigioco')
    .setDescription('Avvia un minigioco con una domanda a scelta multipla'),

  async execute(interaction) {
    // Evita ripetizione
    let domanda;
    do {
      domanda = domandeQuiz[Math.floor(Math.random() * domandeQuiz.length)];
    } while (domanda === ultimaDomandaQuiz && domandeQuiz.length > 1);
    ultimaDomandaQuiz = domanda;

    const embed = new EmbedBuilder()
      .setTitle(`🎮 Domanda (${domanda.categoria})`)
      .setDescription(domanda.domanda)
      .setColor('#FFA500');

    const buttons = new ActionRowBuilder();
    domanda.opzioni.forEach((opzione, index) => {
      buttons.addComponents(
        new ButtonBuilder()
          .setCustomId(`answer_${index}`)
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
        content: correct ? '✅ Risposta corretta!' : `❌ Risposta sbagliata. Quella giusta era **${domanda.opzioni[domanda.rispostaCorretta]}**.`,
        embeds: [],
        components: []
      });

      collector.stop();
    });

    collector.on('end', async collected => {
      if (collected.size === 0) {
        await interaction.editReply({
          content: '⏱️ Tempo scaduto! Nessuna risposta.',
          embeds: [],
          components: []
        });
      }
    });
  }
};
