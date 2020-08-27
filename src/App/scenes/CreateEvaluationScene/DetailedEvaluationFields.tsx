import React from "react";
import { Input, FormGroup, Label } from "reactstrap";
import { FieldFeedback } from "../../FieldFeedback";

type DetailedEvaluationFields = {
  name: string;
};

export function DetailedEvaluationFields({ name }: DetailedEvaluationFields) {
  return (
    <section>
      <h4>{name || "Evaluation details"}</h4>
      <FormGroup>
        <Label for="description">
          <h6>Description (optional)</h6>
          <FieldFeedback name="description" />
        </Label>
        <Input type="textarea" name="description" id="description" rows="4" />
      </FormGroup>
      {/*<FormGroup>
        <Label for="image">
          <h6>Image (optional)</h6>
          <FieldFeedback name="image" />
        </Label>
        <ImageInput name="image" />
      </FormGroup>*/}
    </section>
  );
}
