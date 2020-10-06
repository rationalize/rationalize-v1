import React, { useState, useEffect } from "react";
import { Document } from "@contentful/rich-text-types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { useParams } from "react-router-dom";
import { Container, Card } from "reactstrap";

import { LoadingOverlay } from "components/LoadingOverlay";
import { NotFound } from "components/NotFound";

import { client } from "./client";

export type ContentfulPageProps = {
  slug?: string;
};

type Page = {
  fields: {
    title: string;
    slug: string;
    content: Document;
  };
};

export function ContentfulPage({ slug }: ContentfulPageProps) {
  const [isLoading, setLoading] = useState(true);
  const [page, setPage] = useState<Page | null>(null);
  const params = useParams<{ slug?: string }>();
  // Read the slug from the query param
  if (typeof slug !== "string" && typeof params.slug === "string") {
    slug = params.slug;
  }

  useEffect(() => {
    client
      .getEntries({
        content_type: "page",
        "fields.slug": slug,
        include: 1,
      })
      .then(({ items: [page] }) => {
        setPage(page as any);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  return (
    <LoadingOverlay isLoading={isLoading}>
      <Container>
        <Card body>
          {page && documentToReactComponents(page.fields.content)}
          {!page && !isLoading && <NotFound />}
        </Card>
      </Container>
    </LoadingOverlay>
  );
}
