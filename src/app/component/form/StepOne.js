"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import socialPlatforms from '@/constants/socialPlatforms';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const StepOne = () => {

  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [contacts, setContacts] = useState([{
    title: '',
    url: '',
    platformId: 1,
    nameplatform: 0,
    icon: '/images/plus.png', // ไอคอนเริ่มต้น
  }]);
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null); // เก็บ index ของแพลตฟอร์มที่แก้ไข
  const router = useRouter();

  const validateUrls = () => {
    const newErrors = {};
    const urlPattern = /^(https?:\/\/)?([a-z0-9.-]+)\.([a-z]{2,6})(\/[a-zA-Z0-9@:%_\+.~#?&//=]*)?$/;

    contacts.forEach((contact, index) => {
      if (!contact.url.trim()) {
        newErrors[`url_${index}`] = "กรุณากรอก URL ของแพลตฟอร์ม";
      } else if (!urlPattern.test(contact.url.trim())) {
        newErrors[`url_${index}`] = "URL ไม่ถูกต้อง กรุณากรอกให้ถูกต้อง";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // แก้ไขฟังก์ชัน fetchData
  const fetchData = async (e) => {
    e.preventDefault(); // ป้องกันการ submit อัตโนมัติ
    console.log('Fetching data...');
    if (!validateUrls()) return;

    // สร้างรูปแบบ JSON ตามที่ต้องการ
    const requestBody = {
      contacts: [{
        name: storeName,
        bio: storeDescription,
        platforms: contacts.map(contact => ({
          platform_id: contact.platformId,
          url: contact.url,
          title: contact.title,
        })),
      }],
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        console.log(response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Success:', data);

      router.push('/form-three');
    } catch (error) {
      console.error("Error fetching data:", error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์ กรุณาตรวจสอบการเชื่อมต่อและลองใหม่อีกครั้ง');
    }
  };


  const handlePlatformChange = (index, field, value) => {
    const updatedContacts = [...contacts];
    updatedContacts[index][field] = value;
    setContacts(updatedContacts);
  };

  const addPlatform = () => {
    if (contacts.length < 10) {
      setContacts([...contacts, { title: '', url: '', platformId: contacts.length + 1, icon: '/images/plus.png' }]);
    }
  };

  const removePlatform = (index) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    setContacts(updatedContacts);
  };

  const openModal = (index) => {
    setCurrentIndex(index); // เก็บ index ของแพลตฟอร์มที่กำลังแก้ไข
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };


  const selectIcon = (platformName) => {
    let iconPath = '';
    let platformId = 0;
    const found = socialPlatforms.find(p => p.name.toLowerCase() === platformName.toLowerCase());
    if (found) {
      iconPath = found.icon;
      platformId = found.id;
    } else {
      iconPath = '/images/plus.png';
      platformId = 0;
    }
    const updatedContacts = [...contacts];
    updatedContacts[currentIndex].icon = iconPath;
    updatedContacts[currentIndex].nameplatform = platformId;
    updatedContacts[currentIndex].platformId = platformId;
    setContacts(updatedContacts);
    closeModal();
  };


  return (
    <div className='flex flex-col bg-white border-0 md:border border-gray rounded-xl max-w-md w-full m-auto px-10 py-10'>
      <div className='text-center'>
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={190}
          height={190}
          className="pb-5 m-auto"
        />
        <h1 className='text-2xl font-medium'>ข้อมูลร้านค้าของคุณ</h1>
        <h2 className='text-sm font-light mt-2'>หน้าที่คุณจะสร้างเป็นหน้าที่ผู้ใช้ทั่วไปสามารถเห็นได้</h2>
      </div>
      <div className='pt-3'>
        <form className='space-y-5' onSubmit={fetchData}>
          <div>
            <label className='block mb-2 text-sm font-medium'>ชื่อร้านค้า</label>
            <input
              type='text'
              placeholder='กรอกชื่อร้านค้าของคุณ'
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className='p-2 outline-none border border-gray bg-gray-50 rounded-xl w-full py-3 px-5'
            />
          </div>
          <div>
            <label className='block mb-2 text-sm font-medium'>รายละเอียดเพิ่มเติม</label>
            <textarea
              placeholder='กรอกรายละเอียดเพิ่มเติม'
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              className='p-2 outline-none border border-gray bg-gray-50 rounded-xl w-full py-3 px-5 h-24'
            ></textarea>
          </div>
          {contacts.map((contact, index) => (
            <div key={index} className='space-y-3'>
              <div className='flex justify-between mb-2 text-sm font-medium'>
                <label className='text-sm font-medium'>ชื่อบัญชีแพลตฟอร์ม</label>
                {contacts.length > 1 && (
                  <button type='button' onClick={() => removePlatform(index)} className='text-red-500'>
                    ลบ
                  </button>
                )}
              </div>
              <div className='flex items-center space-x-3'>
                <button type='button' onClick={() => openModal(index)} className='flex items-center justify-center border border-gray rounded-lg w-12 h-12 bg-gray-50'>
                  <Image
                    src={contact.icon}
                    alt="Selected Icon"
                    width={32}
                    height={32}
                  />
                </button>
                <input
                  type='text'
                  placeholder='ชื่อบัญชีแพลตฟอร์ม'
                  value={contact.title}
                  onChange={(e) => handlePlatformChange(index, 'title', e.target.value)}
                  className='p-2 outline-none border border-gray bg-gray-50 rounded-xl flex-1 py-3 px-5'
                />
              </div>
              <div>
                <label className='block mb-2 text-sm font-medium'>กรอก URL ของแพลตฟอร์ม</label>
                <input
                  type='text'
                  placeholder='กรอก URL ของแพลตฟอร์ม'
                  value={contact.url}
                  onChange={(e) => handlePlatformChange(index, 'url', e.target.value.toLowerCase())}
                  className='p-2 outline-none border border-gray bg-gray-50 rounded-xl w-full py-3 px-5 lowercase'
                />
                                <div className='text-sm mt-1 text-gray-500'>ตัวอย่างเช่น facebook.com/enterlink</div>
                {errors[`url_${index}`] && <p className='text-red-500 text-xs'>{errors[`url_${index}`]}</p>}
              </div>
            </div>
          ))}
          <div className='flex flex-col mt-5'>
            <div className='flex justify-between'>
              <button type="button" onClick={addPlatform} className='btn-secondary w-1/2 mr-2'>
                เพิ่มแพลตฟอร์ม
              </button>
              <button type="submit" className='btn-primary w-1/2 ml-2'>
                ถัดไป
              </button>
            </div>
          </div>

        </form>
        {Object.keys(errors).length > 0 && (
          <p className='text-red-500 text-center mt-3'>กรุณาตรวจสอบข้อมูลที่กรอก</p>
        )}
      </div>

      {/* Modal สำหรับเลือกไอคอน */}
      {modalOpen && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
          <div className='bg-white rounded-lg shadow-lg p-10 relative max-w-lg w-50'>
            <button onClick={closeModal} className='absolute top-2 right-2 rotate-45'>
              <Image src='/images/plus.png' alt='Close' width={40} height={40} />
            </button>
            <h2 className='text-lg font-medium text-center'>เลือกไอคอนแพลตฟอร์ม</h2>
            <div className='grid grid-cols-3 gap-4 mt-4'>
              {socialPlatforms.map(platform => (
                <button key={platform.id} onClick={() => selectIcon(platform.name)} className='border rounded-xl p-4'>
                  <Image src={platform.icon} alt={platform.name} width={48} height={48} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepOne;