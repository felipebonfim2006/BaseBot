import { connect } from "mongoose";
import "dotenv/config";

async function connectDB() {
    // try/catch para tentar conectar ao Banco de dados
    try {
        // Inicia a conexão
        await connect(process.env.MONGO_URI);
        console.log("[DATABASE] Conexão com MongoDB realizada com sucesso!");
    } catch (err) {
        console.error("[ERROR] Ocorreu um erro ao conectar ao MongoDB: ", err);
    }
}

export default connectDB;
