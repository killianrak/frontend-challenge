export type ActionType = "INSTAGRAM" | "GOOGLE_REVIEW" | "TIKTOK" | "FACEBOOK";
export type GiftType = "EAT" | "DRINK" | "DISCOUNT" | "LOSS";
export type GameType = "WHEEL" | "SLOT_MACHINE" | "MYSTERY" | "CARD";
export type Profile = "PREMIUM" | "BASIC";

export interface Action {
  id: string;
  priority: number;
  target: string;
  type: ActionType;
}

export interface Colors {
  primary: string;
  secondary: string;
}

export interface Gift {
  id: string;
  icon: string;
  initial_limit: number;
  limit: number;
  name: string;
  type: GiftType;
}

export interface Conditions {
  id: string;
  name: string;
  value: string;
}

export interface Configuration {
  actions: Action[];
  colors: Colors;
  disabled: boolean;
  game_type: GameType;
  gifts: Gift[];
  retrievalConditions: Conditions[];
  logo_uri: string;
}

export interface Campaign {
  id: string;
  profile: Profile;
  configuration: Configuration;
  created_at: string;
  created_by: string;
  enabled: boolean;
  label: string;
  placeId: string;
  updated_at: string;
  updated_by: string;
}

export interface GameTypeOption {
  value: GameType;
  label: string;
  color: string;
  icon: string;
}

export interface ActionTypeOption {
  value: ActionType;
  label: string;
  icon: string;
}

export interface GiftCategoryOption {
  value: GiftType;
  label: string;
}