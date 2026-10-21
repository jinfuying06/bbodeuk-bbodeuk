import { useEffect } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { AX_ONBOARDING_ENABLED, AXOnboardingFlow } from "./features/ax-onboarding";
import { getSession } from "./data/session";
import { hasCompletedSetup } from "./data/setup";
import Care from "./pages/Care";
import CareAction from "./pages/CareAction";
import Help from "./pages/Help";
import History from "./pages/History";
import Home from "./pages/Home";
import HomeStateDemo from "./pages/HomeStateDemo";
import ItemAdd from "./pages/ItemAdd";
import ItemHistory from "./pages/ItemHistory";
import ItemInfo from "./pages/ItemInfo";
import Login from "./pages/Login";
import QuickRecord from "./pages/QuickRecord";
import RecordDone from "./pages/RecordDone";
import Settings from "./pages/Settings";
import Setup from "./pages/Setup";
import SpaceAdded from "./pages/SpaceAdded";
import SpaceInfo from "./pages/SpaceInfo";
import SpaceManage from "./pages/SpaceManage";
import Spaces from "./pages/Spaces";
import WeekendBigClean from "./pages/WeekendBigClean";
import SamplePaint from "./pages/SamplePaint";
import Welcome from "./pages/Welcome";

// The app always starts at Login; an active session (this tab only) skips it.
function RootEntry() {
  if (!getSession()) return <Login />;
  return <Navigate to={hasCompletedSetup() ? "/home" : "/welcome"} replace />;
}

// Every app route needs a session; without one, back to the start screen. The query (e.g. Toss ?payment=) only matters with a session, which survives same-tab redirects.
function RequireSession() {
  return getSession() ? <Outlet /> : <Navigate to="/" replace />;
}

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<RootEntry />} />
      <Route path="/login" element={<RootEntry />} />
      <Route path="/signup" element={<Navigate to="/?tab=signup" replace />} />
      <Route element={<RequireSession />}>
        <Route path="/home" element={<Home />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/setup" element={<Setup />} />
        {AX_ONBOARDING_ENABLED ? <Route path="/setup/photo" element={<AXOnboardingFlow />} /> : null}
        <Route path="/item-add" element={<ItemAdd />} />
        <Route path="/item-history" element={<ItemHistory />} />
        <Route path="/item-info" element={<ItemInfo />} />
        <Route path="/space-info" element={<SpaceInfo />} />
        <Route path="/space-manage" element={<SpaceManage />} />
        <Route path="/space-added" element={<SpaceAdded />} />
        <Route path="/spaces" element={<Spaces />} />
        <Route path="/quick-record" element={<QuickRecord />} />
        <Route path="/record-done" element={<RecordDone />} />
        <Route path="/deep-clean" element={<WeekendBigClean />} />
        <Route path="/weekend-bigclean" element={<WeekendBigClean />} />
        <Route path="/care-action" element={<CareAction />} />
        <Route path="/care" element={<Care />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/history" element={<History />} />
        <Route path="/help" element={<Help />} />
      </Route>
      {/* Figma state / paint demos — dev server only. */}
      {import.meta.env.DEV ? <Route path="/home/:state" element={<HomeStateDemo />} /> : null}
      {import.meta.env.DEV ? <Route path="/sample-paint" element={<SamplePaint />} /> : null}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
