import { Outlet, useRouterState } from "@tanstack/react-router";
import { useAccessibility } from "../../hooks/useAccessibility";
import { CartDrawer } from "../overlays/CartDrawer";
import { TrustExplainerModal } from "../overlays/TrustExplainerModal";
import { VideoTutorialOverlay } from "../overlays/VideoTutorialOverlay";
import { BottomTabBar } from "./BottomTabBar";
import { FloatingActionButton } from "./FloatingActionButton";
import { GlobalTopBar } from "./GlobalTopBar";

export function Layout() {
  const { isHighContrast } = useAccessibility();

  return (
    <div
      className={`flex flex-col min-h-screen bg-background ${isHighContrast ? "contrast-more" : ""}`}
      data-ocid="app-layout"
    >
      <GlobalTopBar />
      <main
        className="flex-1 overflow-y-auto pt-14 pb-20 lg:pb-0"
        data-ocid="main-content"
      >
        <Outlet />
      </main>
      <FloatingActionButton />
      <BottomTabBar />
      <CartDrawer />
      <TrustExplainerModal />
      <VideoTutorialOverlay />
    </div>
  );
}
