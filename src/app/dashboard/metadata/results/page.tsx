"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LegacyMetadataResultsRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const qs = searchParams.toString();
    const target = `/dashboard/metadata/analysis-results${qs ? `?${qs}` : ""}`;
    router.replace(target);
  }, [router, searchParams]);

  return null;
}