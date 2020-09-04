import React from "react";
import { useField } from "formik";
import { FormGroup, Label, Input } from "reactstrap";

import { FieldFeedback } from "../../../FieldFeedback";

export function DescriptionFormGroup() {
  const [field] = useField<string>({ name: "description" });
  return (
    <FormGroup>
      <Label for="description">
        <h6>Description (optional)</h6>
        <FieldFeedback name="description" />
      </Label>
      <Input type="textarea" rows="4" {...field} />
    </FormGroup>
  );
}
