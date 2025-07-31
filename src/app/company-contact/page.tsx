"use client";

import CompanyContact from "@/components/company-contact";
import { useRouter } from "next/navigation";

export default function CompanyContactPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };

  return <CompanyContact onBack={handleBack} />;
}