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

// Root layout with Header and Footer (for public routes)
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

// Bare layout for admin routes (no header, no footer)
function AdminLayout() {
    return <Outlet />;
}

// Root route (no layout of its own — children pick their layout)
const rootRoute = createRootRoute({
    component: () => <Outlet />,
});

// Public layout route
const publicLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'public-layout',
    component: RootLayout,
});

// Admin layout route (no header/footer)
const adminLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'admin-layout',
    component: AdminLayout,
});

// Public routes
const homeRoute = createRoute({
    getParentRoute: () => publicLayoutRoute,
    path: '/',
    component: Home,
});

const destinationsRoute = createRoute({
    getParentRoute: () => publicLayoutRoute,
    path: '/destinations',
    component: Destinations,
});

const destinationDetailRoute = createRoute({
    getParentRoute: () => publicLayoutRoute,
    path: '/destinations/$id',
    component: DestinationDetail,
});

const planTripRoute = createRoute({
    getParentRoute: () => publicLayoutRoute,
    path: '/plan',
    component: PlanTrip,
});

const packagesRoute = createRoute({
    getParentRoute: () => publicLayoutRoute,
    path: '/packages',
    component: Packages,
});

const contactRoute = createRoute({
    getParentRoute: () => publicLayoutRoute,
    path: '/contact',
    component: Contact,
    validateSearch: (search: Record<string, unknown>): { destination?: string } => ({
        destination: typeof search.destination === 'string' ? search.destination : undefined,
    }),
});

const communityRoute = createRoute({
    getParentRoute: () => publicLayoutRoute,
    path: '/community',
    component: Community,
});

// Admin routes (no header/footer)
const adminRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: '/admin',
    component: Admin,
});

const adminLoginRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: '/admin/login',
    component: AdminLogin,
});

const routeTree = rootRoute.addChildren([
    publicLayoutRoute.addChildren([
        homeRoute,
        destinationsRoute,
        destinationDetailRoute,
        planTripRoute,
        packagesRoute,
        contactRoute,
        communityRoute,
    ]),
    adminLayoutRoute.addChildren([
        adminRoute,
        adminLoginRoute,
    ]),
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
