"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import socialPlatforms from '@/constants/socialPlatforms';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const SocialOne = ({ userId }) => {
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/user/profile/${userId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        // ตรวจสอบว่ามีข้อมูล user และ contacts หรือไม่
        if (data?.user?.contacts && data.user.contacts.length > 0) {
          const userPlatforms = data.user.contacts[0].platforms || [];
          setPlatforms(userPlatforms);
        } else {
          setPlatforms([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getFormattedUrl = (url) => {
    if (!url) return '#';
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  const navigateToUrl = (url) => {
    const formattedUrl = getFormattedUrl(url);
    window.open(formattedUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className='middle px-7 py-4'>
        <div className='text-center'>กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='middle px-7 py-4'>
        <div className='text-center text-red-500'>{error}</div>
      </div>
    );
  }

  return (
    <div className='middle px-7 py-4'>
      <div className='social-object-bio grid grid-cols-1 gap-3'>
        {platforms.length > 0 ? (
          platforms.map(platform => {
            // ค้นหาข้อมูลไอคอนจาก socialPlatforms โดยใช้ platform_id
            const matchedPlatformInfo = socialPlatforms.find(p => p.id === platform.platform_id);
            if (!matchedPlatformInfo) return null;

            return (
              <div 
                key={platform.ID || platform.platform_id || platform.url} 
                id={`platform-${platform.platform_id}`}
                className='social-btn-bio flex border border-gray rounded-full px-5 py-3 w-full cursor-pointer hover:bg-gray-100 transition-colors'
                onClick={() => navigateToUrl(platform.url)}
              >
                <div className='icon-bio w-8 h-8'>
                  <Image
                    src={matchedPlatformInfo.icon}
                    alt={matchedPlatformInfo.name || `Platform ${platform.platform_id}`}
                    width={100}
                    height={100}
                    className='w-full h-full object-cover'
                  />
                </div>
                <div className='title-link-bio flex items-center m-auto'>
                  {platform.title || platform.url}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">ไม่มีข้อมูลโซเชียล</p>
        )}
      </div>
    </div>
  );
};

export default SocialOne;
