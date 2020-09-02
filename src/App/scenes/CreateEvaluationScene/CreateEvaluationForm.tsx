import React, { useState } from "react";
import { Formik, FormikHelpers } from "formik";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  CardBody,
  Container,
} from "reactstrap";
import { ObjectId } from "bson";

import { ListField, ListFieldInputItem } from "../../ListField";
import {
  app,
  evaluationsCollection,
  Scoring,
  generateSharingToken,
  Evaluation,
  Link,
} from "../../../mongodb";
import { CriteriaHelp } from "./CriteriaHelp";
import { ConceptHelp } from "./ConceptHelp";
import { ScoringModeHelp } from "./ScoringModeHelp";
import { LoadingOverlay } from "../../LoadingOverlay";
import { FieldFeedback } from "../../FieldFeedback";
import { NameHelp } from "./NameHelp";

import styles from "./CreateEvaluationForm.module.scss";

import { DetailSidebar, DetailSidebarProps } from "./DetailSidebar";
import { FocusIndicator } from "./FocusIndicator";
import {
  EvaluationValues,
  DetailValues,
  CriterionValues,
  ConceptValues,
} from "./Values";
import { Focus } from "./Focus";
import { FocusResetter } from "./FocusResetter";

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

function getFocussedElementName(
  values: EvaluationValues,
  focus: Focus | null
): string {
  if (focus?.kind === "concept") {
    const index = values.concepts.findIndex((c) => c._id === focus._id);
    return `concepts.${index}.name`;
  } else if (focus?.kind === "criterion") {
    const index = values.criteria.findIndex((c) => c._id === focus._id);
    return `criteria.${index}.name`;
  } else {
    return "name";
  }
}

function getFocussedElement(
  values: EvaluationValues,
  focus: Focus | null
): HTMLElement | null {
  const elementName = getFocussedElementName(values, focus);
  const element = document.getElementsByName(elementName)[0];
  // Fallback to the element named "name"
  return element || document.getElementsByName("name")[0];
}

function getDetailSidebarProps(
  values: EvaluationValues,
  focus: Focus | null
): DetailSidebarProps {
  if (focus?.kind === "concept") {
    const concept = values.concepts.find((c) => c._id === focus._id);
    if (concept) {
      const index = values.concepts.indexOf(concept);
      return {
        title: concept.name || "Concept Details",
        namePrefix: `concepts.${index}`,
      };
    }
  } else if (focus?.kind === "criterion") {
    const criterion = values.criteria.find((c) => c._id === focus._id);
    if (criterion) {
      const index = values.criteria.indexOf(criterion);
      return {
        title: criterion.name || "Criterion Details",
        namePrefix: `criteria.${index}`,
      };
    }
  }
  return { title: values.name || "Evaluation Details" };
}

function cleanLink({ url, title }: Link): Link {
  return title ? { url, title } : { url };
}

function cleanLinks(links: Link[]): Link[] {
  return links.filter(({ url }) => url).map(cleanLink);
}

function cleanDetails<V extends DetailValues>({ links, ...rest }: V): V {
  return { ...rest, links: cleanLinks(links) } as V;
}

// TODO: Split this function in two if their schema starts diverging.
function createConceptOrCriterion(): ConceptValues | CriterionValues {
  return {
    _id: new ObjectId(),
    name: "",
    description: "",
    links: [{ url: "" }],
  };
}

