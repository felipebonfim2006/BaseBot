import { Events } from "discord.js";

export default {
    // Define o evento a ser escutado (Nova interação criada, como um Slash Command)
    name: Events.InteractionCreate,

    // Função executada sempre que o evento é disparado
    async execute(interaction, client) {
        // Verifica se a interação é estritamente um comando de barra (Chat Input Command)
        if (!interaction.isChatInputCommand()) return;

        // Procura o comando correspondente na collection de slash commands do client
        const comando = client.slashCommands.get(interaction.commandName);

        // Se o comando não for encontrado na memória, regista um erro no console e encerra
        if (!comando) {
            console.error(
                `Comando /${interaction.commandName} não foi encontrado.`,
            );
            return;
        }

        // Verifica se o utilizador possui as permissões necessárias para usar o comando
        if (comando.userPermissions && comando.userPermissions.length > 0) {
            if (!interaction.member.permissions.has(comando.userPermissions)) {
                return interaction.reply({
                    content:
                        "Você não tem permissão para utilizar este comando.",
                    ephemeral: true, // Mensagem visível apenas para quem tentou usar
                });
            }
        }

        try {
            // Executa a função do slash command correspondente
            await comando.executeSlash(interaction, client);
        } catch (error) {
            console.error(
                `Erro ao executar o comando ${interaction.commandName}:`,
                error,
            );

            // Evita o erro de responder duas vezes à mesma interação caso já tenha enviado algo
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
