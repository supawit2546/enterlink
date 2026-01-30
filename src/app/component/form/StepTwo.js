"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";


const StepTwo = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contactId, setContactId] = useState(null); // State สำหรับ contact ID
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleImageUpload = (event, setImage, setFile) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setFile(file);
    }
  };

  const handleUpload = async () => {
    if (!profileFile) {
      alert("กรุณาเลือกรูปภาพก่อนอัปโหลด");
      return;
    }
  
    setLoading(true);
    
    const formData = new FormData();
    formData.append("image_profile", profileFile, profileFile.name); // ระบุชื่อไฟล์
  
    // ตรวจสอบค่าที่ถูกส่ง
    console.log("Profile File:", formData.get("image_profile"));
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/profile/image`, {
        method: "POST",
        body: formData,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Upload failed: ${errorMessage}`);
      }
      router.push('/profile');
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("เกิดข้อผิดพลาดในการอัปโหลด: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col bg-white border-0 md:border border-gray rounded-xl max-w-md w-full m-auto px-5 py-5 min-h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-medium">เพิ่มรูปภาพ</h1>
        <p className="text-sm mt-2 mb-4">เลือกรูปภาพโปรไฟล์สำหรับหน้าของคุณ</p>
      </div>

      {/* ภาพโปรไฟล์ */}
      <div className="pb-3 mt-5 text-center">ภาพโปรไฟล์</div>
      <div className="relative w-full flex justify-center items-center">
        <label className="cursor-pointer w-32 h-32 flex items-center justify-center border border-gray-300 rounded-full bg-gray-100 hover:bg-gray-200 transition relative overflow-hidden">
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setProfileImage, setProfileFile)} />
          {profileImage ? (
            <Image src={profileImage} alt="Profile" layout="fill" objectFit="cover" className="rounded-full" />
          ) : (
            <i className="fi fi-rr-add-image"></i>
          )}
        </label>
      </div>

      {/* ปุ่มอัปโหลด */}
      <div className="pt-5">
        <button
          className="btn-primary w-full"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "กำลังอัปโหลด..." : "อัปโหลดรูปภาพ"}
        </button>
        <button onClick={() => router.back()} className="btn-secondary w-full mt-2">ย้อนกลับ</button>
      </div>
    </div>
  );
};

export default StepTwo;