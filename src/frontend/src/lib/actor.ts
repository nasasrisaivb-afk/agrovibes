import { useActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";

/** Shared canister actor. All backend hooks go through this. */
export function useBackendActor() {
  const { actor, isFetching } = useActor(createActor);
  return { actor, actorReady: !!actor && !isFetching };
}
