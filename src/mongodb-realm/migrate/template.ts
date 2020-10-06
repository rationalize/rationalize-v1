import { withTransaction } from "../utils";

export async function up() {
  await withTransaction(async (collection) => {
    throw new Error("Not yet implemented");
  });
}

export async function down() {
  await withTransaction(async (collection) => {
    throw new Error("Not yet implemented");
  });
}
