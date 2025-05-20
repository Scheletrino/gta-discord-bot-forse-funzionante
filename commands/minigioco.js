const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('minigioco')
    .setDescription('Avvia un minigioco con una domanda a scelta multipla'),

  async execute(interaction) {
    const domande = [

      // ========== 📘 Domande normali ==========
      {
        tipo: 'quiz',
        categoria: 'GTA V',
        domanda: 'Chi è il protagonista principale di GTA V?',
        opzioni: ['Niko Bellic', 'CJ', 'Tommy Vercetti', 'Michael De Santa'],
        rispostaCorretta: 3,
      },
      {
        tipo: 'quiz',
        categoria: 'GTA San Andreas',
        domanda: 'Qual è il nome completo di CJ?',
        opzioni: ['Carl Johnson', 'Christopher Johnson', 'Clarence Jones', 'Carlos Jimenez'],
        rispostaCorretta: 0,
      },
      {
        tipo: 'quiz',
        categoria: 'GTA IV',
        domanda: 'Da quale paese proviene Niko Bellic?',
        opzioni: ['Russia', 'Serbia', 'Polonia', 'Albania'],
        rispostaCorretta: 1,
      },
      {
        tipo: 'quiz',
        categoria: 'GTA V',
        domanda: 'Quale di questi non è un protagonista di GTA V?',
        opzioni: ['Franklin', 'Trevor', 'Lamar', 'Michael'],
        rispostaCorretta: 2,
      },
      {
        tipo: 'quiz',
        categoria: 'GTA San Andreas',
        domanda: 'Quale gang guida CJ?',
        opzioni: ['Ballas', 'Grove Street Families', 'Los Santos Vagos', 'Vercetti Gang'],
        rispostaCorretta: 1,
      },
      {
        tipo: 'quiz',
        categoria: 'GTA V',
        domanda: 'Dove vive Trevor Philips?',
        opzioni: ['Los Santos', 'Sandy Shores', 'Vinewood', 'Paleto Bay'],
        rispostaCorretta: 1,
      },
      {
        tipo: 'quiz',
        categoria: 'GTA IV',
        domanda: 'Chi è il cugino di Niko?',
        opzioni: ['Dimitri', 'Vlad', 'Roman', 'Brucie'],
        rispostaCorretta: 2,
      },
      {
        tipo: 'quiz',
        categoria: 'GTA San Andreas',
        domanda: 'In che città inizia GTA San Andreas?',
        opzioni: ['Las Venturas', 'Los Santos', 'San Fierro', 'Vice City'],
        rispostaCorretta: 1,
      },
      {
        tipo: 'quiz',
        categoria: 'GTA V',
        domanda: 'Quale azienda possiede Trevor?',
        opzioni: ['Trevor Philips Industries', 'Phillips Arms', 'Los Santos Gunrunners', 'T Industries'],
        rispostaCorretta: 0,
      },
      {
        tipo: 'quiz',
        categoria: 'GTA V',
        domanda: 'Chi è il marito di Amanda?',
        opzioni: ['Trevor', 'Franklin', 'Michael', 'Steve'],
        rispostaCorretta: 2,
      },

      // ========== 🖼️ Domande con immagine ==========
      {
        tipo: 'luogo',
        descrizione: 'Questa zona desertica ospita Sandy Shores e l’aeroporto abbandonato.',
        opzioni: ['Paleto Bay', 'Harmony', 'Sandy Shores', 'Grapeseed'],
        rispostaCorretta: 2,
        immagine: 'https://i.imgur.com/GdsD2G3.jpeg'
      },
      {
        tipo: 'luogo',
        descrizione: 'Questa zona balneare è famosa per la sua spiaggia e la ruota panoramica.',
        opzioni: ['Del Perro', 'Vespucci Beach', 'Paleto Cove', 'Chumash'],
        rispostaCorretta: 1,
        immagine: 'https://i.imgur.com/Jj6P9Ku.jpeg'
      },
      {
        tipo: 'luogo',
        descrizione: 'Questa zona industriale è sede di diversi magazzini e gang.',
        opzioni: ['Elysian Island', 'Cypress Flats', 'La Mesa', 'Murrieta Heights'],
        rispostaCorretta: 1,
        immagine: 'https://i.imgur.com/QwA4j9f.jpeg'
      },
      {
        tipo: 'luogo',
        descrizione: 'Questa zona montuosa è sede di molte strade tortuose.',
        opzioni: ['Mount Chiliad', 'Paleto Forest', 'Tataviam Mountains', 'Raton Canyon'],
        rispostaCorretta: 0,
        immagine: 'https://i.imgur.com/kDdWQXz.jpeg'
      },
      {
        tipo: 'luogo',
        descrizione: 'Questa zona è famosa per il campo da golf e le ville di lusso.',
        opzioni: ['Rockford Hills', 'Vinewood Hills', 'Richman', 'Morningwood'],
        rispostaCorretta: 0,
        immagine: 'https://i.imgur.com/jfXBYXZ.jpeg'
      },
      {
        tipo: 'luogo',
        descrizione: 'Questa cittadina rurale si trova nel nord della mappa.',
        opzioni: ['Grapeseed', 'Paleto Bay', 'Sandy Shores', 'Harmony'],
        rispostaCorretta: 1,
        immagine: 'https://i.imgur.com/CgkP9Zn.jpeg'
      },
      {
        tipo: 'luogo',
        descrizione: 'Questa zona ospita il porto principale della città.',
        opzioni: ['Los Santos Port', 'Terminal', 'Elysian Island', 'South LS Docks'],
        rispostaCorretta: 2,
        immagine: 'https://i.imgur.com/6A29hdZ.jpeg'
      },
      {
        tipo: 'luogo',
        descrizione: 'Questa zona è l’area dell’aeroporto internazionale.',
        opzioni: ['Fort Zancudo', 'Los Santos Intl', 'Sandy Airport', 'Palomino Airbase'],
        rispostaCorretta: 1,
        immagine: 'https://i.imgur.com/Rz8jwtu.jpeg'
      },
      {
        tipo: 'luogo',
        descrizione: 'Zona collinare con la famosa scritta "VINEWOOD".',
        opzioni: ['Richman', 'Vinewood Hills', 'Rockford Hills', 'Vespucci Canals'],
        rispostaCorretta: 1,
        immagine: 'https://i.imgur.com/2FIBJhG.jpeg'
      },
      {
        tipo: 'luogo',
        descrizione: 'Un luogo paludoso a nord-est della mappa.',
        opzioni: ['Alamo Sea', 'Paleto Forest', 'Zancudo Swamp', 'Tataviam Mountains'],
        rispostaCorretta: 2,
        immagine: 'https://i.imgur.com/4rA1Ght.jpeg'
      }
    ];

    const domanda = domande[Math.floor(Math.random() * domande.length)];

    const embed = new EmbedBuilder()
      .setTitle(domanda.tipo === 'quiz' ? `🎮 Domanda (${domanda.categoria})` : '📍 Indovina il luogo')
      .setDescription(domanda.tipo === 'quiz' ? domanda.domanda : domanda.descrizione)
      .setColor(domanda.tipo === 'quiz' ? '#FFA500' : '#00BFFF');

    if (domanda.immagine) {
      embed.setImage(domanda.immagine);
    }

    const buttons = new ActionRowBuilder();
    domanda.opzioni.forEach((opzione, index) => {
      buttons.addComponents(
        new ButtonBuilder()
          .setCustomId(`answer_${index}`)
          .
