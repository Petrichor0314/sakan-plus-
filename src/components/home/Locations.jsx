import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";

export default function Locations() {
  const locationsRef = useRef(null);
  const locationsInView = useInView(locationsRef, { once: true });
  const navigate = useNavigate();

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const locations = [
    {
      name: "Casablanca",
      region: "Casablanca-Settat",
      city: "Casablanca",
      properties: 15,
      image: "/locations/casablanca.jpg",
    },
    {
      name: "Rabat",
      region: "Rabat-Salé-Kénitra",
      city: "Rabat",
      properties: 12,
      image: "/locations/rabat.jpg",
    },
    {
      name: "Marrakech",
      region: "Marrakech-Safi",
      city: "Marrakech",
      properties: 18,
      image: "/locations/marrakech.jpg",
    },
    {
      name: "Tangier",
      region: "Tanger-Tétouan-Al Hoceïma",
      city: "Tangier",
      properties: 10,
      image: "/locations/tangier.jpg",
    },
    {
      name: "Agadir",
      region: "Souss-Massa",
      city: "Agadir",
      properties: 8,
      image: "/locations/agadir.jpg",
    },
    {
      name: "Fez",
      region: "Fès-Meknès",
      city: "Fez",
      properties: 9,
      image: "/locations/fez.jpg",
    },
  ];

  const handleLocationClick = (location) => {
    const params = new URLSearchParams();
    params.append("region", location.region);
    if (location.city) {
      params.append("city", location.city);
    }
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <motion.section
      ref={locationsRef}
      initial="hidden"
      animate={locationsInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className="py-16 bg-white overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-blue-600 text-sm font-medium uppercase tracking-wider">
            EXPLORE CITIES
          </span>
          <h2 className="text-2xl font-bold mt-2">Our Location For You</h2>
        </div>

        <Swiper
          modules={[Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          pagination={{
            clickable: true,
            el: ".swiper-pagination",
            bulletActiveClass: "swiper-pagination-bullet-active",
            bulletClass: "swiper-pagination-bullet",
            renderBullet: function (index, className) {
              return (
                '<span class="' +
                className +
                " bg-gray-300 hover:bg-blue-600 w-3 h-3 rounded-full inline-block mx-1 cursor-pointer transition-colors duration-300 " +
                (className.includes("active") ? "!bg-blue-600" : "") +
                '"></span>'
              );
            },
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 6,
            },
          }}
          className="pb-16"
        >
          {locations.map((location) => (
            <SwiperSlide key={location.name}>
              <div
                className="relative h-[360px] rounded-3xl overflow-hidden cursor-pointer"
                onClick={() => handleLocationClick(location)}
              >
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover"
                />

                <div className="absolute left-4 right-4 bottom-4 bg-white rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">
                        {location.properties} Properties
                      </p>
                      <h3 className="text-gray-900 font-semibold">
                        {location.name}
                      </h3>
                    </div>
                    <button className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-blue-600 transition-colors duration-300">
                      <ArrowRight className="w-4 h-4 text-gray-600 hover:text-white transition-colors duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="swiper-pagination mt-12"></div>
        </Swiper>
      </div>
    </motion.section>
  );
}
