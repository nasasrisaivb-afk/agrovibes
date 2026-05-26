import { useAccessibilityContext } from "../context/AccessibilityContext";

export function useAccessibility() {
  return useAccessibilityContext();
}
