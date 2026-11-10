const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const User = require("../../database/models/User");

module.exports = {
    // Slash Command
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Apaga uma quantidade específica de mensagens no chat.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption((option) =>
            option
                .setName("quantidade")
                .setDescription("Número de mensagens a apagar (1 a 100)")
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100),
        ),

    // Comando por prefixo
    name: "clear",
    aliases: ["limpar", "c"],
    description: "Apaga mensagens do chat rapidamente.",
    userPermissions: [PermissionFlagsBits.ManageMessages],

    async executeSlash(interaction, client) {
        const discordId = interaction.user.id;
        const quantidade = interaction.options.getInteger("quantidade");

        // Executa a limpeza no canal (o 'true' ignora mensagens com mais de 14 dias para evitar erros na API do Discord)
        await interaction.channel.bulkDelete(quantidade, true);

        // Cria o perfil ou incrementa o contador de limpezas
        let userProfile = await User.findOne({ userId: discordId });

        if (!userProfile) {
            userProfile = new User({ userId: discordId, clears: 1 });
        } else {
            userProfile.clears += 1; // Certifique-se de adicionar 'clears' ao seu model do Mongoose
        }

        await userProfile.save();

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
            .setFooter({
                text: `Já usaste este comando ${userProfile.clears} vez(es)!`,
            })
            .setTimestamp();

        // Responde de forma efémera (apenas o utilizador vê) para manter o chat limpo
        await interaction.reply({ embeds: [clearEmbed], ephemeral: true });
    },

    async executePrefix(message, args, client) {
        const discordId = message.author.id;

        // Verifica se o argumento é um número válido
        const quantidade = parseInt(args[0], 10);
        if (isNaN(quantidade) || quantidade < 1 || quantidade > 100) {
            return message.reply(
                "Por favor, fornece um número válido entre 1 e 100.",
            );
        }

        // Apaga o comando original do utilizador (!clear 10) para não atrapalhar a contagem
        await message.delete().catch(() => {});

        // Executa a limpeza
        await message.channel.bulkDelete(quantidade, true);

        // Cria o perfil ou incrementa o contador de limpezas
        let userProfile = await User.findOne({ userId: discordId });

        if (!userProfile) {
            userProfile = new User({ userId: discordId, clears: 1 });
        } else {
            userProfile.clears += 1;
        }

        await userProfile.save();

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
            .setFooter({
                text: `Já usaste este comando ${userProfile.clears} vez(es)!`,
            })
            .setTimestamp();

        // Envia a mensagem e apaga a mesma após 5 segundos para manter o chat realmente limpo
        const msg = await message.channel.send({ embeds: [clearEmbed] });
        setTimeout(() => {
            msg.delete().catch(() => {});
        }, 5000);
    },
};
