import { ObjectId } from "bson";

type EvaluationFocus = {
  kind: "evaluation";
};

type ConceptFocus = {
  kind: "concept";
  _id: ObjectId;
};

type CriterionFocus = {
  kind: "criterion";
  _id: ObjectId;
};

export type Focus = EvaluationFocus | ConceptFocus | CriterionFocus;
