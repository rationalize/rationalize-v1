import React from "react";
import {
  Button,
  Card,
  CardTitle,
  CardSubtitle,
  Label,
  Input,
  FormGroup,
  Form,
} from "reactstrap";
import { Formik } from "formik";

import { Alternative, Criterion } from "../../../RealmApp";

import styles from "./CriterionCard.module.scss";

type CriterionCardProps = {
  index: number;
  count: number;
  criterion: Criterion;
  alternatives: Alternative[];
  onScores: (scores: number[]) => void;
};

type Values = {
  scores: number[];
};

export function CriterionCard({
  index,
  count,
  criterion,
  alternatives,
  onScores,
}: CriterionCardProps) {
  function handleSubmit({ scores }: Values) {
    return onScores(scores);
  }

  return (
    <Card body>
      <CardSubtitle className={styles.CriterionCard__Subtitle}>
        Criterion {index + 1} of {count}
      </CardSubtitle>
      <CardTitle className={styles.CriterionCard__Title}>
        <h2>{criterion.name}</h2>
      </CardTitle>
      <Formik<Values>
        initialValues={{ scores: alternatives.map((a) => 5) }}
        onSubmit={handleSubmit}
        key={index}
      >
        {({ handleSubmit, values, handleChange, handleBlur }) => (
          <Form onSubmit={handleSubmit}>
            {alternatives.map((alternative, index) => (
              <FormGroup key={index}>
                <Label for={`scores.${index}`}>{alternative.name}</Label>
                <Input
                  type="range"
                  name={`scores.${index}`}
                  id={`scores.${index}`}
                  value={values.scores[index]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  step="1"
                  min="0"
                  max="10"
                />
              </FormGroup>
            ))}
            <Button type="submit" color="primary" block>
              Next criterion
            </Button>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
