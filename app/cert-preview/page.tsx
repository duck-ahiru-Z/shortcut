import { notFound } from "next/navigation";

import CertPreviewClient from "./CertPreviewClient";

export default function CertPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CertPreviewClient />;
}
