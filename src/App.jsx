import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { LoadingState } from './components/ui/StatusState';
import HomePage from './pages/home/HomePage';

// Halaman yang memuat peta (Leaflet) dipisah agar beranda tetap ringan.
const InformasiCuaca = lazy(() =>
  import('./pages/informasi-cuaca/InformasiCuaca')
);
const InformasiGempa = lazy(() =>
  import('./pages/informasi-gempa/InformasiGempa')
);
const PeringatanDini = lazy(() =>
  import('./pages/peringatan-dini/PeringatanDini')
);

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingState />}>
        <Routes>
          <Route element={<Layout />}>
            <Route
              path="/"
              element={<HomePage />}
            />
            <Route
              path="/informasi-gempa"
              element={<InformasiGempa />}
            />
            <Route
              path="/informasi-cuaca"
              element={<InformasiCuaca />}
            />
            <Route
              path="/peringatan-dini"
              element={<PeringatanDini />}
            />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
