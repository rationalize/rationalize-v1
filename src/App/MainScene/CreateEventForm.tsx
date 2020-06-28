import React from "react";
import { Formik, FormikHelpers, FieldArray } from "formik";
import {
  Button,
  InputGroup,
  InputGroupAddon,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

import styles from "./CreateEventForm.module.scss";

export type AlternativeValues = {
  name: string;
};

export type CriterionValues = {
  name: string;
};

export type EventValues = {
  name: string;
  criteria: CriterionValues[];
  alternatives: AlternativeValues[];
};

export type CreateEventHandler = (
  value: EventValues,
  helpers: FormikHelpers<EventValues>
) => void;

type CreateEventFormProps = {
  handleCreateEvent: CreateEventHandler;
};

export function CreateEventForm({ handleCreateEvent }: CreateEventFormProps) {
  return (
    <Formik<EventValues>
      initialValues={{
        name: "",
        alternatives: [{ name: "" }],
        criteria: [{ name: "" }],
      }}
      onSubmit={handleCreateEvent}
    >
      {({ values, handleSubmit, handleReset, handleBlur, handleChange }) => (
        <Form onSubmit={handleSubmit} onReset={handleReset}>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </FormGroup>
          <FormGroup>
            <Label for="criterion.0">Criteria</Label>
            <FieldArray name="criteria">
              {(arrayHelpers) => (
                <Card>
                  <CardBody>
                    {values.criteria.map((criterion, index) => (
                      <InputGroup
                        key={index}
                        className={styles.CreateEventForm__Criterion}
                      >
                        <Input
                          type="text"
                          name={`criteria.${index}.name`}
                          id={`criteria.${index}.name`}
                          value={criterion.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <InputGroupAddon addonType="append">
                          <Button onClick={() => arrayHelpers.remove(index)}>
                            Remove
                          </Button>
                        </InputGroupAddon>
                      </InputGroup>
                    ))}
                    <Button
                      onClick={() => arrayHelpers.push({ name: "" })}
                      block
                    >
                      Add a criterion
                    </Button>
                  </CardBody>
                </Card>
              )}
            </FieldArray>
          </FormGroup>
          <FormGroup>
            <Label for="alternative.0">Alternative concepts to evaluate</Label>
            <FieldArray name="alternatives">
              {(arrayHelpers) => (
                <Card>
                  <CardBody>
                    {values.alternatives.map((alternative, index) => (
                      <InputGroup
                        key={index}
                        className={styles.CreateEventForm__Alternative}
                      >
                        <Input
                          type="text"
                          name={`alternatives.${index}.name`}
                          id={`alternatives.${index}.name`}
                          value={alternative.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <InputGroupAddon addonType="append">
                          <Button onClick={() => arrayHelpers.remove(index)}>
                            Remove
                          </Button>
                        </InputGroupAddon>
                      </InputGroup>
                    ))}
                    <Button
                      onClick={() => arrayHelpers.push({ name: "" })}
                      block
                    >
                      Add an alternative
                    </Button>
                  </CardBody>
                </Card>
              )}
            </FieldArray>
          </FormGroup>
          <Button type="submit" color="primary" block>
            Create event
          </Button>
        </Form>
      )}
    </Formik>
  );
}
