import React from "react";

import { ContentfulPage } from "../Contentful";
import { PrimaryLayout } from "../layouts/PrimaryLayout";

export function ContentfulScene() {
  return (
    <PrimaryLayout>
      <ContentfulPage />
    </PrimaryLayout>
  );
}
