import React from "react";
import { Button, Label, Input, FormGroup, Form, CardBody } from "reactstrap";
import { Formik } from "formik";

import { SectionCard } from "components/SectionCard";
import { Details } from "components/Details";
import { CriterionIcon } from "icons/CriterionIcon";
import { ConceptIcon } from "icons/ConceptIcon";
import { Concept, Criterion } from "mongodb-realm";

import styles from "./CriterionSection.module.scss";

type CriterionCardProps = {
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
      <SectionCard className={styles.CriterionSection__Criterion}>
        <SectionCard.Header
          className={styles.CriterionSection__CriterionHeader}
        >
          <CriterionIcon />
          {criterion.name}
        </SectionCard.Header>
        {criterion.description || criterion.links.length > 0 ? (
          <CardBody className={styles.CriterionSection__CriterionDetails}>
            <Details
              description={criterion.description}
              links={criterion.links}
            />
          </CardBody>
        ) : null}
      </SectionCard>
      <Formik<Values>
        initialValues={{ scores: initialScores }}
        onSubmit={handleSubmit}
        key={index}
      >
        {({ handleSubmit, values, handleChange, handleBlur }) => (
          <Form onSubmit={handleSubmit}>
            {concepts.map((concept, index) => (
              <SectionCard
                className={styles.CriterionSection__Concept}
                key={index}
              >
                <SectionCard.Header
                  className={styles.CriterionSection__ConceptHeader}
                >
                  <ConceptIcon />
                  <Label
                    className={styles.CriterionSection__ConceptLabel}
                    for={`scores.${index}`}
                  >
                    {concept.name}
                  </Label>
                </SectionCard.Header>
                <CardBody className={styles.CriterionSection__ConceptDetails}>
                  <FormGroup key={index}>
                    <Details
                      description={concept.description}
                      links={concept.links}
                    />
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
                </CardBody>
              </SectionCard>
            ))}
            <SectionCard>
              <CardBody>
                <section className={styles.CriterionSection__Controls}>
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
              </CardBody>
            </SectionCard>
          </Form>
        )}
      </Formik>
    </>
  );
}
