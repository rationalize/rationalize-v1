import React from "react";
import { useFormikContext } from "formik";
import { Button, InputProps } from "reactstrap";
import { X } from "react-feather";

import { InputWithControls } from "../InputWithControls";
import { ListFieldItemProps } from "./ListField";

import styles from "./ListFieldInputItem.module.scss";

export type ListFieldInputItemProps<ItemType extends object> = {
  propertyName: keyof ItemType;
  placeholder?: string;
  onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
} & ListFieldItemProps<ItemType> &
  InputProps;

export function ListFieldInputItem<ItemType extends object>({
  itemPath,
  index,
  itemCount,
  item,
  onAddItem,
  onRemoveItem,
  onFocus,
  propertyName,
  placeholder,
  ...rest
}: ListFieldInputItemProps<ItemType>) {
  const { handleChange, handleBlur } = useFormikContext<any>();

  const isLastItem = index === itemCount - 1;
  const valuePath = `${itemPath}.${propertyName}`;
  const value = item[propertyName];

  if (typeof value !== "string") {
    throw new Error(`Expected string value, got ${typeof value}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      if (isLastItem) {
        onAddItem();
        // Refocus to trigger a focus event, moving the focus indicator
        const target = e.currentTarget;
        setTimeout(() => {
          target.blur();
          target.focus();
        });
      }
    }
  }

  return (
    <InputWithControls
      className={styles.ListFieldInputItem}
      type="text"
      name={valuePath}
      id={valuePath}
      value={value}
      onChange={handleChange}
      onFocus={onFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      {...rest}
    >
      {itemCount > 1 && (
        <Button color="transparent" onClick={() => onRemoveItem()}>
          <X size="1rem" />
        </Button>
      )}
    </InputWithControls>
  );
}
