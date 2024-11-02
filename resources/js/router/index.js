import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import AdminDashboard from "../components/AdminDashboard.vue";
import ContentGrid from "../components/ContentGrid.vue";
import ContentDetail from "../components/ContentDetail.vue";
import EditContent from "../components/EditContent.vue";
import ServiceProvider from "../services/ServiceProvider";

const routes = [
    {
        path: "/",
        component: ContentGrid,
        name: "home",
    },
    {
        path: "/login",
        component: Login,
        name: "login",
    },
    {
        path: "/admin/dashboard",
        component: AdminDashboard,
        name: "admin-dashboard",
        meta: { requiresAuth: true },
    },
    {
        path: "/content/:id",
        component: ContentDetail,
        name: "content-detail",
        props: true,
    },
    {
        path: "/admin/content/new",
        component: EditContent,
        name: "content-create",
        meta: { requiresAuth: true },
    },
    {
        path: "/admin/content/:id/edit",
        component: EditContent,
        name: "content-edit",
        props: true,
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        const isAuthenticated =
            await ServiceProvider.authService.isAuthenticated();
        if (!isAuthenticated) {
            next({
                path: "/login",
                query: { redirect: to.fullPath },
            });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
