const { Events } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const comando = client.slashCommands.get(interaction.commandName);
        if (!comando) {
            console.error(
                `Comando /${interaction.commandName} não foi encontrado.`,
            );
            return;
        }

        try {
            await comando.executeSlash(interaction, client);
        } catch (error) {
            console.error(
                `Erro ao executar o comando ${interaction.commandName}:`,
                error,
            );

            // Evita responder duas vezes à mesma interação
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: "Houve um erro ao executar este comando!",
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content: "Erro ao executar o comando slash!",
                    ephemeral: true,
                });
            }
        }
    },
};
