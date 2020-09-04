import React from "react";
import { Button } from "reactstrap";
import { FieldArray } from "formik";

export type ListFieldItemProps<ItemType extends object> = {
  itemPath: string;
  itemCount: number;
  item: ItemType;
  index: number;
  onAddItem: () => void;
  onRemoveItem: () => void;
};

export type InputListProps<ItemType extends object> = {
  items: ItemType[];
  itemsPath: string;
  addText?: string;
  generateNewItem: () => ItemType;
  renderItem: (props: ListFieldItemProps<ItemType>) => JSX.Element | null;
};

export function ListField<Item extends object>({
  items,
  itemsPath,
  addText = "Add new item",
  renderItem,
  generateNewItem,
}: InputListProps<Item>) {
  return (
    <FieldArray name={itemsPath}>
      {(arrayHelpers) => {
        function handleAddItem() {
          const newItem = generateNewItem();
          arrayHelpers.push(newItem);
        }

        return (
          <>
            {items.map((item, index) => {
              const itemPath = `${itemsPath}.${index}`;

              function handleRemoveItem() {
                arrayHelpers.remove(index);
              }

              return renderItem({
                item,
                index,
                itemCount: items.length,
                itemPath,
                onAddItem: handleAddItem,
                onRemoveItem: handleRemoveItem,
              });
            })}
            <Button
              size="sm"
              color="primary"
              outline
              block
              onClick={() => handleAddItem()}
            >
              {addText}
            </Button>
          </>
        );
      }}
    </FieldArray>
  );
}
