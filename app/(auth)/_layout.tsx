import { AuthContext } from "@/contexts/AuthContext";
import { Stack, useRouter } from "expo-router";
import { useContext, useEffect } from "react";

export default function AuthLayout() {
  const router = useRouter();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (authContext?.user) {
      router.replace("/(tabs)");
    }
  }, [authContext?.user, router]);

  return <Stack screenOptions={{ headerShown: false, animation: "none" }} />;
}
