import React, { lazy } from "react";
import { useRoutes } from "react-router-dom";
import Places from "../pages/places";
import SearchInfo from "../pages/searchInfo";
import UserMangementPage from "../pages/user-mangement/user-mangement";
const PlaceDetail = lazy(() => import("../pages/placeDetail"));
const HomeLayout = lazy(() => import("../layouts/HomeLayout"));
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const Home = lazy(() => import("../pages/home"));

export default function Routes() {
  const routing = useRoutes([
    {
      path: "/",
      element: <HomeLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/s/:searchId",
          element: <searchInfo />,
        },
        {
          path: "/places",
          element: <Places />,
        },
        {
          path: "/placedetail/:detailId",
          element: <PlaceDetail />,
        },
      ],
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        {
          path: "/admin/user",
          element: <UserMangementPage />,
        },
      ],
    },
  ]);

  return routing;
}
