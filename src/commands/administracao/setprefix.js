import {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
    MessageFlags,
} from "discord.js";
import GuildModel from "../../database/models/GuildModel.js";

export default {
    // Configuração do Slash Command (Estrutura enviada para a API do Discord)
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

    // Configurações do comando por prefixo (Nome principal, aliases, descrição e permissão necessária)
    name: "setprefix",
    aliases: ["prefixo", "changeprefix", "prefix"],
    description: "Altera o prefixo do bot neste servidor.",
    userPermissions: [PermissionFlagsBits.ManageGuild],

    // Função executada quando o comando é acionado via Slash Command (/)
    async executeSlash(interaction, client) {
        // Obtém o novo prefixo informado na opção do comando
        const novoPrefixo = interaction.options
            .getString("novo_prefixo")
            .trim();

        // Garante que o prefixo tenha no máximo 3 caracteres
        if (!novoPrefixo || novoPrefixo.length > 3) {
            return interaction.reply({
                content: "O novo prefixo deve ter entre 1 e 3 caracteres.",
                flags: MessageFlags.Ephemeral,
            });
        }

        // Obtém o ID do servidor onde o comando foi executado
        const guildId = interaction.guild.id;

        // Busca ou cria a configuração do servidor no MongoDB usando o campo guildID
        let guildData = await GuildModel.findOne({ guildID: guildId });
        if (!guildData) {
            guildData = new GuildModel({
                guildID: guildId,
                prefix: novoPrefixo,
            });
        } else {
            guildData.prefix = novoPrefixo;
        }
        await guildData.save();

        // Cria o embed visual informando que o prefixo foi atualizado
        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("⚙️ Prefixo Atualizado!")
            .setDescription(
                `O prefixo deste servidor foi alterado para: \`${novoPrefixo}\`\n\nAgora você pode usar \`${novoPrefixo}help\` para ver os comandos.`,
            )
            .setTimestamp();

        // Responde à interação com o embed de confirmação
        await interaction.reply({ embeds: [embed] });
    },

    // Função executada quando o comando é acionado via Prefixo (ex: !setprefix)
    async executePrefix(message, args, client) {
        // Obtém o novo prefixo a partir do primeiro argumento digitado
        const novoPrefixo = args[0];

        // Valida se o usuário informou algum prefixo
        if (!novoPrefixo) {
            return message.reply("Por favor, informe o novo prefixo.");
        }

        // Verifica se o novo prefixo não ultrapassa 3 caracteres
        if (novoPrefixo.length > 3) {
            return message.reply(
                "O novo prefixo não pode ter mais de 3 caracteres.",
            );
        }

        // Obtém o ID do servidor onde a mensagem foi enviada
        const guildId = message.guild.id;

        // Busca ou cria a configuração do servidor no MongoDB usando o campo guildID
        let guildData = await GuildModel.findOne({ guildID: guildId });
        if (!guildData) {
            guildData = new GuildModel({
                guildID: guildId,
                prefix: novoPrefixo,
            });
        } else {
            guildData.prefix = novoPrefixo;
        }
        await guildData.save();

        // Cria o embed visual informando que o prefixo foi atualizado
        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("⚙️ Prefixo Atualizado!")
            .setDescription(
                `O prefixo deste servidor foi alterado para: \`${novoPrefixo}\`\n\nAgora você pode usar \`${novoPrefixo}help\` para ver os comandos.`,
            )
            .setTimestamp();

        // Responde à mensagem com o embed de confirmação
        await message.reply({ embeds: [embed] });
    },
};
