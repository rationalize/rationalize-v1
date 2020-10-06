import React from "react";
import { useField } from "formik";
import { FormGroup, Label, Input } from "reactstrap";

import { FieldFeedback } from "components/FieldFeedback";

type DescriptionFormGroupProps = {
  namePrefix?: string;
};

export function DescriptionFormGroup({
  namePrefix,
}: DescriptionFormGroupProps) {
  const [field] = useField<string>(
    namePrefix ? `${namePrefix}.description` : "description"
  );
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
