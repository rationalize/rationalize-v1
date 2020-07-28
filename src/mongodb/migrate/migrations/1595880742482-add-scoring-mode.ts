import { withTransaction } from "../utils";

export async function up() {
  await withTransaction(async (collection) => {
    const events = collection("Events");
    await events.updateMany(
      {},
      { $set: { scoring: { individual: true, survey: false } } }
    );
  });
}

export async function down() {
  await withTransaction(async (collection) => {
    const events = collection("Events");
    await events.updateMany({}, { $unset: { scoring: "" } });
  });
}
