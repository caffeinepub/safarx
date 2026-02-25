import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import HeaderWithAdmin from '@/components/HeaderWithAdmin';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Destinations from '@/pages/Destinations';
import DestinationDetail from '@/pages/DestinationDetail';
import Contact from '@/pages/Contact';
import PlanTrip from '@/pages/PlanTrip';
import Packages from '@/pages/Packages';
import Admin from '@/pages/Admin';
import AdminLogin from '@/pages/AdminLogin';
import Community from '@/pages/Community';

// Root layout with Header and Footer
function RootLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            <HeaderWithAdmin />
            <div className="flex-1">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}

// Routes
const rootRoute = createRootRoute({
    component: RootLayout,
});

const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: Home,
});

const destinationsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/destinations',
    component: Destinations,
});

const destinationDetailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/destinations/$id',
    component: DestinationDetail,
});

const planTripRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/plan',
    component: PlanTrip,
});

const packagesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/packages',
    component: Packages,
});

const contactRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/contact',
    component: Contact,
    validateSearch: (search: Record<string, unknown>): { destination?: string } => ({
        destination: typeof search.destination === 'string' ? search.destination : undefined,
    }),
});

const adminRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/admin',
    component: Admin,
});

const adminLoginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/admin/login',
    component: AdminLogin,
});

const communityRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/community',
    component: Community,
});

const routeTree = rootRoute.addChildren([
    homeRoute,
    destinationsRoute,
    destinationDetailRoute,
    planTripRoute,
    packagesRoute,
    contactRoute,
    adminRoute,
    adminLoginRoute,
    communityRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

export default function App() {
    return <RouterProvider router={router} />;
}
