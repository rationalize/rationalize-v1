import React from "react";
import { Input, FormGroup, Label } from "reactstrap";
import { FieldFeedback } from "../../FieldFeedback";

export function DetailedEvaluationFields() {
  return (
    <section>
      <FormGroup>
        <Label for="description">
          <h6>Optional: Description</h6>
          <FieldFeedback name="description" />
        </Label>
        <Input type="textarea" name="description" id="description" rows="6" />
      </FormGroup>
    </section>
  );
}
