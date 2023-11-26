import ScrollToTop from "@/utils/scroll_top";
import Breadcrumbs from "./Component/Breadcrumbs";
import Title from "./Component/Title/Title";
import Newest from "./Component/Newest";
import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import LoadingPage from "@/utils/loadingPage";

export const Blog = () => {
  return (
    <div>
      <ScrollToTop />
      <Breadcrumbs></Breadcrumbs>
      <div className="mx-[6rem] flex justify-center gap-4">
        <div className="max-sm:hidden md:w-3/12">
          <Newest></Newest>
        </div>
        <div className="md:w-9/12">
          <Suspense fallback={<LoadingPage />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
};