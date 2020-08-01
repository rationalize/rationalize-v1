import { flattenScores, unflattenScores } from "./Evaluations";

test("flattens 2x2 criteria and concepts", () => {
  const criteria = [{ name: "Criterion 1" }, { name: "Criterion 2" }];
  const concepts = [{ name: "Concept 1" }, { name: "Concept 2" }];
  const result = flattenScores(
    [
      [1, 2],
      [3, 4],
    ],
    criteria,
    concepts
  );
  expect(result).toEqual([
    { criterion: "Criterion 1", alternative: "Concept 1", value: 1 },
    { criterion: "Criterion 1", alternative: "Concept 2", value: 2 },
    { criterion: "Criterion 2", alternative: "Concept 1", value: 3 },
    { criterion: "Criterion 2", alternative: "Concept 2", value: 4 },
  ]);
});

test("unflattens 2x2 criteria and concepts", () => {
  const criteria = [{ name: "Criterion 1" }, { name: "Criterion 2" }];
  const concepts = [{ name: "Concept 1" }, { name: "Concept 2" }];
  const result = unflattenScores(
    [
      { criterion: "Criterion 1", alternative: "Concept 1", value: 1 },
      { criterion: "Criterion 1", alternative: "Concept 2", value: 2 },
      { criterion: "Criterion 2", alternative: "Concept 1", value: 3 },
      { criterion: "Criterion 2", alternative: "Concept 2", value: 4 },
    ],
    criteria,
    concepts
  );
  expect(result).toEqual([
    [1, 2],
    [3, 4],
  ]);
});
