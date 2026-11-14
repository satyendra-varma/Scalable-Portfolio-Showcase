import { lazy, Suspense, type ReactNode } from 'react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import HomePage from '@/pages/home';
import NotFound from '@/pages/not-found';
import {
  Redirect,
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

// The home page is the Power-on room and loads eagerly: it is the first paint. The earlier room and the comparison
// pages load on demand. None of them is linked from anywhere, and each marks itself noindex.
const fallback = <div style={{ minHeight: '100dvh', background: '#05080c' }} />;

const RoomOriginal = lazy(() => import('@/pages/room-original'));
const originalPage = (
  <Suspense fallback={fallback}>
    <RoomOriginal />
  </Suspense>
);

const RoomConcepts = lazy(() => import('@/pages/room-concepts'));
const conceptsPage = (
  <Suspense fallback={fallback}>
    <RoomConcepts />
  </Suspense>
);

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/room-original">{originalPage}</Route>
        <Route path="/room-concepts">{conceptsPage}</Route>
        <Route path="/room-concepts/:id">{conceptsPage}</Route>
        <Route path="/room-concepts/:id/:accent">{conceptsPage}</Route>
        {/* An old bookmark lands on the home page; any query is dropped. */}
        <Route path="/room-motion">
          <Redirect to="/" replace />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <TooltipProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Router />
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
