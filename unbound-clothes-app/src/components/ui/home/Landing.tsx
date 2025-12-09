import { useEffect, useRef, useState } from "react";
import type { IProduct } from "../../../types/schemas.db";
import Carousel from "../carousel/Carousel";
import ProductCard from "../products/ProductCard";
import Styles from "./Landing.module.css";
import { shuffle } from "../../../utils/functions";
import { useNavigate } from "react-router-dom";

interface LandingProps {
  products: IProduct[];
}

const Landing: React.FC<LandingProps> = ({ products }) => {

    const navigate = useNavigate();

    const [showHero, setShowHero] = useState(JSON.parse(sessionStorage.getItem("hasSeenHero") || "true"));
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const hasSeenHero = sessionStorage.getItem("hasSeenHero");
        if (hasSeenHero) {
            setShowHero(false);
        }
    }, []);

  const handleHideHero = () => {    
    setShowHero(false);
    sessionStorage.setItem("hasSeenHero", "true");
  };

  return (
    <div className={Styles.landingWrapper}>
      {showHero 
       ? (
            <div
                className={`${Styles.heroContent} ${!showHero ? Styles.fadeOut : ""}`}
                onClick={handleHideHero}
                >
                <h1 className={Styles.heroTitle}>Unbound Collection</h1>
                <p className={Styles.heroSubtitle}>
                    Elevate your style. Define your essence.
                </p>
                <button className={Styles.heroButton}>Explore Now</button>
            </div>
        ) 
        : (

            <div className={Styles.landingContainer}>
                <div className={Styles.landingVideoWrapper}>
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className={Styles.landingVideo}
                    >
                        <source src="/videos/landing.mp4" type="video/mp4" />
                    </video>

                    <div className={Styles.videoOverlay}></div>

                    <div className={Styles.videoText}>
                        <h1 className={Styles.videoHeadline}>Unbound</h1>
                        <p className={Styles.videoSub}>Elevate your style.</p>
                        <button 
                            className={Styles.videoCTA}
                            onClick={() => navigate("/products")}
                        >Discover</button>
                    </div>
                </div>

                <div className={Styles.landingSection}>
                    <h3 className={Styles.landingSection_title}>Exclusive Collection</h3>
                    <Carousel
                        items={shuffle(products).slice(0, 12).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    />
                </div>

                <div className={Styles.landingSection}>
                    <h3 className={Styles.landingSection_title}>Our Story</h3>
                    <div className={Styles.historyContent}>
                        <p>
                        Founded with the belief that fashion should transcend boundaries, <strong>Unbound </strong> 
                        emerged as a movement — not just a brand. From its earliest collections, Unbound 
                        sought to redefine individuality, merging timeless craftsmanship with bold innovation.
                        </p>
                        <p>
                        Every piece we create is designed to empower — to inspire confidence and self-expression 
                        in those who wear it. Our collections embody freedom, authenticity, and a deep respect 
                        for sustainable design.
                        </p>
                        <p>
                        Today, Unbound continues to evolve, guided by creativity and purpose. We are more than 
                        a label — we are a community of those who dare to live <strong>without limits</strong>.
                        </p>
                    </div>
                </div>

                <div className={Styles.landingSection}>
                    <h3 className={Styles.landingSection_title}>It May Interest You</h3>
                    <Carousel
                        items={shuffle(products).slice(0, 12).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    />
                </div>
            </div>
        )}
    </div>
  );
};

export default Landing;
