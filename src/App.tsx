import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import QuickRecord from "./pages/QuickRecord";
import WeekendBigClean from "./pages/WeekendBigClean";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/quick-record" element={<QuickRecord />} />
      <Route path="/weekend-bigclean" element={<WeekendBigClean />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
