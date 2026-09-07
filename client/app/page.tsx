import Header from "./component/Header";
import Footer from "./component/Footer";
import LandingPage from "./Landing/LandingPage";

export default function Home() {
  return (
    <div className="page-container">
      <Header />
      <LandingPage />
      <Footer />
    </div>
  );
}