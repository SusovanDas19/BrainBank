import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { Navbar } from "./Components/Navbars";
import { SideBar } from "./Components/SideBar";
import { Youtube } from "./Components/Tabs/Youtube";
import { Auth } from "./Components/Auth";
import { Intro } from "./Components/Intro";
import { Recent } from "./Components/Tabs/Recent";
import "./App.css";
import { ToastProvider } from "./Components/UI/ToastProvider";
import { Header } from "./Components/Header";
import { Twitter } from "./Components/Tabs/Twitter";
import { Linkedin } from "./Components/Tabs/Linkedin";
import { Notion } from "./Components/Tabs/Notion";
import { Github } from "./Components/Tabs/Github";
import { Aichat } from "./Components/Tabs/Aichat";
import { Random } from "./Components/Tabs/Random";
import { Notes } from "./Components/Tabs/Notes";

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
              <Route path="/Notion" element={token ? <Notion /> : <Auth />} />
              <Route path="/Github" element={token ? <Github /> : <Auth />} />
              <Route path="/Aichat" element={token ? <Aichat /> : <Auth />} />
              <Route path="/Random" element={token ? <Random /> : <Auth />} />
              <Route path="/Notes" element={token ? <Notes /> : <Auth />} />
            </Route>
          </Routes>
        </BrowserRouter>
      
    </RecoilRoot>
  );
}

function Layout() {
  const token = localStorage.getItem("tokenBB");

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
              <div >
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
