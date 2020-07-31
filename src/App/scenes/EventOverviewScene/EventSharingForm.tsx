import React from "react";
import { Formik, FormikHelpers } from "formik";
import { FormGroup, Input, Label, Button, Form } from "reactstrap";

import { Event, Sharing, eventsCollection } from "../../../mongodb";
import { LoadingOverlay } from "../../LoadingOverlay";

type Values = Sharing;

export type EventSharingFormProps = { event: Event };

export function EventSharingForm({ event }: EventSharingFormProps) {
  async function handleSubmit(values: Sharing, helpers: FormikHelpers<Values>) {
    await eventsCollection.updateOne(
      { _id: { $eq: event._id } },
      { $set: { sharing: values } }
    );
  }

  return (
    <Formik<Values>
      initialValues={{ mode: event.sharing ? event.sharing.mode : "disabled" }}
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
            <FormGroup>
              <Label for="mode">Sharing mode</Label>
              <Input
                type="select"
                name="mode"
                id="mode"
                value={values.mode}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="disabled">Disabled</option>
                <option value="public">Public</option>
              </Input>
            </FormGroup>
            <Button
              color="primary"
              type="submit"
              disabled={isSubmitting}
              outline
              block
            >
              Save sharing settings
            </Button>
          </Form>
        </LoadingOverlay>
      )}
    </Formik>
  );
}
