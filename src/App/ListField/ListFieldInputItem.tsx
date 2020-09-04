import React from "react";
import { useFormikContext } from "formik";
import { Button } from "reactstrap";
import { X } from "react-feather";

import { InputWithControls } from "../InputWithControls";
import { ListFieldItemProps } from "./ListField";

import styles from "./ListFieldInputItem.module.scss";

export type ListFieldInputItemProps<ItemType extends object> = {
  propertyName: keyof ItemType;
  placeholder?: string;
} & ListFieldItemProps<ItemType>;

export function ListFieldInputItem<ItemType extends object>({
  itemPath,
  index,
  itemCount,
  item,
  onAddItem,
  onRemoveItem,
  propertyName,
  placeholder,
}: ListFieldInputItemProps<ItemType>) {
  const { handleChange, handleBlur } = useFormikContext<any>();

  const isLastItem = index === itemCount - 1;
  const valuePath = `${itemPath}.${propertyName}`;
  const value = item[propertyName];

  if (typeof value !== "string") {
    throw new Error(`Expected string value, got ${typeof value}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      if (isLastItem) {
        onAddItem();
      }
    }
  }

  return (
    <InputWithControls
      className={styles.ListFieldInputItem}
      key={isLastItem ? "last" : index}
      type="text"
      name={valuePath}
      id={valuePath}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
    >
      {itemCount > 1 && (
        <Button color="transparent" onClick={() => onRemoveItem()}>
          <X size="1rem" />
        </Button>
      )}
    </InputWithControls>
  );
}
