import React, { PropsWithChildren, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import { login } from "./redux/reducers/loginSlice";
import { UserInfo } from "./types/types";
import Header from "./components/sharedlayout/Header";
import Footer from "./components/sharedlayout/Footer";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Profile from "./pages/Profile";
import Loginaddition from "./pages/Loginaddition";
import MainPageInd from "./pages/MainPageInd";
import FeedDetailPageCor from "./pages/FeedDetailPageCor";
import FeedDetailPageInd from "./pages/FeedDetailPageInd";
import FeedFormPageCor from "./pages/FeedFormPageCor";
import FeedFormPageInd from "./pages/FeedFormPageInd";
import Not404 from "./pages/Not404";
import MainPageCor from "./pages/MainPageCor";
import MyPage from "./pages/MyPage";
import ChangePassword from "./components/atoms/ChangePassword";
import { useDispatch } from "react-redux";
import Top from "./components/atoms/Top";
import Up from "./components/atoms/Up";
import MyPageTop from "./components/atoms/MyPageTop";
import ScrollToTop from "./components/features/ScrollToTop";
import Layout from "./components/atoms/Layout";

function App() {
  const dispatch = useDispatch();
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    const accessToken = sessionStorage.getItem("access_token");
    const userInfoString = sessionStorage.getItem("user_info");

    if (accessToken && userInfoString) {
      axios.defaults.headers.common["Authorization"] = `${accessToken}`;

      try {
        const userInfo: UserInfo = JSON.parse(userInfoString);

        dispatch(login(userInfo));
      } catch (error) {
        console.error("Error decoding user info:", error);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dispatch]);

  const showUpButton = scrollY > 100;

  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <ScrollToTop />
        <Layout>
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<MainPageInd />}></Route>
              <Route path="/store" element={<MainPageCor />}></Route>
              <Route path="/feeddetailcor" element={<FeedDetailPageCor />} />
              <Route path="/feeddetailind" element={<FeedDetailPageInd />} />
              <Route path="/feedformcor" element={<FeedFormPageCor />} />
              <Route path="/feedformind" element={<FeedFormPageInd />} />
              <Route path="/mypage/:page" element={<MyPage />} />
              <Route path="/login" element={<LoginPage />}></Route>
              <Route path="/signup" element={<SignupPage />}></Route>
              <Route path="/loginaddition" element={<Loginaddition />} />
              <Route path="/profile" element={<Profile />}></Route>
              <Route path="*" element={<Not404 />} />
            </Routes>
          </main>
        </Layout>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
