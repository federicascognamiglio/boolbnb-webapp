import { BrowserRouter, Route, Routes } from "react-router-dom"
import HouseDetailPage from "./pages/HouseDetailPage";
import CreateHousePage from "./pages/CreateHousePage";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import AppLayout from "./layouts/AppLayout";
import { AlertProvider } from "./context/AlertContext";
import NotFoundPage from "./pages/NotFoundPage";

function App() {

  return (
    <>
      <AlertProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/detail/:slug" element={<HouseDetailPage />} />
              <Route path="/create" element={<CreateHousePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AlertProvider>
    </>
  )
}

export default App
