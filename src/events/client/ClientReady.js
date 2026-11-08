const { Events, REST, Routes, ActivityType } = require("discord.js");
const { token, client_id, guild_id } = require("../../configs/config.json");

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
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

        // Coleta os Slash Commands carregados
        if (client.slashCommands) {
            client.slashCommands.forEach((cmd) => {
                if (cmd.data) {
                    commandsJson.push(cmd.data.toJSON());
                }
            });
        }

        const rest = new REST().setToken(token);

        try {
            console.log(
                `[Deploy] Atualizando ${commandsJson.length} comandos slash na guilda...`,
            );

            // Registra os comandos na guild configurada
            await rest.put(
                Routes.applicationGuildCommands(client_id, guild_id),
                { body: commandsJson },
            );

            console.log(
                `[Sucesso] Comandos slash registrados com sucesso no servidor!`,
            );
        } catch (error) {
            console.error("[Erro no Deploy]:", error);
        }
    },
};
