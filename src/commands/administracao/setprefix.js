import {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
} from "discord.js";
import GuildModel from "../../database/models/GuildModel.js";

export default {
    data: new SlashCommandBuilder()
        .setName("setprefix")
        .setDescription("Altere o prefixo do bot neste servidor.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption((option) =>
            option
                .setName("novo_prefixo")
                .setDescription(
                    "O novo prefixo a ser usado (máx. 3 caracteres)",
                )
                .setRequired(true)
                .setMaxLength(3),
        ),

    name: "setprefix",
    aliases: ["prefixo", "changeprefix", "prefix"],
    description: "Altera o prefixo do bot neste servidor.",
    userPermissions: [PermissionFlagsBits.ManageGuild],

    async executeSlash(interaction, client) {
        // Obtenha o novo prefixo do comando
        const novoPrefixo = interaction.options.getString("novo_prefixo");

        // Obtenha o ID do servidor
        const guildId = interaction.guild.id;

        // Lógica para alterar o prefixo
        const guildData = await GuildModel.findOne({ id: guildId });
        if (!guildData) {
            // Se não houver dados do servidor, crie um novo documento
            const newGuildData = new GuildModel({
                guildID: guildId,
                prefix: novoPrefixo,
            });
            await newGuildData.save();
        } else {
            // Se já houver dados do servidor, atualize o prefixo
            guildData.prefix = novoPrefixo;
            await guildData.save();
        }

        // Crie um embed para informar que o prefixo foi alterado com sucesso
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
        // Obtenha o novo prefixo do comando
        const novoPrefixo = args[0];

        // Valide o novo prefixo
        if (!novoPrefixo) {
            return message.reply("Por favor, informe o novo prefixo.");
        }

        // Verifique se o novo prefixo tem no máximo 3 caracteres
        if (novoPrefixo.length > 3) {
            return message.reply("O novo prefixo não pode ter mais de 3 caracteres.");
        }

        // Obtenha o ID do servidor
        const guildId = message.guild.id;

        // Lógica para alterar o prefixo
        const guildData = await GuildModel.findOne({ guildID: guildId });
        if (!guildData) {
            // Se não houver dados do servidor, crie um novo documento
            const newGuildData = new GuildModel({
                guildID: guildId,
                prefix: novoPrefixo,
            });
            await newGuildData.save();
        } else {
            // Se já houver dados do servidor, atualize o prefixo
            guildData.prefix = novoPrefixo;
            await guildData.save();
        }
        // Crie um embed para informar que o prefixo foi alterado com sucesso
        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("⚙️ Prefixo Atualizado!")
            .setDescription(
                `O prefixo deste servidor foi alterado para: \`${novoPrefixo}\`\n\nAgora podes usar \`${novoPrefixo}help\` para ver os comandos.`,
            )
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    }
};
