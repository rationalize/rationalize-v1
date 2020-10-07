import React from "react";
import { FormGroup, Label } from "reactstrap";
import { useField } from "formik";

import { FieldFeedback } from "components/FieldFeedback";
import { ListField } from "components/ListField";
import { Link } from "mongodb-realm";

import { DescriptionFormGroup } from "./DescriptionFormGroup";
import { LinkFormGroup } from "./LinkFormGroup";

export type DetailSidebarProps = {
  title: string;
  namePrefix?: string;
};

export function DetailSidebar({ title, namePrefix }: DetailSidebarProps) {
  const linksName = namePrefix ? `${namePrefix}.links` : "links";
  const [{ value: links }] = useField<Link[]>(linksName);
  return (
    <section>
      <h4>{title}</h4>
      <DescriptionFormGroup namePrefix={namePrefix} />
      <FormGroup>
        <Label>
          <h6>Links (optional)</h6>
        </Label>
        <FieldFeedback name={linksName} />
        <ListField
          items={links}
          itemsPath={linksName}
          addText="Add New Link"
          generateNewItem={() => ({ title: "", url: "" })}
          renderItem={(props) => <LinkFormGroup key={props.index} {...props} />}
        />
      </FormGroup>
    </section>
  );
}
