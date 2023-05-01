import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/dictionary/keyboard");
  }, []);

  return (
    <div className="flex flex-col items-center gap-2 pt-5 bg-gray-100 min-h-screen h-full"></div>
  );
}
