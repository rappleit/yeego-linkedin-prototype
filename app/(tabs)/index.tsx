import ProfileScreen from "@/components/profile/ProfileScreen";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";

export default function HomeScreen() {
  const authContext = useContext(AuthContext);
  const userId = authContext?.user?.id || "";

  return (
    <ProfileScreen userId={userId} />
  );
}


