import oracledb from "oracledb";
import dotenv from "dotenv";

dotenv.config();

let pool: oracledb.Pool | null = null;

export async function DbConnect() {
  try {
    if (!pool) {
      pool = await oracledb.createPool({
        user: process.env.DB_USER!,
        password: process.env.DB_PASS!,
        connectString: process.env.DB_CONNECT_STRING!,
        poolMin: 1,
        poolMax: 5,
        poolIncrement: 1,
      });
      console.log("✅ OracleDB pool created");
    }
  } catch (error) {
    console.error("❌ OracleDB connection failed:", error);
  }
}

// ✅ Helper to get a connection from the pool
export async function getDBConnection(): Promise<oracledb.Connection> {
  if (!pool) {
    throw new Error("Oracle pool not initialized. Call DbConnect() first.");
  }
  return await pool.getConnection();
}
