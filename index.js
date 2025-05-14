
require('dotenv').config();
const { Client, GatewayIntentBits, Events, REST, Routes, EmbedBuilder } = require('discord.js');
const express = require('express');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');

dayjs.extend(duration);

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const GTA6_RELEASE_DATE = dayjs('2026-05-26T00:00:00');
const COUNTDOWN_CHANNEL_ID = '1372183339032645672';

let countdownMessage = null;
let currentQuiz = {};
let scores = {};

function updateCountdown() {
  if (!countdownMessage) return;
  const now = dayjs();
  const diff = GTA6_RELEASE_DATE.diff(now);
  if (diff <= 0) {
    countdownMessage.edit({ content: '🕹️ GTA 6 è già uscito!' });
    return;
  }
  const dur = dayjs.duration(diff);
  const days = dur.days() + dur.months() * 30 + dur.years() * 365;
  const hours = dur.hours().toString().padStart(2, '0');
  const minutes = dur.minutes().toString().padStart(2, '0');
  const seconds = dur.seconds().toString().padStart(2, '0');

  const embed = new EmbedBuilder()
    .setColor(0x00ff00)
    .setTitle('⏳ Countdown per GTA 6')
    .setDescription(`▶️ Esce tra **${days} giorni**, **${hours}:${minutes}:${seconds}**`)
    .setTimestamp(new Date());

  countdownMessage.edit({ embeds: [embed] });
}

client.once(Events.ClientReady, async () => {
  console.log(`✅ Bot online come ${client.user.tag}`);

  // Countdown automatico
  const channel = await client.channels.fetch(COUNTDOWN_CHANNEL_ID);
  if (channel && channel.isTextBased()) {
    const embed = new EmbedBuilder().setColor(0xff0000).setTitle('⏳ Countdown GTA 6').setDescription('Caricamento...').setTimestamp(new Date());
    countdownMessage = await channel.send({ embeds: [embed] });
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // Slash command auto-deploy
  const commands = [
    { name: 'countdown', description: 'Mostra il countdown animato' },
    { name: 'veicoli', description: 'Mostra i veicoli disponibili' },
    { name: 'personaggi', description: 'Mostra i personaggi disponibili' },
    { name: 'mappa', description: 'Mostra la mappa di gioco' },
    { name: 'minigioco', description: 'Inizia un minigioco' },
    {
      name: 'risposta',
      description: 'Rispondi al minigioco',
      options: [{ name: 'lettera', type: 3, description: 'La tua risposta', required: true }]
    },
    { name: 'classifica', description: 'Mostra la classifica del minigioco' }
  ];

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  try {
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, '1247199833220190300'), { body: commands });
    console.log('✅ Comandi slash registrati automaticamente');
  } catch (err) {
    console.error('❌ Errore nella registrazione dei comandi slash:', err);
  }
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
    const hours = dur.hours().toString().padStart(2, '0');
    const minutes = dur.minutes().toString().padStart(2, '0');
    const seconds = dur.seconds().toString().padStart(2, '0');
    const embed = new EmbedBuilder()
      .setColor(0x00ff00)
      .setTitle('⏳ Countdown per GTA 6')
      .setDescription(`▶️ Esce tra **${days} giorni**, **${hours}:${minutes}:${seconds}**`)
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

  if (commandName === 'classifica') {
    const entries = Object.entries(scores);
    if (entries.length === 0) return interaction.reply('📉 Nessun punteggio registrato ancora!');
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    const top = sorted.slice(0, 5).map(([userId, score], i) => `${i + 1}. <@${userId}> — **${score}** punto/i`).join('\n');
    return interaction.reply(`🏆 **Classifica GTA Quiz**\n\n${top}`);
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
