import React from "react";
import { FormGroup, Label } from "reactstrap";
import { useField } from "formik";

import { FieldFeedback } from "../../../FieldFeedback";
import { Link } from "../../../../mongodb";
import { DescriptionFormGroup } from "./DescriptionFormGroup";
import { LinkFormGroup } from "./LinkFormGroup";
import { ListField } from "../../../ListField";

type EvaluationSidebarProps = {
  name: string;
};

export function EvaluationSidebar({ name }: EvaluationSidebarProps) {
  const [{ value: links }] = useField<Link[]>({ name: "links" });
  return (
    <section>
      <h4>{name || "Evaluation details"}</h4>
      <DescriptionFormGroup />
      <FormGroup>
        <Label>
          <h6>Links (optional)</h6>
        </Label>
        <FieldFeedback name="links" />
        <ListField
          items={links}
          itemsPath="links"
          addText="Add New Link"
          generateNewItem={() => ({ title: "", url: "" })}
          renderItem={(props) => <LinkFormGroup {...props} />}
        />
      </FormGroup>
    </section>
  );
}
