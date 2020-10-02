import { FieldArray } from "formik";
import React, { ChangeEvent, Fragment, useRef } from "react";
import { X } from "react-feather";
import { Button } from "reactstrap";

import { File } from "../../mongodb";
import styles from "./FileList.module.scss";
import useFileUpload from "./useFileUpload";

type Props = {
  files: File[];
  itemsPath: string;
};

export function FileList({ files, itemsPath }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isUploading, uploadFile] = useFileUpload();

  function selectFile() {
    fileRef.current?.click();
  }

  function onFileSelect(push: (file: File) => void) {
    return async (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files as FileList;
      if (files.length > 0) {
        const file = await uploadFile(files[0]);
        console.log("file", file);
        push(file);
      }
    };
  }

  return (
    <Fragment>
      <FieldArray name={itemsPath}>
        {(arrayHelpers) => {
          return (
            <>
              {files.map((file, idx) => {
                function handleRemoveItem() {
                  arrayHelpers.remove(idx);
                }

                return (
                  <div key={idx} className={styles.FileList__FileItem}>
                    <div className={styles.FileList__FileLink}>
                      <a
                        key={idx}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted"
                      >
                        {file.filename}
                      </a>
                    </div>
                    <div className={styles.FileList__DeleteButton}>
                      <Button
                        color="transparent"
                        onClick={() => handleRemoveItem()}
                      >
                        <X size="1rem" />
                      </Button>
                    </div>
                  </div>
                );
              })}
              <Button
                disabled={isUploading}
                size="sm"
                color="primary"
                outline
                block
                onClick={selectFile}
              >
                <input
                  ref={fileRef}
                  type="file"
                  className={styles.FileList__FileInput}
                  onChange={onFileSelect(arrayHelpers.push)}
                />
                {isUploading ? "Uploading..." : "Upload a file"}
              </Button>
            </>
          );
        }}
      </FieldArray>
    </Fragment>
  );
}
