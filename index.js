require('dotenv').config();
const port = process.env.PORT || 4000;

const TelegramBot = require('node-telegram-bot-api');
const net = require('net');

// Ottieni il token dalle variabili d'ambiente
const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('BOT_TOKEN non trovato nelle variabili d\'ambiente');
  process.exit(1);
}

// Crea una nuova istanza del bot
const bot = new TelegramBot(token, { polling: true });

// Gestisci il comando /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Ciao! Sono il tuo bot Telegram. Usa /help per vedere i comandi disponibili.');
});

// Gestisci il comando /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `
Comandi disponibili:
/start - Avvia il bot
/help - Mostra questo messaggio di aiuto
/info - Informazioni sul bot
/memory - Gioca al memory
/tris - Gioca al tris
`);
});

// Gestisci il comando /info
bot.onText(/\/info/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `
Bot creato durante il corso di Containerizzazione e Deployment.
Versione: 1.0.0
Ambiente: ${process.env.NODE_ENV || 'development'}
`);
});

// Gestisci il comando /memory
bot.onText(/\/memory/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `
Link al sito :  https://mazzo08.github.io/memory-game/
Ambiente: ${process.env.NODE_ENV || 'development'}
`);
});

// Gestisci il comando /tris
bot.onText(/\/tris/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `
Link al sito:  https://mazzo08.github.io/tris-game
Ambiente: ${process.env.NODE_ENV || 'development'}
`);
});

// Gestisci messaggi non riconosciuti
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // Ignora i comandi che abbiamo già gestito
  if (msg.text && (msg.text.startsWith('/start') || 
                   msg.text.startsWith('/help') || 
                   msg.text.startsWith('/info') ||
                   msg.text.startsWith('/memory') || 
                   msg.text.startsWith('/tris')
                )) {
    return;
  }

  bot.sendMessage(chatId, 'Non ho capito. Usa /help per vedere i comandi disponibili.');
});

console.log('Bot avviato con successo!');

// --- Parte per tenere "sveglio" il bot con connessione TCP ---

const HOST = '127.0.0.1'; // localhost
const PORT = port;

setInterval(() => {
  const socket = new net.Socket();

  socket.setTimeout(5000); // timeout di 5 secondi

  socket.connect(PORT, HOST, () => {
    console.log(`[${new Date().toISOString()}] Connessione a ${HOST}:${PORT} riuscita.`);
    socket.end(); // chiude la connessione
  });

  socket.on('timeout', () => {
    console.error(`[${new Date().toISOString()}] Timeout nella connessione a ${HOST}:${PORT}`);
    socket.destroy();
  });

  socket.on('error', (err) => {
    console.error(`[${new Date().toISOString()}] Errore connessione a ${HOST}:${PORT}:`, err.message);
  });

}, 600000); // ogni 10 minuti