export function CreateEvaluationForm({
  handleCreated,
}: CreateEvaluationFormProps) {
  const handleSubmit: CreateEvaluationHandler = async (values, helpers) => {
    if (app.currentUser) {
      // Filter out links without a URL and undefine empty titles
      const criteria = values.criteria.filter((c) => c.name).map(cleanDetails);
      const concepts = values.concepts.filter((a) => a.name).map(cleanDetails);
      const links = cleanLinks(values.links);
      // Generate sharing token
      const scoring: Scoring = {
        ...values.scoring,
        token: generateSharingToken(),
      };
      const evaluation: Omit<Evaluation, "_id"> = {
        facilitator: app.currentUser.id,
        participants: [],
        scores: {},
        name: values.name,
        description: values.description,
        links,
        concepts,
        criteria,
        sharing: { mode: "disabled" },
        scoring,
      };
      const { insertedId } = await evaluationsCollection.insertOne(evaluation);
      gtag("event", "create_evaluation");
      handleCreated({ ...evaluation, _id: insertedId });
    } else {
      throw new Error("Need an authenticated user to create an evaluation.");
    }
  };

  const [focus, setFocus] = useState<Focus | null>(null);

  return (
    <Formik<EvaluationValues>
      initialValues={{
        name: "",
        description: "",
        links: [{ url: "" }],
        concepts: [createConceptOrCriterion()],
        criteria: [createConceptOrCriterion()],
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
          <FocusResetter values={values} focus={focus} setFocus={setFocus} />
          <Form onSubmit={handleSubmit} onReset={handleReset}>
            <Container>
              <Row>
                <Col sm="7">
                  <CardBody>
                    <FormGroup
                      className={styles.CreateEvaluationForm__FormGroup}
                    >
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
                        autoComplete="off"
                        onChange={handleChange}
                        onFocus={() =>
                          setFocus({
                            kind: "evaluation",
                          })
                        }
                        onBlur={handleBlur}
                        invalid={errors.name && touched.name ? true : false}
                        required
                        autoFocus
                      />
                    </FormGroup>
                    <FormGroup
                      className={styles.CreateEvaluationForm__FormGroup}
                    >
                      <Label>
                        <h6>
                          2. Define Concepts <ConceptHelp />
                        </h6>
                      </Label>
                      <FieldFeedback
                        name="concepts"
                        helper="These are the ideas or options you are evaluating."
                      />
                      <ListField
                        items={values.concepts}
                        itemsPath="concepts"
                        addText="Add New Concept"
                        generateNewItem={createConceptOrCriterion}
                        renderItem={(props) => (
                          <ListFieldInputItem
                            {...props}
                            key={
                              props.index < props.itemCount - 1
                                ? props.item._id.toHexString()
                                : "last"
                            }
                            propertyName="name"
                            autoComplete="off"
                            onFocus={() =>
                              setFocus({
                                kind: "concept",
                                _id: props.item._id,
                              })
                            }
                          />
                        )}
                      />
                    </FormGroup>
                    <FormGroup
                      className={styles.CreateEvaluationForm__FormGroup}
                    >
                      <Label>
                        <h6>
                          3. Define Criteria <CriteriaHelp />
                        </h6>
                      </Label>
                      <FieldFeedback
                        name="criteria"
                        helper="These are dimensions or attributes used to evaluate and prioritize the concepts."
                      />
                      <ListField
                        items={values.criteria}
                        itemsPath="criteria"
                        addText="Add New Criterion"
                        generateNewItem={createConceptOrCriterion}
                        renderItem={(props) => (
                          <ListFieldInputItem
                            {...props}
                            key={
                              props.index < props.itemCount - 1
                                ? props.item._id.toHexString()
                                : "last"
                            }
                            propertyName="name"
                            autoComplete="off"
                            onFocus={() =>
                              setFocus({
                                kind: "criterion",
                                _id: props.item._id,
                              })
                            }
                          />
                        )}
                      />
                    </FormGroup>
                    <FormGroup
                      className={styles.CreateEvaluationForm__FormGroup}
                    >
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
                          <strong>Individual</strong> – I will score the
                          Concepts against the Criteria myself.
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
                          <strong>Survey</strong> – I will ask others to score
                          the Concepts against the Criteria.
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
                  </CardBody>
                  <FocusIndicator
                    className={styles.CreateEvaluationForm__FocusIndicator}
                    focussedElement={getFocussedElement(values, focus)}
                  />
                </Col>
                <Col sm="5" className={styles.CreateEvaluationForm__Sidebar}>
                  <CardBody>
                    <DetailSidebar {...getDetailSidebarProps(values, focus)} />
                  </CardBody>
                </Col>
              </Row>
            </Container>
          </Form>
        </LoadingOverlay>
      )}
    </Formik>
  );
}
