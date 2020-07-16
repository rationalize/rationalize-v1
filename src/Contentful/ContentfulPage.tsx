import { Document } from "@contentful/rich-text-types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { client } from "./client";

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { LoadingOverlay } from "../App/LoadingOverlay";

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
      });
  }, [slug]);

  console.log("page", page);

  return (
    <LoadingOverlay isLoading={page === null}>
      {page ? documentToReactComponents(page.fields.content) : null}
    </LoadingOverlay>
  );
}
