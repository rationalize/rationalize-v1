import React from "react";
import { FormGroup, Input } from "reactstrap";
import { useFormikContext } from "formik";

import { ListFieldItemProps, ListFieldInputItem } from "../../../ListField";
import { Link } from "../../../../mongodb";

export type LinkFormGroupProps = ListFieldItemProps<Link>;

export function LinkFormGroup(props: LinkFormGroupProps) {
  const { handleChange, handleBlur } = useFormikContext<any>();
  const isLastItem = props.index === props.itemCount - 1;
  return (
    <FormGroup key={isLastItem ? "last" : props.index}>
      <ListFieldInputItem
        {...props}
        propertyName="url"
        placeholder="https://"
      />
      <Input
        value={props.item.title || ""}
        placeholder="Title"
        onChange={handleChange}
        onBlur={handleBlur}
        name={`${props.itemPath}.title`}
      />
    </FormGroup>
  );
}
