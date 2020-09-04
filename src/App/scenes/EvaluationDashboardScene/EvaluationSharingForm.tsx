import React from "react";
import { Formik } from "formik";
import { FormGroup, Input, Label, Button, Form } from "reactstrap";

import { Evaluation, evaluationsCollection } from "../../../mongodb";
import { LoadingOverlay } from "../../LoadingOverlay";

type Values = { public: boolean };

export type EvaluationSharingFormProps = { evaluation: Evaluation };

export function EvaluationSharingForm({
  evaluation,
}: EvaluationSharingFormProps) {
  async function handleSubmit(values: Values) {
    await evaluationsCollection.updateOne(
      { _id: { $eq: evaluation._id } },
      { $set: { sharing: { mode: values.public ? "public" : "disabled" } } }
    );
  }

  return (
    <Formik<Values>
      initialValues={{
        public: evaluation.sharing
          ? evaluation.sharing.mode === "public"
          : false,
      }}
      onSubmit={handleSubmit}
    >
      {({
        values,
        handleChange,
        handleBlur,
        handleReset,
        handleSubmit,
        isSubmitting,
      }) => (
        <LoadingOverlay isLoading={isSubmitting}>
          <Form onSubmit={handleSubmit} onReset={handleReset}>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  name="public"
                  id="public"
                  checked={values.public}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />{" "}
                Make evaluation public
              </Label>
            </FormGroup>
            <br />
            <Button
              color="primary"
              type="submit"
              disabled={isSubmitting}
              outline
              block
            >
              Save Privacy Settings
            </Button>
          </Form>
        </LoadingOverlay>
      )}
    </Formik>
  );
}
