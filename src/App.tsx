import { Navigate, Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import AboutPage from "./pages/AboutPage"
import FavoritesPage from "./pages/FavoritesPage"
import HomePage from "./pages/HomePage"
import ToolPage from "./pages/ToolPage"
import ToolsPage from "./pages/ToolsPage"

export default function App() {
  return <Routes>
    <Route element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="tools" element={<ToolsPage />} />
      <Route path="tools/:id" element={<ToolPage />} />
      <Route path="favorites" element={<FavoritesPage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
}
