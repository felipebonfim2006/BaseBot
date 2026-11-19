// Dependências
import { Client, GatewayIntentBits } from "discord.js";
import connectDB from "./src/database/mongoose.js";
import "dotenv/config";

// Cliente do Discord com os intents necessários
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

// Inicia a conexão com o MongoDB
await connectDB();

// Lista com os nomes dos handlers que serão carregados dinamicamente
const handlers = ["events", "commands"];

// Percorre cada handler na ordem definida no array
for (const handler of handlers) {
    try {
        // Importa dinamicamente o arquivo do handler no padrão ESM
        const module = await import(`./src/handlers/${handler}.js`);

        // Verifica se o export default é uma função antes de executar
        if (typeof module.default === "function") {
            // Aguarda a execução do handler passando a instância do client
            await module.default(client);
        } else {
            console.warn(
                `[WARNING] O handler ${handler} não possui um export default válido.`,
            );
        }
    } catch (err) {
        // Captura e exibe erros de importação ou execução sem derrubar os outros handlers
        console.error(`[ERROR] Erro ao carregar o handler ${handler}:`, err);
    }
}

// Login do bot
await client.login(process.env.TOKEN);
