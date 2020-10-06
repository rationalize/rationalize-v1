import { ObjectId } from "bson";

import { Link } from "mongodb-realm";

export type DetailValues = {
  description: string;
  links: Link[];
};

export type ConceptValues = {
  _id: ObjectId;
  name: string;
} & DetailValues;

export type CriterionValues = {
  _id: ObjectId;
  name: string;
} & DetailValues;

export type ScoringValue = {
  facilitator: boolean;
  survey: boolean;
};

export type EvaluationValues = {
  name: string;
  criteria: CriterionValues[];
  concepts: ConceptValues[];
  scoring: ScoringValue;
} & DetailValues;
