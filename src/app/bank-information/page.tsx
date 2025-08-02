"use client";

import BankInformation from "@/components/bank-information";
import { useRouter } from "next/navigation";

export default function BankInformationPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/dashboard");
  };

  return <BankInformation onBack={handleBack} />;
}