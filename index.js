
require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');
const axios = require('axios');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const Parser = require('rss-parser');

dayjs.extend(duration);
const parser = new Parser();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const prefix = '!';
const GTA6_RELEASE_DATE = dayjs('2026-05-26T00:00:00');
const NEWS_CHANNEL_ID = process.env.NEWS_CHANNEL_ID;
let lastPostedLink = null;

// Quiz logic
let currentQuiz = null;
let currentCorrect = null;
let scores = {}; // { userId: score }

const quizQuestions = [
  {
    question: 'Quale città è la principale in GTA San Andreas?',
    options: ['A) Liberty City', 'B) Los Santos', 'C) Vice City', 'D) North Yankton'],
    correct: 'B'
  },
  {
    question: 'Chi è il protagonista di GTA V?',
    options: ['A) Tommy', 'B) CJ', 'C) Franklin', 'D) Niko'],
    correct: 'C'
  },
  {
    question: 'In quale gioco appare Vice City?',
    options: ['A) GTA III', 'B) GTA San Andreas', 'C) GTA IV', 'D) GTA Vice City'],
    correct: 'D'
  },
  {
    question: 'Come si chiama lo stato fittizio di GTA 6?',
    options: ['A) San Andreas', 'B) Leonida', 'C) Liberty', 'D) Floride'],
    correct: 'B'
  },
  {
    question: 'Qual è il nome del protagonista di GTA IV?',
    options: ['A) Michael', 'B) Franklin', 'C) Niko', 'D) Trevor'],
    correct: 'C'
  },
  {
    question: 'In quale gioco GTA c’è CJ come protagonista?',
    options: ['A) GTA III', 'B) GTA San Andreas', 'C) GTA Vice City', 'D) GTA V'],
    correct: 'B'
  }
];

client.once(Events.ClientReady, () => {
  console.log(`✅ Bot online come ${client.user.tag}`);
  fetchAndPostNews();
  setInterval(fetchAndPostNews, 3600000);
});

client.on(Events.MessageCreate, async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'countdown') {
    try {
      const now = dayjs();
      const diff = GTA6_RELEASE_DATE.diff(now);
      if (diff <= 0) {
        return message.channel.send('🕹️ GTA 6 è già uscito!');
      }

      const dur = dayjs.duration(diff);
      const days = dur.days() + dur.months() * 30 + dur.years() * 365;
      const hours = dur.hours();
      const minutes = dur.minutes();

      message.channel.send(`🕒 GTA 6 esce tra ${days} giorni, ${hours} ore e ${minutes} minuti!`);
    } catch (err) {
      console.error(err);
      message.channel.send('❌ Errore nel calcolare il countdown.');
    }
  }

  else if (command === 'fan') {
    const roleName = "Fan di GTA 6";
    let role = message.guild.roles.cache.find(r => r.name === roleName);

    if (!role) {
      try {
        role = await message.guild.roles.create({
          name: roleName,
          reason: 'Ruolo per fan GTA 6'
        });
      } catch (err) {
        console.error(err);
        return message.channel.send('❌ Non posso creare il ruolo.');
      }
    }

    try {
      await message.member.roles.add(role);
      message.channel.send(`✅ Hai ricevuto il ruolo **${roleName}**!`);
    } catch (err) {
      console.error(err);
      message.channel.send("❌ Errore nell'assegnare il ruolo.");
    }
  }

  else if (command === 'personaggi') {
    message.channel.send(`👥 **Personaggi confermati in GTA 6:**

• **Jason** – protagonista maschile
• **Lucia** – protagonista femminile
• Vari NPC mostrati nel trailer: membri di gang, poliziotti, civili, influencer, animali e altro ancora

🎥 *Jason e Lucia sono i primi protagonisti giocabili in coppia nella storia di GTA.*`);
  }

  else if (command === 'veicoli') {
    message.channel.send(`🚗 **Veicoli confermati in GTA 6:**

**Auto & SUV:** Oceanic, Audi RS5, Pegassi Aventador, Grotti Furia, Cheetah Classic, Bravado Bison, Enus Jubilee, Vapid Caracara, Tulip M-100, Police Cruiser
**Moto:** Carbon RS, Western Sovereign
**Speciali:** Tour Bus, Speedo, Granger 3600LX, Phantom con rimorchio
**Imbarcazioni:** Longfin, Seashark, Speeder, Tropic, Airboat, Catamarano
**Elicotteri/Aerei:** Maverick, Sea Sparrow, Blimp, Dodo`);
  }

  else if (command === 'mappa') {
    message.channel.send('🗺️ GTA 6 sarà ambientato a **Vice City (Leonida State)**. Mappa in aggiornamento appena disponibile.');
  }

  else if (command === 'minigioco') {
    const random = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
    currentQuiz = random;
    currentCorrect = random.correct.toUpperCase();

    const formattedOptions = random.options.join('\n');
    message.channel.send(`🎮 **Domanda:**\n${random.question}\n\n${formattedOptions}\n\nRispondi con \`!risposta <lettera>\``);
  }

  else if (command === 'risposta') {
    if (!currentQuiz) {
      return message.channel.send('❌ Nessun quiz attivo. Scrivi `!minigioco` per iniziare.');
    }

    const userAnswer = args[0]?.toUpperCase();
    if (!userAnswer || !['A', 'B', 'C', 'D'].includes(userAnswer)) {
      return message.channel.send('❌ Risposta non valida. Usa A, B, C o D.');
    }

    if (userAnswer === currentCorrect) {
      const userId = message.author.id;
      scores[userId] = (scores[userId] || 0) + 1;
      message.channel.send(`✅ Esatto! Hai totalizzato **${scores[userId]} punto/i** 🎉`);
    } else {
      message.channel.send(`❌ No! La risposta corretta era **${currentCorrect}**.`);
    }

    currentQuiz = null;
    currentCorrect = null;
  }
});

async function fetchAndPostNews() {
  try {
    const feed = await parser.parseURL('https://rockstarintel.com/feed');
    const item = feed.items[0];
    if (item.link !== lastPostedLink) {
      const channel = await client.channels.fetch(NEWS_CHANNEL_ID);
      if (channel) {
        channel.send(`📰 **${item.title}**\n${item.link}`);
        lastPostedLink = item.link;
      }
    }
  } catch (err) {
    console.error('❌ Errore nel recupero delle notizie:', err);
  }
}

client.login(process.env.DISCORD_TOKEN);

const express = require('express');
const app = express();
app.get('/', (req, res) => {
  res.send('Bot GTA è online!');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Web server attivo su porta ${PORT}`);
});
