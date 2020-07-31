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

import { Alternative, Criterion } from "../../../mongodb";

import styles from "./CriterionSection.module.scss";

type CriterionCardProps = {
  className?: string;
  index: number;
  count: number;
  criterion: Criterion;
  alternatives: Alternative[];
  onScores: (scores: number[]) => void;
  onBack: () => void;
};

type Values = {
  scores: number[];
};

export function CriterionSection({
  className,
  index,
  count,
  criterion,
  alternatives,
  onScores,
  onBack,
}: CriterionCardProps) {
  function handleSubmit({ scores }: Values) {
    return onScores(scores);
  }

  function handleBackClick() {
    onBack();
  }

  const isLast = index === count - 1;

  return (
    <Card className={className} body>
      <CardTitle className={styles.CriterionCard__Title}>
        <h3>{criterion.name}</h3>
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
            <section className={styles.CriterionCard__Controls}>
              <Button
                color="primary"
                onClick={handleBackClick}
                disabled={index === 0}
                outline
              >
                Back
              </Button>
              <Button type="submit" color="primary">
                {isLast ? "Save scores" : "Next criterion"}
              </Button>
            </section>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
