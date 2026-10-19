import XiaomiProductsSection from "../components/XiaomiProductsSection";
//import ThinImageBanner from "../components/ThinImageBanner";
//import HijabSection from "../components/HijabSection";
import { HeroSlider } from '../components/home/HeroSlider';
import CategoryAndBanner from "../components/CategoryAndBanner";
import WatchAndShop from "../components/WatchAndShop";



export default function Home() {
  return (
    <div>
      <HeroSlider />
      <CategoryAndBanner />
      <XiaomiProductsSection />
     
      <WatchAndShop />
     
    </div>
  )
}
