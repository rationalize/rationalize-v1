import {
  flattenScores,
  unflattenScores,
  weightedScoredConcepts,
} from "./Evaluations";

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
    { criterion: "Criterion 1", concept: "Concept 1", value: 1 },
    { criterion: "Criterion 1", concept: "Concept 2", value: 2 },
    { criterion: "Criterion 2", concept: "Concept 1", value: 3 },
    { criterion: "Criterion 2", concept: "Concept 2", value: 4 },
  ]);
});

test("unflattens 2x2 criteria and concepts", () => {
  const criteria = [{ name: "Criterion 1" }, { name: "Criterion 2" }];
  const concepts = [{ name: "Concept 1" }, { name: "Concept 2" }];
  const result = unflattenScores(
    [
      { criterion: "Criterion 1", concept: "Concept 1", value: 1 },
      { criterion: "Criterion 1", concept: "Concept 2", value: 2 },
      { criterion: "Criterion 2", concept: "Concept 1", value: 3 },
      { criterion: "Criterion 2", concept: "Concept 2", value: 4 },
    ],
    criteria,
    concepts
  );
  expect(result).toEqual([
    [1, 2],
    [3, 4],
  ]);
});

test("weighted scored concepts", () => {
  const concepts = [{ name: "Concept 1" }, { name: "Concept 2" }];
  const flatScores = [
    // First user
    { criterion: "Criterion 1", concept: "Concept 1", value: 1 },
    { criterion: "Criterion 1", concept: "Concept 2", value: 2 },
    { criterion: "Criterion 2", concept: "Concept 1", value: 3 },
    { criterion: "Criterion 2", concept: "Concept 2", value: 4 },
    // Second user
    { criterion: "Criterion 1", concept: "Concept 1", value: 5 },
    { criterion: "Criterion 1", concept: "Concept 2", value: 6 },
    { criterion: "Criterion 2", concept: "Concept 1", value: 7 },
    { criterion: "Criterion 2", concept: "Concept 2", value: 8 },
  ];
  const weights = {
    "Criterion 1": 0.1,
    "Criterion 2": 0.2,
  };
  const result = weightedScoredConcepts(concepts, flatScores, weights);
  expect(result).toEqual([
    {
      name: "Concept 2",
      score: {
        total: 0.1 * 2 + 0.2 * 4 + 0.1 * 6 + 0.2 * 8,
        average: (0.1 * 2 + 0.2 * 4 + 0.1 * 6 + 0.2 * 8) / 4,
      },
    },
    {
      name: "Concept 1",
      score: {
        total: 0.1 * 1 + 0.2 * 3 + 0.1 * 5 + 0.2 * 7,
        average: (0.1 * 1 + 0.2 * 3 + 0.1 * 5 + 0.2 * 7) / 4,
      },
    },
  ]);
});
