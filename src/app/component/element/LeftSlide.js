"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";

const LeftSlide = () => {
  const banners = [
    { id: 1, image: "/upload/banner-1.webp", alt: "Banner 1" },
    { id: 2, image: "/upload/banner-2.webp", alt: "Banner 2" },
    { id: 3, image: "/upload/banner-3.webp", alt: "Banner 3" },
  ];

  return (
    <div className="w-full h-full py-7 px-7 relative">
      <Swiper
        spaceBetween={20}  // กำหนดระยะห่างระหว่างสไลด์
        slidesPerView={2}  // แสดงสไลด์ทีละ 2 รูป
        slidesPerGroup={2}  // สไลด์ทีละ 2 รูป
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="h-full w-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <Image
              src={banner.image}
              alt={banner.alt}
              width={1200}
              height={500}
              className="w-full h-full object-cover rounded-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination */}
      <div className="custom-pagination absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2"></div>
    </div>
  );
};

export default LeftSlide;
