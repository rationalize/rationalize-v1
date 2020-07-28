import { getDb } from "../utils";

export async function up() {
  const db = await getDb();
  await db.createCollection("Migrations");
}

export async function down() {
  const db = await getDb();
  await db.dropCollection("Migrations");
}
