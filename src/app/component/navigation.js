"use client";
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from "react";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className=''>
      <nav className="nav p-4 fixed w-full z-50 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          {/* โลโก้ที่เปลี่ยนตามขนาดหน้าจอ */}
          <Link href={"/"}>
          <div>
            {/* โลโก้สำหรับหน้าจอใหญ่ */}
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={190}
              height={190}
              className="hidden md:block"
            />
            {/* ไอคอนสำหรับหน้าจอมือถือ */}
            <Image
              src="/images/logo.png"
              alt="Icon"
              width={180}
              height={180}
              className="md:hidden"
            />
          </div>
          </Link>

          {/* <div className="hidden md:flex space-x-12">
            <Link href="/price" className="hover:text-gray-500">แพคเกจ</Link>
            <a href="#" className="hover:text-gray-500">วิธีใช้งาน</a>
            <a href="#" className="hover:text-gray-500">ติดต่อเรา</a>
          </div> */}

          {/* ปุ่มทางขวาสุด */}
          <div className="flex items-center space-x-3">
            {/* ไอคอนโปรไฟล์ (แสดงในมือถือเท่านั้น) */}
            <Link href="/login" className="md:hidden p-2 rounded-full transition duration-300 hover:bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600 hover:text-gray-800 transition duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>

            {/* ปุ่มในคอม (ซ่อนในมือถือ) */}
            <Link href="/login" className="hidden md:block btn-secondary">
              เข้าสู่ระบบ
            </Link>
            <Link href="/register" className="hidden md:block btn-primary">
              เริ่มต้นใช้งาน
            </Link>

            {/* <button onClick={toggleMenu} className="p-2 rounded-full transition duration-300 hover:bg-gray-200 md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600 hover:text-gray-800 transition duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button> */}
          </div>
        </div>

        {/* {isMenuOpen && (
          <div className="md:hidden mt-4">
            <a href="#" className="block py-2 hover:bg-gray-800">แพคเกจ</a>
            <a href="#" className="block py-2 hover:bg-gray-800">วิธีใช้งาน</a>
            <a href="#" className="block py-2 hover:bg-gray-800">ติดต่อเรา</a>
          </div>
        )} */}
        
      </nav>
    </div>
  );
};
