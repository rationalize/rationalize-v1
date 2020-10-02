import { useEffect, useState } from "react";

import { app, File as DbFile } from "../../mongodb";

export default (): [boolean, (file: File) => Promise<DbFile>] => {
  const [uploadURL, setUploadURL] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    if (uploadURL === "") {
      app.functions.uploadFileSignedURL().then(setUploadURL);
    }
  }, [uploadURL]);

  async function uploadFile(file: File): Promise<DbFile> {
    setIsUploading(true);

    const headers = new Headers();
    headers.set("Content-Type", file.type);

    if (file.type.match(/^image\//) || file.type === "application/pdf") {
      headers.set("Content-Disposition", `filename=${file.name}`);
    } else {
      headers.set("Content-Disposition", `attachment; filename=${file.name}`);
    }

    const opts: RequestInit = {
      method: "PUT",
      headers,
      body: file,
    };

    await fetch(uploadURL, opts);
    setIsUploading(false);

    setUploadURL("");

    return {
      filename: file.name,
      mimetype: file.type,
      url: uploadURL.split(/\?/)[0],
    };
  }

  return [isUploading, uploadFile];
};
