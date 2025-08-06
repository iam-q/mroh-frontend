import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Profile {
  id: string;
  email: string;
  username: string;
  phone: string;
  created_at: string;
  updated_at: string;
  validated: boolean;
  validated_at: string;
  validate_sent: boolean;
  validate_sent_at: string;
}

interface ProfileStore {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      clearProfile: () => set({ profile: null }),
    }),
    {
      name: "profile-storage",
    },
  ),
);
