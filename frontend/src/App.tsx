import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
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
import { ShareBrain, ShareHome } from "./Components/Tabs/ShareBrain";

function App() {
  const token = localStorage.getItem("tokenBB");

  return (
    <RecoilRoot>
      <ToastProvider />
      <BrowserRouter>
        <Routes>
          <Route path="/share/brain/show/:hash" element={<ShareBrain />}>
            <Route index element={<ShareHome/>} />
            <Route path="Youtube" element={<Youtube isShare={true}/>} />
            <Route path="Twitter" element={<Twitter isShare={true}/>} />
            <Route path="Linkedin" element={<Linkedin isShare={true}/>} />
            <Route path="Notion" element={<Notion isShare={true}/>} />
            <Route path="Github" element={<Github isShare={true}/>} />
            <Route path="Aichat" element={<Aichat isShare={true}/>} />
            <Route path="Random" element={<Random isShare={true}/>} />
            <Route path="Notes" element={<Notes isShare={true}/>} />
          </Route>
          <Route path="/" element={<Layout />}>
            <Route index element={token ? <Recent /> : <Intro />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/Recent" element={token ? <Recent /> : <Auth />} />
            <Route path="/Youtube" element={token ? <Youtube isShare={false}/> : <Auth />} />
            <Route path="/Twitter" element={token ? <Twitter isShare={false}/> : <Auth />} />
            <Route path="/Linkedin" element={token ? <Linkedin isShare={false}/> : <Auth />} />
            <Route path="/Notion" element={token ? <Notion isShare={false}/> : <Auth />} />
            <Route path="/Github" element={token ? <Github isShare={false}/> : <Auth />} />
            <Route path="/Aichat" element={token ? <Aichat isShare={false}/> : <Auth />} />
            <Route path="/Random" element={token ? <Random isShare={false}/> : <Auth />} />
            <Route path="/Notes" element={token ? <Notes isShare={false}/> : <Auth />} />
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
            <Navbar closeDropDown={false} />
            <Header />
          </div>
          <div className="flex flex-1 overflow-hidden">
            <div className="w-50 min-h-screen overflow-hidden">
              <SideBar isShare={false} />
            </div>
            <div className="flex-1 h-full overflow-y-auto transition-all duration-300">
              <div>
                <Outlet />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="h-16">
            <Navbar closeDropDown={false} />
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
