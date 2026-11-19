import { Schema, model } from "mongoose";
import "dotenv/config";

const guildSchema = new Schema({
    guildID: { type: String, required: true, unique: true },
    prefix: { type: String, default: process.env.PREFIX }, // Define o prefixo padrão por segurança
    slashCommandsActive: { type: Boolean, default: false },
});

export default model("Guild", guildSchema);
