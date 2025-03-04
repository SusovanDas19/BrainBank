import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { RecoilRoot, useRecoilValue } from "recoil";
import { Navbar } from "./Components/Navbars";
import { SideBar } from "./Components/SideBar";
import { Youtube } from "./Components/Tabs/Youtube";
import { Auth } from "./Components/Auth";
import { Intro } from "./Components/Intro";
import { Recent } from "./Components/Tabs/Recent";
import "./App.css";
import { ToastProvider } from "./Components/UI/ToastProvider";
import { Header } from "./Components/Header";
import { showFormState } from "./store/atoms/formAtom";
import { Twitter } from "./Components/Tabs/Twitter";
import { Linkedin } from "./Components/Tabs/LinkedIn";

function App() {
  const token = localStorage.getItem("tokenBB");

  return (
    <RecoilRoot>
        <ToastProvider/>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={token ? <Recent /> : <Intro />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/Recent" element={token ? <Recent /> : <Auth />} />
              <Route path="/Youtube" element={token ? <Youtube /> : <Auth />} />
              <Route path="/Twitter" element={token ? <Twitter /> : <Auth />} />
              <Route path="/Linkedin" element={token ? <Linkedin /> : <Auth />} />
            </Route>
          </Routes>
        </BrowserRouter>
      
    </RecoilRoot>
  );
}

function Layout() {
  const token = localStorage.getItem("tokenBB");
  const showForm = useRecoilValue(showFormState);

  return (
    <div className="h-full w-full flex flex-col">
      {token ? (
        <>
          <div>
            <Navbar />
            <Header />
          </div>
          <div className="flex flex-1 overflow-hidden">
            <div className="w-50 min-h-screen overflow-hidden">
              <SideBar />
            </div>
            <div className="flex-1 h-full overflow-y-auto transition-all duration-300">
              <div className={`${showForm ? "filter blur-sm" : ""}`}>
                <Outlet />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="h-16">
            <Navbar />
          </div>
          <div className="flex-1">
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
