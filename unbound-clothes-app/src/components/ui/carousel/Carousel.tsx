// Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Styles from "./Carousel.module.css";
import useAuth from "../../../hooks/useAuth";
import { useAppDispatch } from "../../../hooks/redux";
import { useEffect } from "react";
import { syncFavorites } from "../../../store/slices/userSlice";

interface CarouselProps {
  items: React.ReactNode[];
}

const Carousel: React.FC<CarouselProps> = ({ items }) => {

  const { user } = useAuth();
  const dispatch = useAppDispatch();
  useEffect(() => {
    return () => { // ComponentWillUnmount
      if (!user) return;
      if (user.role === "USER") dispatch(syncFavorites(user.id));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={16}              // space between items
      slidesPerView={1}              // visible items by default
      navigation                      // buttons prev/next
      pagination={{ clickable: true }} // bullets
      breakpoints={{                  // responsive
        780: { slidesPerView: 2 },
        1200: { slidesPerView: 3 }
      }}
      observer={true}                 // lazy loading
      observeParents={true}           
      observeSlideChildren={true}
      className={Styles.swiperContainer} // styles
    >
      {items.map((item, index) => (
        <SwiperSlide key={index} className={Styles.swiperSlide}>
          {item}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Carousel;
