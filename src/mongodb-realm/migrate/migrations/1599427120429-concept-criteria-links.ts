import { withTransaction } from "../utils";

export async function up() {
  await withTransaction(async (collection) => {
    const evaluations = collection("Evaluations");
    await evaluations.updateMany(
      { concepts: { $elemMatch: { links: { $exists: false } } } },
      { $set: { "concepts.$[].links": [] } }
    );
    await evaluations.updateMany(
      { criteria: { $elemMatch: { links: { $exists: false } } } },
      { $set: { "criteria.$[].links": [] } }
    );
  });
}

export async function down() {
  await withTransaction(async (collection) => {
    const evaluations = collection("Evaluations");
    await evaluations.updateMany(
      { concepts: { $elemMatch: { links: { $exists: true } } } },
      { $unset: "concepts.$[].links" }
    );
    await evaluations.updateMany(
      { criteria: { $elemMatch: { links: { $exists: true } } } },
      { $unset: "criteria.$[].links" }
    );
  });
}
