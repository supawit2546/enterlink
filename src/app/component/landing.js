"use client"; // ถ้าใช้ใน Next.js 13+ App Router

import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const LandingPage = () => {
    const [username, setUsername] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (username) {
            localStorage.setItem("username", username);
        }
    }, [username]);

    const handleCreate = () => {
        if (username) {
            localStorage.setItem('businessName', username);
            router.push('/register');
        }
    };

    return (
        <div className="bg-fixed">
            <div className="
    min-h-screen flex flex-col lg:flex-row
    justify-center lg:justify-between
    lg:items-center
    pt-20
    container overflow-hidden
  ">

                {/* TEXT */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <div className="flex items-center h-full justify-center">
                        <div className="text-center lg:text-start">
                            <h1 className="text-4xl lg:text-6xl font-medium leading-tight lg:leading-none">
                                รวมลิ้งค์ทุกช่องทาง
                            </h1>

                            <h2 className="text-xl lg:text-3xl mt-5">
                                ลดความซับซ้อนให้ธุรกิจของคุณ
                            </h2>

                            <div className="flex justify-center lg:justify-start mt-5">
                                <div className="flex items-center border border-gray-300 rounded-xl bg-white w-72 md:w-11/12 h-14 md:h-16 p-1">
                                    <span className="md:ml-7 ml-5 text-black md:text-xl hidden md:block">enterlink.co/</span>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="ชื่อธุรกิจของคุณ"
                                        className="md:ml-0 ml-5 flex-1 px-0 md:px-2 md:text-xl text-orange-600 outline-none bg-transparent w-16"
                                    />
                                    <button
                                        className="btn-primary text-white px-4 py-1 m-2 text-lg hidden md:block"
                                        onClick={handleCreate}
                                    >
                                        สร้างเลย
                                    </button>
                                    <button
                                        className="btn-primary text-white text-sm block md:hidden mr-2"
                                        onClick={handleCreate}
                                    >
                                        สร้างเลย
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* IMAGE */}
                <div className="mt-8 lg:mt-0 flex items-center justify-center">
  <motion.div
    className="
      mx-auto
      lg:ml-auto lg:pr-4
      min-w-[450px] max-w-[900px] w-full
    "
  >
    {/* MOBILE IMAGE */}
    <Image
      src="/images/phone-mb.png"
      alt=""
      width={1300}
      height={1300}
      quality={100}
      className="w-full h-auto block lg:hidden"
    />

    {/* DESKTOP IMAGE */}
    <Image
      src="/images/phone.webp"
      alt=""
      width={1300}
      height={1300}
      quality={100}
      className="w-full h-auto hidden lg:block"
    />
  </motion.div>
</div>


            </div>
        </div>


    );
};
