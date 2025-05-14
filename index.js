
require('dotenv').config();
const { Client, GatewayIntentBits, Events, EmbedBuilder } = require('discord.js');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const express = require('express');

dayjs.extend(duration);

const client = new Client({
  intents: [GatewayIntentBits.Guilds]

  if (commandName === 'classifica') {
    const entries = Object.entries(scores);
    if (entries.length === 0) {
      return interaction.reply('📉 Nessun punteggio registrato ancora!');
    }
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    const top = sorted.slice(0, 5).map(([userId, score], index) => 
      `${index + 1}. <@${userId}> — **${score}** punto/i`
    ).join('\n');
    return interaction.reply(`🏆 **Classifica GTA Quiz**\n\n${top}`);
  }
});

const GTA6_RELEASE_DATE = dayjs('2026-05-26T00:00:00');

let currentQuiz = {};
let scores = {};

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
  }
];

client.once(Events.ClientReady, () => {
  console.log(`✅ Bot online come ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const { commandName, user, options } = interaction;

  if (commandName === 'countdown') {
    const now = dayjs();
    const diff = GTA6_RELEASE_DATE.diff(now);
    if (diff <= 0) return interaction.reply('🕹️ GTA 6 è già uscito!');
    const dur = dayjs.duration(diff);
    const days = dur.days() + dur.months() * 30 + dur.years() * 365;
    const hours = dur.hours();
    const minutes = dur.minutes();
    const embed = new EmbedBuilder()
      .setColor(0x00FF00)
      .setTitle('⏳ Countdown per GTA 6')
      .setDescription(`Esce tra **${days} giorni**, **${hours} ore** e **${minutes} minuti**!`)
      .setTimestamp(new Date());
    return interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'veicoli') {
    return interaction.reply(`🚗 **Veicoli confermati in GTA 6:**
Auto & SUV: Oceanic, Audi RS5, Pegassi Aventador, Grotti Furia, Bravado Bison  
Moto: Carbon RS, Western Sovereign  
Speciali: Tour Bus, Speedo, Granger 3600LX  
Imbarcazioni: Longfin, Seashark, Airboat  
Elicotteri/Aerei: Maverick, Sea Sparrow, Blimp, Dodo`);
  }

  if (commandName === 'personaggi') {
    return interaction.reply(`👥 **Personaggi confermati in GTA 6:**
• Jason – protagonista maschile  
• Lucia – protagonista femminile  
• Altri NPC: gang, polizia, civili, animali`);
  }

  if (commandName === 'mappa') {
    return interaction.reply('🗺️ GTA 6 sarà ambientato a **Vice City (Leonida State)**.');
  }

  if (commandName === 'minigioco') {
    const question = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
    currentQuiz[user.id] = question;
    const optionsText = question.options.join('\n');
    return interaction.reply(`🎮 **Domanda:**
${question.question}

${optionsText}

Usa \`/risposta\` con la lettera!`);
  }

  if (commandName === 'risposta') {
    const userId = user.id;
    const userAnswer = options.getString('lettera')?.toUpperCase();

    if (!currentQuiz[userId]) {
      return interaction.reply('❌ Nessuna domanda attiva. Usa `/minigioco`!');
    }

    const correct = currentQuiz[userId].correct;
    delete currentQuiz[userId];

    if (userAnswer === correct) {
      scores[userId] = (scores[userId] || 0) + 1;
      return interaction.reply(`✅ Giusto! Hai **${scores[userId]}** punto/i.`);
    } else {
      return interaction.reply(`❌ Sbagliato. La risposta corretta era **${correct}**.`);
    }
  }
});

// Express keep-alive
const app = express();
app.get('/', (req, res) => res.send('Bot GTA è attivo!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Web attivo su porta ${PORT}`);
});

client.login(process.env.DISCORD_TOKEN);
