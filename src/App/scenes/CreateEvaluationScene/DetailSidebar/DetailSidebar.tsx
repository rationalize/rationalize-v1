import { useField } from "formik";
import React from "react";
import { FormGroup, Label } from "reactstrap";

import { File, Link } from "../../../../mongodb";
import { FieldFeedback } from "../../../FieldFeedback";
import { FileList } from "../../../FileList";
import { ListField } from "../../../ListField";
import { DescriptionFormGroup } from "./DescriptionFormGroup";
import { LinkFormGroup } from "./LinkFormGroup";

export type DetailSidebarProps = {
  title: string;
  namePrefix?: string;
};

export function DetailSidebar({ title, namePrefix }: DetailSidebarProps) {
  const linksName = namePrefix ? `${namePrefix}.links` : "links";
  const filesName = namePrefix ? `${namePrefix}.files` : "files";
  const [{ value: links }] = useField<Link[]>(linksName);
  const [{ value: files }] = useField<File[]>(filesName);

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
      <FormGroup>
        <Label>
          <h6>Images &amp; files (optional)</h6>
        </Label>
        <FieldFeedback name={filesName} />
        <FileList files={files} itemsPath={filesName} />
      </FormGroup>
    </section>
  );
}
