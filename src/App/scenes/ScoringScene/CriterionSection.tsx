import React from "react";
import { Button, Label, Input, FormGroup, Form, CardBody } from "reactstrap";
import { Formik } from "formik";

import { Concept, Criterion } from "../../../mongodb";
import { SectionCard } from "../../SectionCard";
import { DetailsCardBody } from "../../DetailsCardBody";

import styles from "./CriterionSection.module.scss";

type CriterionCardProps = {
  className?: string;
  index: number;
  count: number;
  criterion: Criterion;
  concepts: Concept[];
  scores: number[][];
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
  concepts,
  scores,
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
  const initialScores = scores[index] || concepts.map((a) => 0.5);

  return (
    <>
      <SectionCard.Header>{criterion.name}</SectionCard.Header>
      <DetailsCardBody
        description={criterion.description}
        links={criterion.links}
      />
      <CardBody>
        <Formik<Values>
          initialValues={{ scores: initialScores }}
          onSubmit={handleSubmit}
          key={index}
        >
          {({ handleSubmit, values, handleChange, handleBlur }) => (
            <Form onSubmit={handleSubmit}>
              {concepts.map((concept, index) => (
                <FormGroup key={index}>
                  <Label for={`scores.${index}`}>{concept.name}</Label>
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
      </CardBody>
    </>
  );
}
