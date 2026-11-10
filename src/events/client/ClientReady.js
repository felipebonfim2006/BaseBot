const { Events, REST, Routes, ActivityType } = require("discord.js");
const { token, client_id } = require("../../configs/config.json"); // Removemos o guild_id daqui
const Guild = require("../../database/models/Guild"); // Importa o modelo do Servidor

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        // Configura o status do bot
        client.user.setPresence({
            activities: [
                {
                    name: "Seus atos questionáveis",
                    type: ActivityType.Watching,
                },
            ],
            status: "idle",
        });
        console.log(`Ready! Logged in as ${client.user.tag}`);

        const commandsJson = [];

        // Coleta os Slash Commands carregados da memória
        if (client.slashCommands) {
            client.slashCommands.forEach((cmd) => {
                if (cmd.data) {
                    commandsJson.push(cmd.data.toJSON());
                }
            });
        }

        const rest = new REST().setToken(token);

        try {
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
                            client_id,
                            servidor.guildId,
                        ),
                        { body: commandsJson },
                    );
                    console.log(
                        `✅ [Sucesso] Comandos registados no servidor ID: ${servidor.guildId}`,
                    );
                } catch (err) {
                    // O try/catch aqui dentro impede que o bot crashe caso tenha sido expulso de um servidor
                    console.error(
                        `❌ [Erro] Falha ao registar no servidor ID ${servidor.guildId}:`,
                        err.message,
                    );
                }
            }

            console.log(
                `🚀 [Deploy Concluído] Sincronização de comandos terminada!`,
            );
        } catch (error) {
            console.error("❌ [Erro no Deploy Geral]:", error);
        }
    },
};
