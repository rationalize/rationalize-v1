import React from "react";
import { Formik, FormikHelpers } from "formik";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

import { InputList } from "../../InputList";
import {
  app,
  evaluationsCollection,
  Scoring,
  generateSharingToken,
  Evaluation,
} from "../../../mongodb";
import { CriteriaHelp } from "./CriteriaHelp";
import { ConceptHelp } from "./ConceptHelp";
import { ScoringModeHelp } from "./ScoringModeHelp";
import { LoadingOverlay } from "../../LoadingOverlay";
import { FieldFeedback } from "../../FieldFeedback";
import { NameHelp } from "./NameHelp";

import styles from "./CreateEvaluationForm.module.scss";

export type ConceptValues = {
  name: string;
};

export type CriterionValues = {
  name: string;
};

export type ScoringValue = {
  facilitator: boolean;
  survey: boolean;
};

export type EvaluationValues = {
  name: string;
  criteria: CriterionValues[];
  concepts: ConceptValues[];
  scoring: ScoringValue;
};

export type CreateEvaluationHandler = (
  value: EvaluationValues,
  helpers: FormikHelpers<EvaluationValues>
) => void;

type CreateEvaluationFormProps = {
  handleCreated: (evaluation: Evaluation) => void;
};

type ErrorObject<Values> = { [key in keyof Values]?: string };

function validate(values: EvaluationValues) {
  const errors: ErrorObject<EvaluationValues> = {};
  const criteria = values.criteria.filter((c) => c.name);
  const concepts = values.concepts.filter((a) => a.name);
  if (values.name === "") {
    errors.name = "You must provide a name";
  }
  if (criteria.length === 0) {
    errors.criteria = "The must be at least one criterion.";
  }
  if (concepts.length === 0) {
    errors.concepts = "The must be at least one concept.";
  }
  if (!values.scoring.facilitator && !values.scoring.survey) {
    errors.scoring = "You must select at least one scoring mode.";
  }
  return errors;
}

export function CreateEvaluationForm({
  handleCreated,
}: CreateEvaluationFormProps) {
  const handleSubmit: CreateEvaluationHandler = async (values, helpers) => {
    if (app.currentUser) {
      const criteria = values.criteria.filter((c) => c.name);
      const concepts = values.concepts.filter((a) => a.name);
      if (criteria.length === 0) {
        helpers.setFieldError(
          "criteria",
          "The must be at least one criterion."
        );
      }
      if (concepts.length === 0) {
        helpers.setFieldError("concepts", "The must be at least one concept.");
      }
      const scoring: Scoring = {
        ...values.scoring,
        token: generateSharingToken(),
      };
      const evaluation: Omit<Evaluation, "_id"> = {
        facilitator: app.currentUser.id,
        participants: [],
        scores: {},
        name: values.name,
        criteria,
        concepts,
        sharing: { mode: "disabled" },
        scoring,
      };
      const { insertedId } = await evaluationsCollection.insertOne(evaluation);
      gtag("event", "create_evaluation");
      handleCreated({ ...evaluation, _id: insertedId });
    }
  };

  return (
    <Formik<EvaluationValues>
      initialValues={{
        name: "",
        concepts: [{ name: "" }],
        criteria: [{ name: "" }],
        scoring: { facilitator: true, survey: false },
      }}
      validate={validate}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        touched,
        isSubmitting,
        handleSubmit,
        handleReset,
        handleBlur,
        handleChange,
      }) => (
        <LoadingOverlay isLoading={isSubmitting}>
          <Form onSubmit={handleSubmit} onReset={handleReset}>
            <FormGroup className={styles.CreateEvaluationForm__FormGroup}>
              <Label for="name">
                <h6>
                  1. Name Evaluation <NameHelp />
                </h6>
              </Label>
              <FieldFeedback
                name="name"
                helper="Make sure it's descriptive so that you can identify it later."
              />
              <Input
                type="text"
                name="name"
                id="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={errors.name && touched.name ? true : false}
                required
                autoFocus
              />
            </FormGroup>
            <FormGroup className={styles.CreateEvaluationForm__FormGroup}>
              <Label>
                <h6>
                  2. Define Concepts <ConceptHelp />
                </h6>
              </Label>
              <FieldFeedback
                name="concepts"
                helper="These are the ideas or options you are evaluating."
              />
              <InputList
                items={values.concepts}
                itemsPath="concepts"
                propertyName="name"
                addText="Add New Concept"
                /*
              extraControls={() => (
                <Button color="success">Add more information</Button>
              )}
              */
              />
            </FormGroup>
            <FormGroup className={styles.CreateEvaluationForm__FormGroup}>
              <Label>
                <h6>
                  3. Define Criteria <CriteriaHelp />
                </h6>
              </Label>
              <FieldFeedback
                name="criteria"
                helper="These are dimensions or attributes used to evaluate and prioritize the concepts."
              />
              <InputList
                items={values.criteria}
                itemsPath="criteria"
                propertyName="name"
                addText="Add New Criterion"
                /*
              extraControls={() => (
                <Button color="success">Add more information</Button>
              )}
              */
              />
            </FormGroup>
            <FormGroup className={styles.CreateEvaluationForm__FormGroup}>
              <Label>
                <h6>
                  4. Define Scoring Mode <ScoringModeHelp />
                </h6>
              </Label>
              <FieldFeedback
                name="scoring"
                helper="Both modes can be selected for an evaluation."
              />
              <FormGroup check>
                <Input
                  type="checkbox"
                  name="scoring.facilitator"
                  id="scoring.facilitator"
                  checked={values.scoring.facilitator}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Label for="scoring.facilitator" check>
                  <strong>Individual</strong> – I will score the Concepts
                  against the Criteria myself.
                </Label>
              </FormGroup>
              <FormGroup check>
                <Input
                  type="checkbox"
                  name="scoring.survey"
                  id="scoring.survey"
                  checked={values.scoring.survey}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Label for="scoring.survey" check>
                  <strong>Survey</strong> – I will ask others to score the
                  Concepts against the Criteria.
                </Label>
              </FormGroup>
            </FormGroup>
            <FormGroup>
              <Button
                type="submit"
                color="primary"
                disabled={isSubmitting}
                block
              >
                Create Evaluation (and continue to scoring)
              </Button>
            </FormGroup>
          </Form>
        </LoadingOverlay>
      )}
    </Formik>
  );
}
