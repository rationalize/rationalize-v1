import { withTransaction, getDb } from "../utils";

export async function up() {
  await withTransaction(async (collection) => {
    const evaluations = collection("Evaluations");
    await evaluations.updateMany(
      { links: { $exists: false } },
      { $set: { links: [] } }
    );
  });
}

export async function down() {
  await withTransaction(async (collection) => {
    const evaluations = collection("Evaluations");
    await evaluations.updateMany(
      { links: { $exists: true } },
      { $unset: "links" }
    );
  });
}
