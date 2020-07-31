import { withTransaction } from "../utils";

export async function up() {
  await withTransaction(async (collection) => {
    const events = collection("Events");
    await events.updateMany({}, { $rename: { evaluations: "scores" } });
  });
}

export async function down() {
  await withTransaction(async (collection) => {
    const events = collection("Events");
    await events.updateMany({}, { $rename: { scores: "evaluations" } });
  });
}
