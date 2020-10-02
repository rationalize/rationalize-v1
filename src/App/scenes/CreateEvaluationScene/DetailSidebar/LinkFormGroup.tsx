import { useFormikContext } from "formik";
import React from "react";
import { FormGroup, Input } from "reactstrap";

import { Link } from "../../../../mongodb";
import { ListFieldInputItem, ListFieldItemProps } from "../../../ListField";

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
        placeholder="Link title"
        onChange={handleChange}
        onBlur={handleBlur}
        name={`${props.itemPath}.title`}
      />
    </FormGroup>
  );
}
