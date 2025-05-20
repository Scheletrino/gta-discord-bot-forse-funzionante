// commands/minigioco.js
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require('discord.js');

const quizDomande = [
  // GTA Storia
  {
    tipo: 'quiz',
    categoria: 'GTA Storia',
    domanda: 'Chi è il protagonista principale di GTA V?',
    opzioni: ['Franklin', 'Michael', 'Trevor', 'CJ'],
    rispostaCorretta: 1,
  },
  {
    tipo: 'quiz',
    categoria: 'GTA Storia',
    domanda: 'In che anno è ambientato GTA: San Andreas?',
    opzioni: ['1992', '1985', '2001', '1999'],
    rispostaCorretta: 0,
  },
  {
    tipo: 'quiz',
    categoria: 'GTA Storia',
    domanda: 'Chi tradisce CJ in GTA: San Andreas?',
    opzioni: ['Sweet', 'Ryder', 'Big Smoke', 'Tenpenny'],
    rispostaCorretta: 2,
  },
  // GTA Curiosità
  {
    tipo: 'quiz',
    categoria: 'GTA Curiosità',
    domanda: 'In quale città fittizia è ambientato GTA: Vice City?',
    opzioni: ['Los Santos', 'Las Venturas', 'Vice City', 'Liberty City'],
    rispostaCorretta: 2,
  },
  {
    tipo: 'quiz',
    categoria: 'GTA Curiosità',
    domanda: 'Quale famoso attore ha doppiato Tommy Vercetti?',
    opzioni: ['Ray Liotta', 'Robert De Niro', 'Al Pacino', 'Joe Pesci'],
    rispostaCorretta: 0,
  },
  {
    tipo: 'quiz',
    categoria: 'GTA Curiosità',
    domanda: 'Quale città reale ha ispirato Los Santos?',
    opzioni: ['New York', 'Miami', 'Los Angeles', 'Chicago'],
    rispostaCorretta: 2,
  },
  // GTA Meccaniche
  {
    tipo: 'quiz',
    categoria: 'GTA Meccaniche',
    domanda: 'Quale veicolo non è pilotabile in GTA V?',
    opzioni: ['Jet', 'Bicicletta', 'Portaerei', 'Monster Truck'],
    rispostaCorretta: 2,
  },
  {
    tipo: 'quiz',
    categoria: 'GTA Meccaniche',
    domanda: 'Cosa succede se accumuli 5 stelle di sospetto in GTA V?',
    opzioni: ['Ti inseguono i civili', 'Arriva la SWAT', 'Compare Trevor', 'Il gioco si blocca'],
    rispostaCorretta: 1,
  },
  {
    tipo: 'quiz',
    categoria: 'GTA Meccaniche',
    domanda: 'Quale di questi non è un’arma in GTA V?',
    opzioni: ['Fucile a pompa', 'Ascia da pompiere', 'Spada laser', 'Granata adesiva'],
    rispostaCorretta: 2,
  }
];

const indovinaPosti = [
  {
    tipo: 'luogo',
    descrizione: 'Questa zona desertica ospita Sandy Shores e l’aeroporto abbandonato.',
    opzioni: ['Paleto Bay', 'Harmony', 'Sandy Shores', 'Grapeseed'],
    rispostaCorretta: 2,
    immagine: 'https://i.imgur.com/yNTHjDk.jpg' // esempio immagine
  },
  {
    tipo: 'luogo',
    descrizione: 'Quartiere ricco dove vive Michael.',
    opzioni: ['Davis', 'Rockford Hills', 'Del Perro', 'Vinewood'],
    rispostaCorretta: 1,
    immagine: 'https://i.imgur.com/tjlST8k.jpg' // esempio immagine
  },
  {
    tipo: 'luogo',
    descrizione: 'Zona industriale dove spesso si svolgono missioni criminali.',
    opzioni: ['La Puerta', 'Elysian Island', 'Terminal', 'Cypress Flats'],
    rispostaCorretta: 3,
    immagine: 'https://i.imgur.com/xKpqUeL.jpg' // esempio immagine
  }
];

let domandeUsate = [];

function prendiDomandaCasuale() {
  const tutte = [...quizDomande, ...indovinaPosti];
  const nonUsate = tutte.filter(d => !domandeUsate.includes(d));
  if (nonUsate.length === 0) return null;
  const scelta = nonUsate[Math.floor(Math.random() * nonUsate.length)];
  domandeUsate.push(scelta);
  return scelta;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('minigioco')
    .setDescription('Avvia un minigioco quiz o indovina il luogo su GTA!'),

  async execute(interaction) {
    const domanda = prendiDomandaCasuale();
    if (!domanda) {
      domandeUsate = [];
      return interaction.reply('✅ Hai risposto a tutte le domande disponibili! Rigioca fra poco.');
    }

    const embed = new EmbedBuilder()
      .setTitle(domanda.tipo === 'quiz' ? `🎮 Domanda (${domanda.categoria})` : '📍 Indovina il luogo')
      .setDescription(domanda.tipo === 'quiz' ? domanda.domanda : domanda.descrizione)
      .setColor(domanda.tipo === 'quiz' ? '#FFA500' : '#00BFFF');

    if (domanda.tipo === 'luogo' && domanda.immagine) {
      embed.setImage(domanda.immagine);
    }

    const row = new ActionRowBuilder();
    domanda.opzioni.forEach((opzione, i) => {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`risposta_${i}`)
          .setLabel(opzione)
          .setStyle(ButtonStyle.Primary)
      );
    });

    const messaggio = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

    const collector = messaggio.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15_000,
    });

    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({ content: '⛔ Questo quiz non è per te!', ephemeral: true });
      }

      const scelta = parseInt(i.customId.split('_')[1]);
      const corretta = scelta === domanda.rispostaCorretta;

      await i.reply({
        content: corretta
          ? '✅ Risposta corretta!'
          : `❌ Sbagliato! La risposta giusta era: **${domanda.opzioni[domanda.rispostaCorretta]}**`,
        ephemeral: true
      });
      collector.stop();
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.editReply({ content: '⏰ Tempo scaduto! Nessuna risposta ricevuta.', components: [] });
      } else {
        interaction.editReply({ components: [] });
      }
    });
  },
};


