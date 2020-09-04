import React from "react";
import { Button } from "reactstrap";
import { FieldArray, ArrayHelpers, useFormikContext } from "formik";
import { X } from "react-feather";

import { InputWithControls } from "./InputWithControls";

import styles from "./InputList.module.scss";

type BaseItem = { [key: string]: string };

export type InputListProps<Item> = {
  items: Item[];
  itemsPath: string;
  propertyName: keyof Item;
  extraControls?: (item: Item, index: number) => React.ReactNode;
  addText?: string;
};

export function InputList<Item extends BaseItem>({
  items,
  itemsPath,
  propertyName,
  extraControls = () => null,
  addText = "Add new item",
}: InputListProps<Item>) {
  function handleListInputKeyPress(
    helpers: ArrayHelpers,
    isLastItem: boolean,
    e: React.KeyboardEvent<HTMLElement>
  ) {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      if (isLastItem) {
        helpers.push({ [propertyName]: "" });
      }
    }
  }

  const { handleChange, handleBlur } = useFormikContext<any>();

  return (
    <FieldArray name={itemsPath}>
      {(arrayHelpers) => (
        <>
          {items.map((item, index) => {
            const itemPath = `${itemsPath}.${index}.${propertyName}`;
            const isLastItem = index === items.length - 1;
            return (
              <InputWithControls
                className={styles.InputListCard__Item}
                key={isLastItem ? "last" : index}
                type="text"
                name={itemPath}
                value={item[propertyName]}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleListInputKeyPress.bind(
                  null,
                  arrayHelpers,
                  isLastItem
                )}
              >
                {items.length > 1 && (
                  <Button
                    color="transparent"
                    onClick={() => arrayHelpers.remove(index)}
                  >
                    <X size="1rem" />
                  </Button>
                )}
                {extraControls(item, index)}
              </InputWithControls>
            );
          })}
          <Button
            size="sm"
            color="primary"
            outline
            block
            onClick={() => arrayHelpers.push({ name: "" })}
          >
            {addText}
          </Button>
        </>
      )}
    </FieldArray>
  );
}
