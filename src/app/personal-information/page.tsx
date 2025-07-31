"use client";

import PersonalInformation from "@/components/personal-information";
import { useRouter } from "next/navigation";

export default function PersonalInformationPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };

  return <PersonalInformation onBack={handleBack} />;
}