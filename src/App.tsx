import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { Navbar } from "./Components/Navbars";
import { SideBar } from "./Components/SideBar";
import { Youtube } from "./Components/Tabs/Youtube";
import { Auth } from "./Components/Auth";
import { Intro } from "./Components/Intro";
import { Recent } from "./Components/Tabs/Recent";

function App() {
  const token = localStorage.getItem("token");

  return (
    <>
      <RecoilRoot>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={token ? <Recent /> : <Intro />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/Recent" element={token ? <Recent /> : <Auth />} />
              <Route path="/Youtube" element={token ? <Youtube /> : <Auth />} />
              
            </Route>
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </>
  );
}

function Layout() {
  const token = localStorage.getItem("token");
  return (
    <div className="h-full w-full flex flex-col">
      {token ? (
        <>
          <Navbar />
          <div className="flex flex-1">
            <SideBar />
            <div className="flex-1">
              <Outlet />
            </div>
          </div>
        </>
      ) : (
        <>
          <Navbar />
          <div className="flex-1">
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
