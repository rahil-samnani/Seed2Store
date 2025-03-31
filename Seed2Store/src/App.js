import "./output.css";
import Navbar from './components/navbar';
import Home from './components/Home';
import CreatePost from './components/createPost';
import Login from "./components/login";
import Signup from "./components/signup";
import Profile from "./components/profile";
import Dashboard from "./components/dashboard";
import AcceptedBids from "./components/Acceptedbids";
import ForgotPassword from "./components/ForgotPassword";
import Chat from "./components/Chat";
import { Route, Routes, useLocation } from "react-router-dom";
import Aboutus from "./components/Aboutus";
import Contactus from "./components/Contactus";
import SearchResults from "./components/SearchResults";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/signup", "/forgotpassword"];

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.25, ease: "easeIn" } },
    exit: { opacity: 0, transition: { duration: 0.21, ease: "anticipate" } },
  };

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

      {/* Prevent Layout Shift */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
        >
          <Routes location={location} key={location.pathname}>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/createpost" element={<CreatePost />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/profile/:name" element={<Profile />} />
            <Route exact path="/dashboard/:name" element={<Dashboard />} />
            <Route exact path="/acceptedbids/:name" element={<AcceptedBids />} />
            <Route exact path="/chat" element={<Chat userId={localStorage.getItem("userId")} />} />
            <Route exact path="/forgotpassword" element={<ForgotPassword />} />
            <Route exact path="/aboutus" element={<Aboutus />} />
            <Route exact path="/contactus" element={<Contactus />} />
            <Route exact path="/search" element={<SearchResults />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default App;
