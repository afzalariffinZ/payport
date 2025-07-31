"use client";

import Documents from "@/components/documents";
import { useRouter } from "next/navigation";

export default function DocumentsPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };

  return <Documents onBack={handleBack} />;
}