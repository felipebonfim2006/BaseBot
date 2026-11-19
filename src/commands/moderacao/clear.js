import {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
} from "discord.js";

export default {
    // Configuração do Slash Command (Estrutura enviada para a API do Discord)
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Apaga uma quantidade específica de mensagens no chat.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption((option) =>
            option
                .setName("quantidade")
                .setDescription("Número de mensagens para apagar (1 a 100)")
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100),
        ),

    // Configurações do comando por prefixo (Nome principal, aliases, descrição e permissão necessária)
    name: "clear",
    aliases: ["limpar", "c"],
    description: "Apaga mensagens do chat rapidamente.",
    userPermissions: [PermissionFlagsBits.ManageMessages],

    // Função executada quando o comando é acionado via Slash Command (/)
    async executeSlash(interaction, client) {
        // Pega a quantidade de mensagens informada pelo usuário
        const quantidade = interaction.options.getInteger("quantidade");

        // Executa a limpeza no canal (o 'true' ignora mensagens com mais de 14 dias para evitar erros na API do Discord)
        await interaction.channel.bulkDelete(quantidade, true);

        // Cria o embed visual informando que a limpeza foi concluída
        const clearEmbed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle(`Limpeza Concluída! 🧹`)
            .setDescription(
                `**${quantidade}** mensagens foram apagadas neste canal.`,
            )
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();

        // Responde de forma efêmera (apenas o usuário vê) para manter o chat limpo
        await interaction.reply({ embeds: [clearEmbed], ephemeral: true });
    },

    // Função executada quando o comando é acionado via Prefixo (ex: !clear)
    async executePrefix(message, args, client) {
        // Verifica se o argumento informado é um número válido entre 1 e 100
        const quantidade = parseInt(args[0], 10);
        if (isNaN(quantidade) || quantidade < 1 || quantidade > 100) {
            return message.reply(
                "Por favor, forneça um número válido entre 1 e 100.",
            );
        }

        // Apaga o comando original enviado pelo usuário para não atrapalhar a contagem do chat
        await message.delete().catch(() => {});

        // Executa a limpeza das mensagens no canal
        await message.channel.bulkDelete(quantidade, true);

        // Cria o embed visual informando que a limpeza foi concluída
        const clearEmbed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle(`Limpeza Concluída! 🧹`)
            .setDescription(
                `**${quantidade}** mensagens foram apagadas neste canal.`,
            )
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();

        // Envia a mensagem de confirmação e a apaga automaticamente após 5 segundos
        const msg = await message.channel.send({ embeds: [clearEmbed] });
        setTimeout(() => {
            msg.delete().catch(() => {});
        }, 5000);
    },
};
