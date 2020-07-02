import React from "react";
import { Card, CardBody, Button } from "reactstrap";
import { FieldArray, ArrayHelpers, useFormikContext } from "formik";
import { X, Plus } from "react-feather";

import { InputWithControls } from "./InputWithControls";

import styles from "./InputListCard.module.scss";

type BaseItem = { [key: string]: string };

export type InputListCardProps<Item> = {
  items: Item[];
  itemsPath: string;
  propertyName: keyof Item;
};

export function InputListCard<Item extends BaseItem>({
  items,
  itemsPath,
  propertyName,
}: InputListCardProps<Item>) {
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

  const { handleChange, handleBlur, errors, touched } = useFormikContext<any>();

  return (
    <FieldArray name={itemsPath}>
      {(arrayHelpers) => (
        <Card
          color={errors[itemsPath] && touched[itemsPath] ? "danger" : undefined}
          outline
        >
          <CardBody>
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
                  <Button
                    color="transparent"
                    onClick={() => arrayHelpers.remove(index)}
                  >
                    <X size="1rem" />
                  </Button>
                </InputWithControls>
              );
            })}
            <Button
              size="sm"
              onClick={() => arrayHelpers.push({ name: "" })}
              block
            >
              <Plus size="1rem" />
            </Button>
          </CardBody>
        </Card>
      )}
    </FieldArray>
  );
}
