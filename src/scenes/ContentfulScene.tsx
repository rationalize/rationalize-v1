import React from "react";

import { ContentfulPage } from "components/Contentful";
import { PrimaryLayout } from "layouts/PrimaryLayout";

export function ContentfulScene() {
  return (
    <PrimaryLayout>
      <ContentfulPage />
    </PrimaryLayout>
  );
}
