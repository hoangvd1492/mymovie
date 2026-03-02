import { useEffect, useState } from "react";
import { createClient } from "../supabase/client";
import { User } from "../type/user";

export function useCurrentUser(): User | null {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setProfile(null);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      setProfile(data);
    };

    fetchProfile();

    const { data } = supabase.auth.onAuthStateChange(() => {
      fetchProfile();
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return profile;
}
