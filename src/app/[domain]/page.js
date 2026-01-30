"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SocialOne from "../component/element/SocialOne";
import SocialTwo from "../component/element/SocialTwo";
import SingleBio2 from "../component/element/profileimg";
import Credit from "../component/credit";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ฟังก์ชันดึงข้อมูลจาก API
const fetchUserData = async (domain) => {
  try {
    const url = `${API_BASE_URL}/${domain}`;
    const res = await fetch(url);

    if (!res.ok) {
      console.error(`API error: ${res.status} - ${res.statusText}`);
      return null;
    }

    const jsonData = await res.json();
    console.log("✅ Fetched userData from API:", jsonData);

    return jsonData.user || null;
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return null;
  }
};

const DomainApiSheet = () => {
  const params = useParams();
  const router = useRouter();
  const domain = params?.domain;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (domain) {
      const fetchUser = async () => {
        const userData = await fetchUserData(domain);
        if (userData) {
          setUserData(userData);
          console.log("🚀 User fetched:", userData);
        } else {
          console.warn("⚠️ No user data found, redirecting to /404");
          router.replace("/404");
        }
        setLoading(false);
      };
      fetchUser();
    }
  }, [domain, router]);

  if (loading) return <div>Loading...</div>;

  return userData ? (
    <div className="max-w-xl w-full bg-white m-auto min-h-screen">
      <ApiFetchComponent userData={userData} />
    </div>
  ) : null;
};

const ApiFetchComponent = ({ userData }) => {
  if (!userData) {
    console.error("❌ Error: No user data received");
    return <div>Error: No user data</div>;
  }

  const { ID: user_id, contacts } = userData;
  console.log("🆔 User ID:", user_id);

  if (!contacts || contacts.length === 0) {
    console.warn("⚠️ No contacts found for user");
    return <div>No contacts found</div>;
  }

  const firstContact = contacts[0];
  console.log("🎯 First Contact:", firstContact);

  // 🔧 ใช้ fallback เป็น [1] ถ้าไม่เจอหรือไม่ใช่ array
  const component_ids = Array.isArray(firstContact.component_ids)
    ? firstContact.component_ids
    : [1];

  return (
    <div>
      {component_ids.map((id, index) => (
        <div key={index}>
          {/* แสดง SingleBio ทุกครั้ง */}
          <SingleBio2 userId={user_id} />

          {/* แสดง component ตาม ID */}
          {(() => {
            switch (id) {
              case 1:
                return <SocialOne userId={user_id} />;
              case 2:
                return <SocialTwo userId={user_id} />;
              default:
                return <div>Unknown component ID: {id}</div>;
            }
          })()}

          <Credit />
        </div>
      ))}
    </div>
  );
};

export default DomainApiSheet;
