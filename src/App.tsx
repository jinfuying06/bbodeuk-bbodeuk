import { Navigate, Route, Routes } from "react-router-dom";
import Care from "./pages/Care";
import CareAction from "./pages/CareAction";
import History from "./pages/History";
import Home from "./pages/Home";
import HomeStateDemo from "./pages/HomeStateDemo";
import QuickRecord from "./pages/QuickRecord";
import Settings from "./pages/Settings";
import Setup from "./pages/Setup";
import Spaces from "./pages/Spaces";
import WeekendBigClean from "./pages/WeekendBigClean";
import SamplePaint from "./pages/SamplePaint";
import Welcome from "./pages/Welcome";

function RootEntry() {
  return <Welcome />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootEntry />} />
      <Route path="/home" element={<Home />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/sample-paint" element={<SamplePaint />} />
      <Route path="/setup" element={<Setup />} />
      <Route path="/home/:state" element={<HomeStateDemo />} />
      <Route path="/spaces" element={<Spaces />} />
      <Route path="/quick-record" element={<QuickRecord />} />
      <Route path="/deep-clean" element={<WeekendBigClean />} />
      <Route path="/weekend-bigclean" element={<WeekendBigClean />} />
      <Route path="/care-action" element={<CareAction />} />
      <Route path="/care" element={<Care />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/history" element={<History />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
