import { EvaluationCard } from "../../EvaluationCard";

type EvaluationFocus = {
  kind: "evaluation";
};

type ConceptFocus = {
  kind: "concept";
  index: number;
};

type CriterionFocus = {
  kind: "criterion";
  index: number;
};

export type Focus = EvaluationFocus | ConceptFocus | CriterionFocus;
