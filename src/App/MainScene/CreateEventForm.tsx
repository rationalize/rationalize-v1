import React from "react";
import { Formik, FormikHelpers, useFormikContext } from "formik";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";

import { InputListCard } from "../InputListCard";

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
  participate: boolean;
};

export type CreateEventHandler = (
  value: EventValues,
  helpers: FormikHelpers<EventValues>
) => void;

type CreateEventFormProps = {
  handleCreateEvent: CreateEventHandler;
};

type ErrorObject<Values> = { [key in keyof Values]?: string };

function validate(values: EventValues) {
  const errors: ErrorObject<EventValues> = {};
  const criteria = values.criteria.filter((c) => c.name);
  const alternatives = values.alternatives.filter((a) => a.name);
  if (values.name === "") {
    errors.name = "You must provide a name";
  }
  if (criteria.length === 0) {
    errors.criteria = "The must be at least one criterion.";
  }
  if (alternatives.length === 0) {
    errors.alternatives = "The must be at least one alternative.";
  }
  return errors;
}

type FieldFeedbackProps<Values> = {
  name: keyof Values;
  helper: string;
};

function FieldFeedback<Values>({ name, helper }: FieldFeedbackProps<Values>) {
  const { errors, touched } = useFormikContext<Values>();
  const showError = name in errors && name in touched;
  return (
    <FormText color={showError ? "danger" : undefined}>
      {showError ? errors[name] : helper}
    </FormText>
  );
}

export function CreateEventForm({ handleCreateEvent }: CreateEventFormProps) {
  return (
    <Formik<EventValues>
      initialValues={{
        name: "",
        alternatives: [{ name: "" }],
        criteria: [{ name: "" }],
        participate: false,
      }}
      validate={validate}
      onSubmit={handleCreateEvent}
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
              invalid={errors.name && touched.name ? true : false}
            />
            <FieldFeedback
              name="name"
              helper="Events have names, making it easer to tell them apart."
            />
          </FormGroup>
          <FormGroup>
            <Label>Criteria</Label>
            <InputListCard
              items={values.criteria}
              itemsPath="criteria"
              propertyName="name"
            />
            <FieldFeedback
              name="criteria"
              helper="A list of criteria that would make someone choose one alternative over the other."
            />
          </FormGroup>
          <FormGroup>
            <Label>Alternative concepts to evaluate</Label>
            <InputListCard
              items={values.alternatives}
              itemsPath="alternatives"
              propertyName="name"
            />
            <FieldFeedback
              name="alternatives"
              helper="What are the different potential outcomes from the event?"
            />
          </FormGroup>
          <FormGroup check>
            <Input
              type="checkbox"
              name="participate"
              id="participate"
              checked={values.participate}
              onChange={handleChange}
              onBlur={handleBlur}
              invalid={errors.participate && touched.participate ? true : false}
            />
            <Label for="participate" check>
              Include yourself as participant
            </Label>
          </FormGroup>
          <hr />
          <Button type="submit" color="primary" disabled={isSubmitting} block>
            Create event
          </Button>
        </Form>
      )}
    </Formik>
  );
}
