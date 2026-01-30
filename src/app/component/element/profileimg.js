import React, { useEffect, useState } from "react";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE_URL_BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL_BACKEND;

const getImageUrl = (path) => {
  if (!path) return "/default-profile.png";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL_BACKEND}${path}`;
};

const SingleBio2 = ({ userId }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/profile/${userId}`);
        const data = await response.json();

        console.log("Fetched profile data:", data); // ดูว่าได้ข้อมูลจาก API หรือไม่

        if (data?.user?.contacts?.length > 0) {
          setProfile(data.user.contacts[0]); // เอาค่า contact แรกมาแสดง
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [userId]); // ใช้ userId แทน user_id

  return (
    <div className="top-bio py-2 px-2 items-center pt-10">
      {profile ? (
        <>
          <div className="sigle-profile-bio flex flex-col items-center">
            <Image
              src={getImageUrl(profile.image_profile)}
              alt={profile.name || "Profile Image"}
              width={100}
              height={100}
              className="w-full h-full bg-center object-cover rounded-full"
            />
          </div>
          <div className="w-full flex flex-col justify-center py-3 px-8">
            <h1 className="text-2xl text-center">{profile.name}</h1>
            <p className="text-mb text-center mt-2 px-0 md:px-10">{profile.bio}</p>
          </div>
        </>
      ) : (
        <p className="text-center">กำลังโหลดข้อมูล...</p>
      )}
    </div>
  );
};

export default SingleBio2;