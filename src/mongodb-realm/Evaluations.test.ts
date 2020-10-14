import {
  flattenScores,
  summarizeScores,
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

describe("summarizeScores", () => {
  const scores = [
    // First participant
    {
      participant: "Alice",
      criterion: "Criterion 1",
      concept: "Concept 1",
      value: 1,
    },
    {
      participant: "Alice",
      criterion: "Criterion 1",
      concept: "Concept 2",
      value: 2,
    },
    {
      participant: "Alice",
      criterion: "Criterion 2",
      concept: "Concept 1",
      value: 3,
    },
    {
      participant: "Alice",
      criterion: "Criterion 2",
      concept: "Concept 2",
      value: 4,
    },
    // Second participant
    {
      participant: "Bob",
      criterion: "Criterion 1",
      concept: "Concept 1",
      value: 5,
    },
    {
      participant: "Bob",
      criterion: "Criterion 1",
      concept: "Concept 2",
      value: 6,
    },
    {
      participant: "Bob",
      criterion: "Criterion 2",
      concept: "Concept 1",
      value: 7,
    },
    {
      participant: "Bob",
      criterion: "Criterion 2",
      concept: "Concept 2",
      value: 8,
    },
  ];

  const weights = {
    "Criterion 1": 0.1,
    "Criterion 2": 0.2,
  };

  it("summarize without a filtering", () => {
    const result = summarizeScores(scores, weights);
    expect(result.sum).toEqual(1 + 2 + 3 + 4 + 5 + 6 + 7 + 8);
    expect(result.average).toEqual((1 + 2 + 3 + 4 + 5 + 6 + 7 + 8) / 8);
    expect(result.weightedSum).toEqual(
      (1 + 2 + 5 + 6) * 0.1 + (3 + 4 + 7 + 8) * 0.2
    );
    expect(result.weightedAverage).toEqual(
      ((1 + 2 + 5 + 6) * 0.1 + (3 + 4 + 7 + 8) * 0.2) / 8
    );
    expect(result.scores.length).toEqual(8);
    expect(result.standardDiviation).toBeCloseTo(2.2912878474779);
  });

  it("summarize a single concept", () => {
    const result = summarizeScores(scores, weights, { concept: "Concept 1" });
    expect(result.sum).toEqual(1 + 3 + 5 + 7);
    expect(result.average).toEqual((1 + 3 + 5 + 7) / 4);
    expect(result.weightedSum).toBeCloseTo((1 + 5) * 0.1 + (3 + 7) * 0.2);
    expect(result.weightedAverage).toBeCloseTo(
      ((1 + 5) * 0.1 + (3 + 7) * 0.2) / 4
    );
    expect(result.scores.length).toEqual(4);
    expect(result.standardDiviation).toBeCloseTo(2.2360679774998);
  });

  it("summarize a single criterion", () => {
    const result = summarizeScores(scores, weights, {
      criterion: "Criterion 1",
    });
    expect(result.sum).toEqual(1 + 2 + 5 + 6);
    expect(result.average).toEqual((1 + 2 + 5 + 6) / 4);
    expect(result.weightedSum).toBeCloseTo((1 + 2 + 5 + 6) * 0.1);
    expect(result.weightedAverage).toBeCloseTo(((1 + 2 + 5 + 6) * 0.1) / 4);
    expect(result.scores.length).toEqual(4);
    expect(result.standardDiviation).toBeCloseTo(2.0615528128088);
  });

  it("filter to a single score", () => {
    const result = summarizeScores(scores, weights, {
      criterion: "Criterion 1",
      concept: "Concept 1",
      participant: "Alice",
    });
    expect(result).toEqual({
      scores: [
        {
          criterion: "Criterion 1",
          concept: "Concept 1",
          participant: "Alice",
          value: 1,
        },
      ],
      sum: 1,
      average: 1,
      weightedSum: 1 * 0.1,
      weightedAverage: 1 * 0.1,
      standardDiviation: 0,
    });
  });
});
