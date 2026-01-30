"use client"; // ถ้าใช้ใน Next.js 13+ App Router

import React, { useState } from 'react';
import Image from 'next/image';

const StepFour = () => {
  const [selectedSocial, setSelectedSocial] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedOther, setSelectedOther] = useState(null);
  const [socialText, setSocialText] = useState({ 1: '1 คอลลัมน์', 2: '2 คอลลัมน์' });
  const [imageText, setImageText] = useState({ 3: 'แสดงทุกรูปภาพ', 4: 'ซ่อนภาพได้', 5: 'สไลด์ทีละ 2 ช่อง', 6: 'สไลด์ช่องเดียว', 7: 'ภาพเดี่ยว', 8: 'สาขา' });

  const handleSocialTextChange = (item, text) => {
    setSocialText((prev) => ({
      ...prev,
      [item]: text,
    }));
  };

  const handleImageTextChange = (item, text) => {
    setImageText((prev) => ({
      ...prev,
      [item]: text,
    }));
  };

  const handleOtherSelection = (item) => {
    if (selectedOther === item) {
      setSelectedOther(null);
    } else {
      setSelectedOther(item);
      setSelectedImage(null); // ยกเลิกการเลือก "รูปภาพ" เมื่อเลือก "อื่นๆ"
    }
  };

  return (
    <>
      <div className='flex flex-col bg-white border-0 md:border border-gray rounded-xl max-w-md w-full m-auto px-5 py-5 min-h-screen'>
        <div className='text-center'>
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={190}
            height={190}
            className="pb-5 m-auto"
          />
          <div className=''>
            <h1 className='text-3xl font-medium'>เลือกรูปแบบการจัดวาง</h1>
            <h1 className='text-xl font-medium pt-2'>และเพิ่มบล็อคที่คุณต้องการ</h1>
            <p className='text-sm mt-2 mb-2 px-10'>คุณสามารถเพิ่มเติมบล็อคและจัดเรียงบล็อคได้ในภายหลังจากคุณเลือกบล็อคที่จำเป็นเสร็จแล้ว</p>
          </div>
        </div>

        <div className='pt-5'>
          <div>ช่องทางโซเชียลมีเดีย</div>
        </div>
        <div className='grid grid-cols-2 gap-4 mt-2'>
          {[1, 2].map((item) => (
            <div
              key={item}
              className={`relative rounded-xl border overflow-hidden cursor-pointer transition-all ${selectedSocial === item ? 'border-orange-500 text-orange-500' : 'border-gray'}`}
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
              <div className={`absolute bottom-0 w-full text-center py-2 bg-white bg-opacity-80 ${selectedSocial === item ? 'text-orange-500' : 'text-black'}`}>
                {socialText[item]} 
              </div>
            </div>
          ))}
        </div>

        <div className='pt-5'>
          <div>รูปภาพ</div>
        </div>
        <div className='grid grid-cols-2 gap-4 mt-2'>
          {[3, 4, 5, 6, 7].map((item) => (
            <div
              key={item}
              className={`relative rounded-xl border overflow-hidden cursor-pointer transition-all ${selectedImage === item ? 'border-orange-500 text-orange-500' : 'border-gray'}`}
              onClick={() => setSelectedImage(item)}
            >
              {selectedImage === item && (
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
              <div className={`absolute bottom-0 w-full text-center py-2 bg-white bg-opacity-80 ${selectedImage === item ? 'text-orange-500' : 'text-black'}`}>
                {imageText[item]} 
              </div>
            </div>
          ))}
        </div>

        <div className='pt-5'>
          <div>อื่นๆ</div>
        </div>
        <div className='grid grid-cols-2 gap-4 mt-2'>
          {[8].map((item) => (
            <div
              key={item}
              className={`relative rounded-xl border overflow-hidden cursor-pointer transition-all ${selectedOther === item ? 'border-orange-500 text-orange-500' : 'border-gray'}`}
              onClick={() => handleOtherSelection(item)}
            >
              {selectedOther === item && (
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
              <div className={`absolute bottom-0 w-full text-center py-2 bg-white bg-opacity-80 ${selectedOther === item ? 'text-orange-500' : 'text-black'}`}>
                <input
                  type="text"
                  value={imageText[item]}
                  onChange={(e) => handleImageTextChange(item, e.target.value)}
                  className="bg-transparent text-center outline-none"
                />
              </div>
            </div>
          ))}
        </div>

        <div className='flex justify-start items-center bg-orange-100 px-3 py-3 rounded-xl mt-5'>
          <i className="fi fi-ss-bulb bg-white p-3 rounded-xl flex"></i>
          <span className='text-sm ml-3'>คุณสามารถเลือกได้มากกว่า 1 รูปแบบในหนึ่งหน้าได้ เมื่อคุณเป็นสมาชิกรายเดือน <span className='text-sm text-orange-500'>อัปเกรดเลย</span></span>
        </div>
        <div className='flex justify-between pt-5'>
          <button className='btn-secondary'>
            ย้อนกลับ
          </button>
          <button className='btn-primary'>
            ถัดไป
          </button>
        </div>
      </div>
    </>
  );
};

export default StepFour;
