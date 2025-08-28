import Navbar from "./layout/Navbar";
import TabNavigation from "./layout/TabNavigation";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="h-screen bg-black flex flex-col">
      <Navbar />
      <main className="flex-1 flex">
        <TabNavigation />
        <Outlet />
      </main>
    </div>
  );
}
