"use client";

import FoodMenu from "@/components/food-menu";
import { useRouter } from "next/navigation";

export default function FoodMenuPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };

  return <FoodMenu onBack={handleBack} />;
}