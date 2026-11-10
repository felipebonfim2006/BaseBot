const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const Guild = require("../../database/models/Guild");

module.exports = {
    // --- SLASH COMMAND ---
    data: new SlashCommandBuilder()
        .setName("setprefix")
        .setDescription("Altera o prefixo do bot neste servidor.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption((option) =>
            option
                .setName("novo_prefixo")
                .setDescription(
                    "O novo prefixo a ser usado (máx. 5 caracteres).",
                )
                .setRequired(true)
                .setMaxLength(5),
        ),

    // --- COMANDO POR PREFIXO ---
    name: "setprefix",
    aliases: ["prefixo", "changeprefix"],
    description: "Altera o prefixo do bot neste servidor.",
    userPermissions: [PermissionFlagsBits.ManageGuild],

    async executeSlash(interaction, client) {
        const novoPrefixo = interaction.options.getString("novo_prefixo");
        const guildId = interaction.guild.id;

        // Procura o servidor na base de dados
        let guildProfile = await Guild.findOne({ guildId: guildId });

        if (!guildProfile) {
            guildProfile = new Guild({ guildId: guildId, prefix: novoPrefixo });
        } else {
            guildProfile.prefix = novoPrefixo;
        }

        await guildProfile.save();

        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("⚙️ Prefixo Atualizado!")
            .setDescription(
                `O prefixo deste servidor foi alterado para: \`${novoPrefixo}\`\n\nAgora podes usar \`${novoPrefixo}help\` para ver os comandos.`,
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },

    async executePrefix(message, args, client) {
        const novoPrefixo = args[0];
        const guildId = message.guild.id;

        if (!novoPrefixo) {
            return message.reply(
                "❌ Por favor, fornece o novo prefixo! Exemplo: `!setprefix ?`",
            );
        }

        if (novoPrefixo.length > 5) {
            return message.reply(
                "❌ O prefixo não pode ter mais de 5 caracteres.",
            );
        }

        // Procura o servidor na base de dados
        let guildProfile = await Guild.findOne({ guildId: guildId });

        if (!guildProfile) {
            guildProfile = new Guild({ guildId: guildId, prefix: novoPrefixo });
        } else {
            guildProfile.prefix = novoPrefixo;
        }

        await guildProfile.save();

        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("⚙️ Prefixo Atualizado!")
            .setDescription(
                `O prefixo deste servidor foi alterado para: \`${novoPrefixo}\`\n\nAgora podes usar \`${novoPrefixo}help\` para ver os comandos.`,
            )
            .setTimestamp();

        await message.channel.send({ embeds: [embed] });
    },
};
