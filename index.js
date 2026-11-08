// Dependências
const { Client, GatewayIntentBits } = require("discord.js");
const { token } = require("./src/configs/config.json");
const connectDB = require("./src/database/mongoose");

// Cliente do Discord com os intents necessários
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

// Conexão com o MongoDB
connectDB();

// Carrega os handlers de eventos e comandos
["Events", "Commands"].forEach((handler) => {
    try {
        require(`./src/handlers/${handler}.js`)(client);
    } catch (err) {
        console.error(`Erro ao carregar ${handler}:`, err.message);
    }
});

// Login do bot
client.login(token);
