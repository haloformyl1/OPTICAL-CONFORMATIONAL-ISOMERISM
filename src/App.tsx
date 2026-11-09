import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AppErrorBoundary, LoadingState } from './components/ui/States';
import { useStore } from './store/useStore';
import { Capacitor } from '@capacitor/core';

const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const Learn = lazy(() => import('./pages/Learn').then((m) => ({ default: m.Learn })));
const ModuleView = lazy(() => import('./pages/ModuleView').then((m) => ({ default: m.ModuleView })));
const Lab = lazy(() => import('./pages/Lab').then((m) => ({ default: m.Lab })));
const Examples = lazy(() => import('./pages/Examples').then((m) => ({ default: m.Examples })));
const Exceptions = lazy(() => import('./pages/Exceptions').then((m) => ({ default: m.Exceptions })));
const Practice = lazy(() => import('./pages/Practice').then((m) => ({ default: m.Practice })));
const Progress = lazy(() => import('./pages/Progress').then((m) => ({ default: m.Progress })));

function App() {
  const reducedMotion = useStore((state) => state.reducedMotion);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.dataset.theme = 'dark';
  }, []);

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = reducedMotion ? 'true' : 'false';
  }, [reducedMotion]);

  const routerBasename = Capacitor.isNativePlatform() ? '' : import.meta.env.DEV ? '' : '/OPTICAL-CONFORMATIONAL-ISOMERISM/';

  return (
    <BrowserRouter basename={routerBasename}>
      <AppErrorBoundary>
        <Suspense fallback={<LoadingState />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="learn" element={<Learn />} />
              <Route path="learn/:id" element={<ModuleView />} />
              <Route path="lab" element={<Lab />} />
              <Route path="examples" element={<Examples />} />
              <Route path="exceptions" element={<Exceptions />} />
              <Route path="practice" element={<Practice />} />
              <Route path="progress" element={<Progress />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AppErrorBoundary>
    </BrowserRouter>
  );
}

export default App;

