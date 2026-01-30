"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const StepThree = () => {
  const [selectedSocial, setSelectedSocial] = useState(1);
  const router = useRouter();
  

  // ตรวจสอบ platform_id เมื่อ component โหลด
  useEffect(() => {
    const platformIds = JSON.parse(localStorage.getItem('platform_ids')) || [];
    console.log("Platform IDs:", platformIds);

    // ถ้า platformIds มีเพียง 1 ค่า ให้ตั้ง selectedSocial เป็น 1 โดยอัตโนมัติ
    if (platformIds.length <= 1) {
      setSelectedSocial(1);
    }
  }, []);

  const handleSubmit = async () => {

    const data = {
      component_ids: [selectedSocial],
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/profile/component`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Data successfully sent:', responseData);
        router.push('/form-two');
      } else {
        const errorData = await response.json();
        console.error('Error submitting data:', errorData);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <>
      <div className="flex flex-col bg-white border-0 md:border border-gray rounded-xl max-w-md w-full m-auto px-5 py-5 min-h-screen">
        <div className="text-center">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={190}
            height={190}
            className="pb-5 m-auto"
          />
          <div className="">
            <h1 className="text-3xl font-medium">เลือกรูปแบบการจัดวาง</h1>
            <h1 className="text-xl font-medium pt-2">และเพิ่มบล็อคที่คุณต้องการ</h1>
            <p className="text-sm mt-2 mb-2 px-10">
              คุณสามารถเพิ่มเติมบล็อคและจัดเรียงบล็อคได้ในภายหลังจากคุณเลือกบล็อคที่จำเป็นเสร็จแล้ว
            </p>
          </div>
        </div>
        <div className="pt-10">
          <div>ช่องทางโซเชียลมีเดีย</div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className={`relative rounded-xl border overflow-hidden cursor-pointer transition-all ${selectedSocial === item ? 'border-orange-500 text-orange-500' : 'border-gray'
                }`}
              onClick={() => setSelectedSocial(item)}
            >
              {selectedSocial === item && (
                <i className="fi fi-ss-check-circle absolute top-2 right-2 text-2xl text-orange-500 rounded-full"></i>
              )}
              <Image
                src={`/images/element-${item}.jpg`}
                alt={`Element ${item}`}
                width={200}
                height={200}
                layout="responsive"
                objectFit="cover"
              />
              <div
                className={`absolute bottom-0 w-full text-center py-2 bg-white bg-opacity-80 ${selectedSocial === item ? 'text-orange-500' : 'text-black'
                  }`}
              >
                {item === 1 ? '1 คอลลัมน์' : '2 คอลลัมน์'}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-5">
          <button className="btn-secondary" onClick={() => router.back()}>
            ย้อนกลับ
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            ถัดไป
          </button>
        </div>
      </div>
    </>
  );
};

export default StepThree;