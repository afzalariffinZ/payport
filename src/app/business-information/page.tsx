"use client";

import BusinessInformation from "@/components/business-information";
import { useRouter } from "next/navigation";

export default function BusinessInformationPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };

  return <BusinessInformation onBack={handleBack} />;
}