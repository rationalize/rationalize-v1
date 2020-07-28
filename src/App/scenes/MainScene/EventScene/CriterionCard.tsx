import React from "react";
import {
  Button,
  Card,
  CardTitle,
  Label,
  Input,
  FormGroup,
  Form,
} from "reactstrap";
import { Formik } from "formik";

import { Alternative, Criterion } from "../../../../mongodb";

import styles from "./CriterionCard.module.scss";
import { Send } from "react-feather";

type CriterionCardProps = {
  className?: string;
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
  className,
  index,
  count,
  criterion,
  alternatives,
  onScores,
}: CriterionCardProps) {
  function handleSubmit({ scores }: Values) {
    return onScores(scores);
  }

  const isLast = index === count - 1;

  return (
    <Card className={className} body>
      <CardTitle className={styles.CriterionCard__Title}>
        <h2>{criterion.name}</h2>
      </CardTitle>
      <Formik<Values>
        initialValues={{ scores: alternatives.map((a) => 0.5) }}
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
                  step={0.1}
                  min={0}
                  max={1}
                />
              </FormGroup>
            ))}
            <Button type="submit" color="primary" block>
              {isLast ? (
                <>
                  <Send /> Send
                </>
              ) : (
                `Next criterion (${index + 2} of ${count})`
              )}
            </Button>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
