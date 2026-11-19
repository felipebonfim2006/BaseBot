import { Events, REST, Routes, ActivityType } from "discord.js";
import "dotenv/config";
// import Guild from '../../database/models/Guild.js';

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        // Configura o status do bot
        client.user.setPresence({
            activities: [
                {
                    name: "A Lua",
                    type: ActivityType.Watching,
                },
            ],
            status: "idle",
        });
        console.log(`[READY] Logged in as ${client.user.tag}`);

        const commandsJson = [];

        // Coleta os Slash Commands carregados da memória
        if (client.slashCommands) {
            client.slashCommands.forEach((cmd) => {
                if (cmd.data) {
                    commandsJson.push(cmd.data.toJSON());
                }
            });
        }

        const rest = new REST().setToken(process.env.TOKEN);

        try {
            /* 
              ==================================================
              PARTE DO BANCO DE DADOS COMENTADA (Não será executada)
              ==================================================
            
            // 1. Procura na base de dados APENAS os servidores com os slash commands ativados
            const servidoresAtivos = await Guild.find({
                slashCommandsAtivos: true,
            });

            console.log(
                `[Deploy] A preparar para atualizar ${commandsJson.length} comandos em ${servidoresAtivos.length} servidor(es)...`,
            );

            // 2. Faz um loop por cada servidor autorizado e regista os comandos
            for (const servidor of servidoresAtivos) {
                try {
                    await rest.put(
                        Routes.applicationGuildCommands(
                            process.env.CLIENT_ID,
                            servidor.guildId,
                        ),
                        { body: commandsJson },
                    );
                    console.log(
                        `[Sucesso] Comandos registados no servidor ID: ${servidor.guildId}`,
                    );
                } catch (err) {
                    // O try/catch aqui dentro impede que o bot crashe caso tenha sido expulso de um servidor
                    console.error(
                        `[Erro] Falha ao registar no servidor ID ${servidor.guildId}:`,
                        err.message,
                    );
                }
            }
            */

            // --- ALTERNATIVA SEM BANCO (Registo Global) ---
            // Se quiser registar os comandos globalmente para todos os servidores do bot:
            await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
                body: commandsJson,
            });

            console.log(
                `[Deploy Concluído] Sincronização de comandos globais terminada!`,
            );
        } catch (error) {
            console.error("[Erro no Deploy Geral]:", error);
        }
    },
};
