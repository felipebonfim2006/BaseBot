const { Events, REST, Routes, ActivityType } = require("discord.js");
const { token, client_id, guild_id } = require("../../configs/config.json"); // Ajuste o caminho do config se precisar

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        client.user.setPresence({
            activities: [
                {
                    name: "Seus atos questionáveis", // O texto que aparece no perfil
                    type: ActivityType.Watching, // Tipo de atividade (Playing, Streaming, Listening, Watching, Competing)
                },
            ],
            status: "idle", // O estado (online, idle, dnd, invisible)
        });
        console.log(`Ready! Logged in as ${client.user.tag}`);

        const commandsJson = [];

        // Pega todos os comandos slash que o seu commandHandler salvou no client
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

            // Envia para o Discord de forma instantânea para a sua guilda
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
