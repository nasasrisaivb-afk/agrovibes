// Onboarding draft persisted per phone number so a network drop mid-flow
// resumes exactly where the user left off instead of restarting.
export interface OnboardingDraft {
  step: "role" | "profile";
  role: "BUYER" | "SELLER" | null;
  name: string;
  deliveryLocation: string;
  businessType: "INDIVIDUAL" | "REGISTERED";
  primaryCategoryId: string | null; // stringified bigint
}

export const EMPTY_DRAFT: OnboardingDraft = {
  step: "role",
  role: null,
  name: "",
  deliveryLocation: "",
  businessType: "INDIVIDUAL",
  primaryCategoryId: null,
};

const keyFor = (phone: string) => `cropvibe-onboarding-${phone}`;

export function loadDraft(phone: string): OnboardingDraft {
  try {
    const raw = localStorage.getItem(keyFor(phone));
    if (!raw) return EMPTY_DRAFT;
    return { ...EMPTY_DRAFT, ...(JSON.parse(raw) as Partial<OnboardingDraft>) };
  } catch {
    return EMPTY_DRAFT;
  }
}

export function saveDraft(phone: string, draft: OnboardingDraft) {
  try {
    localStorage.setItem(keyFor(phone), JSON.stringify(draft));
  } catch {
    // Storage unavailable — the flow still works, it just won't resume.
  }
}

export function clearDraft(phone: string) {
  try {
    localStorage.removeItem(keyFor(phone));
  } catch {
    // ignore
  }
}
