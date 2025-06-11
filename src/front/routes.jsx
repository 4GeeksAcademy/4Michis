import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { RegisterForm } from "./pages/RegisterForm";
import { LoginForm } from "./components/LoginForm";
import { PrivateRoute } from './components/PrivateRoute';
import { Profile } from './pages/Profile';
import CatProfilePage from "./pages/CatProfilePage";
import { CatGallery } from "./components/CatGallery";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      <Route index element={<Home />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/private" element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      } />
      <Route path="/" element={<CatGallery />} />
      <Route path="/cat/:catId" element={<CatProfilePage />} />  {/* Ruta para el perfil del gato */}
    </Route>
  ),
  {
    future: {
      v7_relativeSplatPath: true,
      v7_startTransition: true,
    },
  }
);