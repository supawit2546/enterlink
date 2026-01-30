"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import socialPlatforms from '@/constants/socialPlatforms';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE_URL_BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL_BACKEND;

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [formThreeModalOpen, setFormThreeModalOpen] = useState(false);
  const [selectedSocial, setSelectedSocial] = useState(1);
  const [currentPlatformIndex, setCurrentPlatformIndex] = useState(null);
  const [currentContactIndex, setCurrentContactIndex] = useState(null);
  const [platformsToDelete, setPlatformsToDelete] = useState([]);
  const [platformErrors, setPlatformErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized");
        }
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      console.log("Profile data:", data);

      if (!data.user || !data.user.contacts || data.user.contacts.length === 0) {
        console.log("No user data or contacts found, redirecting to form-one");
        router.push('/form-one');
        return;
      }

      // เก็บ contact IDs ไว้ใช้ในการอัปเดต
      const contactsWithIds = data.user.contacts.map(contact => ({
        ...contact,
        id: contact.id, // เก็บ contact ID
        platforms: contact.platforms.map(platform => ({
          ...platform,
          id: platform.id // เก็บ platform ID
        }))
      }));

      setProfile({
        ...data.user,
        contacts: contactsWithIds
      });
      setEditedProfile({
        ...data.user,
        contacts: contactsWithIds
      });

      // จัดการ platform icons
      if (data.user.contacts) {
        data.user.contacts.forEach((contact) => {
          if (contact.platforms) {
            contact.platforms.forEach((platform) => {
              if (!platform.icon) {
                platform.icon = getIconByPlatformId(platform.platform_id);
              }
            });
          }
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error.message === "Unauthorized") {
        router.push('/login');
      } else {
        router.push('/form-one');
      }
    }
  }

  const getIconByPlatformId = (platformId) => {
    const platform = socialPlatforms.find((platform) => platform.id === platformId);
    return platform ? platform.icon : "/images/plus.png";
  };

  const handleGoToDomain = () => {
    if (profile?.domain) {
      router.push(`/${profile.domain}`);
    } else {
      console.error("Domain is missing");
    }
  };

  const handleLogout = () => {
    // localStorage.removeItem("user_id");
    // localStorage.removeItem("token");
    localStorage.clear();
    router.push("/login");
  };

  const toggleEdit = () => {
    if (isEditing) {
      handleSaveChanges();
    } else {
      // Clear errors when entering edit mode
      setPlatformErrors({});
      setError(null);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    if (field === 'bio') {
      setEditedProfile((prev) => ({
        ...prev,
        [field]: value,
        contacts: prev.contacts.map((contact, index) =>
          index === 0 ? { ...contact, bio: value } : contact
        ),
      }));
    } else if (field === 'phone' || field === 'domain') {
      setEditedProfile((prev) => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handlePlatformChange = (contactIndex, platformIndex, field, value) => {
    const updatedContacts = [...editedProfile.contacts];
    updatedContacts[contactIndex].platforms[platformIndex][field] = value;

    setEditedProfile((prev) => ({
      ...prev,
      contacts: updatedContacts,
    }));

    // Clear error when user starts typing
    const errorKey = `${contactIndex}-${platformIndex}`;
    if (platformErrors[errorKey] && platformErrors[errorKey][field]) {
      setPlatformErrors(prev => ({
        ...prev,
        [errorKey]: {
          ...prev[errorKey],
          [field]: null
        }
      }));
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Validate contacts before sending
      if (!editedProfile.contacts || editedProfile.contacts.length === 0) {
        setError("ไม่พบข้อมูลที่ต้องการอัปเดต");
        return;
      }

      // Validate platform fields
      const errors = {};
      let hasErrors = false;

      editedProfile.contacts.forEach((contact, contactIndex) => {
        if (contact.platforms) {
          contact.platforms.forEach((platform, platformIndex) => {
            const key = `${contactIndex}-${platformIndex}`;
            
            if (!platform.title || platform.title.trim() === '') {
              errors[key] = { title: 'กรุณากรอกชื่อบัญชีแพลตฟอร์ม' };
              hasErrors = true;
            }
            
            if (!platform.url || platform.url.trim() === '') {
              errors[key] = { ...errors[key], url: 'กรุณากรอก URL ของแพลตฟอร์ม' };
              hasErrors = true;
            }
          });
        }
      });

      if (hasErrors) {
        setPlatformErrors(errors);
        setError("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      }

      setPlatformErrors({});

      const requestBody = {
        user_id: profile.id,
        contacts: editedProfile.contacts.map((contact) => {
          return {
            name: contact.name,
            bio: contact.bio,
            platforms: (contact.platforms || []).map((platform) => {
              const platformData = {
                platform_id: platform.platform_id,
                title: platform.title,
                url: platform.url,
              };
              if (platform.platform_number) {
                platformData.platform_number = platform.platform_number;
              }
              return platformData;
            }),
          };
        }),
      };

      console.log("Final request body:", JSON.stringify(requestBody, null, 2));

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        
        if (response.status === 404) {
          console.error("Contact not found: The contact you're trying to update doesn't exist");
          setError("ไม่พบข้อมูลที่ต้องการอัปเดต");
          return;
        }
        if (response.status === 403) {
          if (errorText.includes("Contact not authorized")) {
            console.error("Contact not authorized: You don't have permission to update this contact");
            setError("คุณไม่มีสิทธิ์ในการแก้ไขข้อมูลนี้");
            return;
          }
          console.error("Forbidden: Token may be invalid or expired");
          router.push('/login');
          return;
        }
        if (response.status === 401) {
          console.error("Unauthorized: Please login again");
          router.push('/login');
          return;
        }
        throw new Error(errorText || "Failed to update profile");
      }

      const data = await response.json();
      console.log("Update successful, received data:", JSON.stringify(data, null, 2));
      
      // ถ้าอัปเดตสำเร็จ ให้รีเฟรชข้อมูลโปรไฟล์
      await fetchProfile();
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error updating profile:", err);
      if (err.message.includes("Unauthorized") || err.message.includes("Forbidden")) {
        router.push('/login');
      }
    }
  };

  const openModal = (contactIndex, platformIndex) => {
    setCurrentContactIndex(contactIndex);
    setCurrentPlatformIndex(platformIndex);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const openBlockModal = () => {
    setBlockModalOpen(true);
  };

  const closeBlockModal = () => {
    setBlockModalOpen(false);
    // ไม่รีเซ็ต selectedSocial เพื่อให้คงการเลือกไว้
  };

  const openFormThreeModal = () => {
    setFormThreeModalOpen(true);
    setBlockModalOpen(false); // ปิด modal แรก
  };

  const closeFormThreeModal = () => {
    setFormThreeModalOpen(false);
    setSelectedSocial(1); // รีเซ็ตการเลือกเมื่อปิด modal ที่สอง
  };

  const handleBlockSubmit = async () => {
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
         console.log('Block data successfully sent:', responseData);
         closeFormThreeModal();
         // รีเฟรชข้อมูลโปรไฟล์หลังจากอัปเดต
         await fetchProfile();
       } else {
        const errorData = await response.json();
        console.error('Error submitting block data:', errorData);
        setError('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } catch (error) {
      console.error('Error submitting block form:', error);
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  };

  const selectIcon = (platformName) => {
    const found = socialPlatforms.find(p => p.name.toLowerCase() === platformName.toLowerCase());
    let platformId = 0;
    let iconPath = '/images/plus.png';
    if (found) {
      platformId = found.id;
      iconPath = found.icon;
    }
    const updatedContacts = [...editedProfile.contacts];
    updatedContacts[currentContactIndex].platforms[currentPlatformIndex] = {
      ...updatedContacts[currentContactIndex].platforms[currentPlatformIndex],
      icon: iconPath,
      platform_id: platformId,
      title: platformName // Set the platform name as the default title
    };
    setEditedProfile((prev) => ({
      ...prev,
      contacts: updatedContacts,
    }));
    closeModal();
  };

  const addPlatform = () => {
    if (editedProfile.contacts[0].platforms.length < 10) {
      const updatedContacts = [...editedProfile.contacts];
      updatedContacts[0].platforms.push({
        platform_id: null,
        title: "",
        url: "",
        icon: "/images/plus.png",
      });

      setEditedProfile((prev) => ({
        ...prev,
        contacts: updatedContacts,
      }));

      // Clear errors when adding new platform
      setPlatformErrors({});
      setError(null);

      // เข้าสู่โหมดแก้ไขโดยอัตโนมัติ
      setIsEditing(true);
    }
  };

  const handleDeletePlatform = async (contactIndex, platformIndex) => {
    try {
      // ดึงข้อมูล platform ที่จะลบก่อนที่จะลบออกจาก state
      const platformToDelete = editedProfile.contacts[contactIndex].platforms[platformIndex];
      
      if (!platformToDelete) {
        console.error("Platform not found");
        return;
      }

      console.log("Platform to delete:", platformToDelete); // เพิ่ม log เพื่อดูข้อมูล platform

      // สร้าง request body สำหรับการลบ
      const requestBody = {
        platform_number: platformToDelete.platform_number // ใช้ platform_number แทน id
      };

      console.log("Delete request body:", requestBody); // เพิ่ม log เพื่อดูข้อมูลที่ส่ง

      // ส่ง request ไปลบ platform
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/profile/platform`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete platform");
      }

      // ถ้าลบสำเร็จ ค่อยอัปเดต UI
      const updatedContacts = [...editedProfile.contacts];
      updatedContacts[contactIndex].platforms.splice(platformIndex, 1);

      setEditedProfile((prev) => ({
        ...prev,
        contacts: updatedContacts,
      }));

      // รีเฟรชข้อมูลโปรไฟล์
      await fetchProfile();
      
    } catch (error) {
      console.error("Error deleting platform:", error);
      setError("เกิดข้อผิดพลาดในการลบแพลตฟอร์ม");
    }
  };

  const renderField = (label, value, field) => {
    const isLocked = field === 'domain' || field === 'phone';
    return (
      <div className="mt-4">
        <label className="block mb-2 text-sm font-medium">{label}</label>
        {isEditing ? (
          <div className="relative">
            <input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className={`p-2 outline-none border border-gray bg-gray-50 rounded-xl w-full py-3 px-5 ${isLocked ? 'pr-10' : ''}`}
              disabled={isLocked}
            />
            {isLocked && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Image src="/images/lock.png" alt="Locked" width={20} height={20} />
              </div>
            )}
          </div>
        ) : (
          <div className="w-full px-3 py-3 rounded-xl border border-gray-300 bg-white">
            {value}
          </div>
        )}
      </div>
    );
  };

  if (error) return <div className="text-red-500 text-center">Error: {error}</div>;
  if (!profile) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen pt-10 pb-10 bg-gray-50 flex items-center">
      <div className="bg-white border border-gray-200 rounded-xl max-w-md w-full m-auto p-6 shadow-lg">
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-medium">โปรไฟล์ของคุณ</h1>
            {!isEditing && (
              <button
                onClick={toggleEdit}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
              >
                แก้ไข
              </button>
            )}
          </div>

          {profile.contacts?.length > 0 ? (
            profile.contacts.map((contact, contactIndex) => (
              <div key={contactIndex} className="text-left mt-4">
                <Image
                  src={
                    contact.image_profile && contact.image_profile.startsWith('/uploads')
                      ? `${API_BASE_URL_BACKEND}${contact.image_profile}`
                      : contact.image_profile || "/images/profile.png"
                  }
                  alt="Profile"
                  width={200}
                  height={200}
                  className="rounded-full mx-auto mb-4"
                  unoptimized
                />
                {renderField("ชื่อเว็บไซต์ของคุณ", profile.domain, "domain")}
                {renderField("เบอร์โทรศัพท์", profile.phone, "phone")}
                {renderField("รายละเอียดโปรไฟล์", editedProfile.contacts[0]?.bio || "", "bio")}

                {contact.platforms?.length > 0 && (
                  <div className="mt-6">
                    <h2 className="text-lg font-medium mb-3">แพลตฟอร์มของคุณ</h2>
                    {contact.platforms.map((platform, idx) => (
                      <div key={idx} className="space-y-3 mb-6 border-b pb-4">
                        <div className="flex justify-between mb-2 text-sm font-medium">
                          <label className="text-sm font-medium">ชื่อบัญชีแพลตฟอร์ม</label>
                          {isEditing && (
                            <button
                              className="text-sm font-medium text-red-500"
                              onClick={() => handleDeletePlatform(contactIndex, idx)}
                            >
                              ลบ
                            </button>
                          )}
                        </div>
                                                 <div className="flex items-center space-x-3">
                           {isEditing ? (
                             <button
                               type="button"
                               onClick={() => openModal(contactIndex, idx)}
                               className="flex items-center justify-center border border-gray rounded-lg w-12 h-12 bg-gray-50 flex-shrink-0"
                             >
                               <Image
                                 src={platform.icon || getIconByPlatformId(platform.platform_id) || "/images/plus.png"}
                                 alt="Platform Icon"
                                 width={32}
                                 height={32}
                               />
                             </button>
                           ) : (
                             <div className="flex items-center justify-center border border-gray rounded-lg w-12 h-12 bg-white flex-shrink-0">
                               <Image
                                 src={platform.icon || getIconByPlatformId(platform.platform_id) || "/images/plus.png"}
                                 alt="Platform Icon"
                                 width={32}
                                 height={32}
                               />
                             </div>
                           )}

                           {isEditing ? (
                             <div className="flex-1 min-w-0">
                               <input
                                 type="text"
                                 value={editedProfile.contacts[contactIndex].platforms[idx].title || ""}
                                 onChange={(e) =>
                                   handlePlatformChange(contactIndex, idx, "title", e.target.value)
                                 }
                                 className={`p-2 outline-none border rounded-xl w-full py-3 px-5 ${
                                   platformErrors[`${contactIndex}-${idx}`]?.title 
                                     ? 'border-red-500 bg-red-50' 
                                     : 'border-gray bg-gray-50'
                                 }`}
                                 placeholder="ชื่อบัญชีแพลตฟอร์ม"
                               />
                               {platformErrors[`${contactIndex}-${idx}`]?.title && (
                                 <p className="text-red-500 text-sm mt-1">{platformErrors[`${contactIndex}-${idx}`].title}</p>
                               )}
                             </div>
                           ) : (
                             <div className="p-2 border border-gray bg-white rounded-xl flex-1 py-3 px-5 min-w-0">
                               {platform.title}
                             </div>
                           )}
                         </div>

                        <div>
                          <label className="block mb-2 text-sm font-medium">URL ของแพลตฟอร์ม</label>
                          {isEditing ? (
                            <div>
                              <input
                                type="text"
                                value={editedProfile.contacts[contactIndex].platforms[idx].url || ""}
                                onChange={(e) =>
                                  handlePlatformChange(contactIndex, idx, "url", e.target.value)
                                }
                                className={`p-2 outline-none border rounded-xl w-full py-3 px-5 ${
                                  platformErrors[`${contactIndex}-${idx}`]?.url 
                                    ? 'border-red-500 bg-red-50' 
                                    : 'border-gray bg-gray-50'
                                }`}
                                placeholder="กรอก URL ของแพลตฟอร์ม"
                              />
                              {platformErrors[`${contactIndex}-${idx}`]?.url && (
                                <p className="text-red-500 text-sm mt-1">{platformErrors[`${contactIndex}-${idx}`].url}</p>
                              )}
                            </div>
                          ) : (
                            <div className="w-full px-3 py-3 rounded-xl border border-gray-300 bg-white">
                              {platform.url}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No contacts found</p>
          )}
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={addPlatform}
            className="btn-secondary w-full py-3 rounded-lg"
          >
            เพิ่มแพลตฟอร์ม
          </button>
          <button
            onClick={openBlockModal}
            className="btn-secondary w-full py-3 rounded-lg"
          >
            แก้ไข/เพิ่มบล็อค
          </button>
          {isEditing && (
            <div className="mt-4">
              <button
                onClick={toggleEdit}
                className="bg-orange-500 hover:bg-orange-600 text-white w-full py-3 rounded-xl"
              >
                บันทึกการแก้ไข
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-5">
          <button onClick={handleLogout} className="text-red-500">
            ออกจากระบบ
          </button>
          <button onClick={handleGoToDomain} className="text-black">
            ไปหน้าที่ {profile.domain}
          </button>
        </div>
      </div>

      {/* Modal for selecting platform icons */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-10 relative max-w-lg w-50">
            <button onClick={closeModal} className="absolute top-2 right-2 rotate-45">
              <Image src="/images/plus.png" alt="Close" width={40} height={40} />
            </button>
            <h2 className="text-lg font-medium text-center">เลือกไอคอนแพลตฟอร์ม</h2>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {socialPlatforms.map(platform => (
                <button key={platform.id} onClick={() => selectIcon(platform.name)} className="border rounded-xl p-4">
                  <Image src={platform.icon} alt={platform.name} width={32} height={32} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

             {/* Modal for editing/adding blocks */}
       {blockModalOpen && (
         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
           <div className="bg-white rounded-lg shadow-lg p-10 relative max-w-lg w-50">
            <button onClick={closeBlockModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-medium">แก้ไขบล็อค / เพิ่มฟังกชั่น</h2>
            </div>
            
                         <div className="mb-6">
               <div className="text-lg font-medium mb-3">ช่องทางโซเชียลมีเดีย</div>
                               <div className="grid grid-cols-2 gap-4">
                  {[1, 2].map((item) => (
                    <div
                      key={item}
                      className={`relative rounded-xl border overflow-hidden transition-all ${
                        item === 1 
                          ? selectedSocial === item 
                            ? 'border-orange-500 text-orange-500' 
                            : 'border-gray cursor-pointer hover:border-orange-500'
                          : 'border-gray-200 cursor-not-allowed opacity-50'
                      }`}
                                             onClick={() => item === 1 && openFormThreeModal()}
                    >
                                             {item === 1 ? (
                         <>
                           <Image
                            src={`/images/element-${item}.jpg`}
                            alt={`Element ${item}`}
                            width={200}
                            height={200}
                            layout="responsive"
                            objectFit="cover"
                          />
                                                     <div className="absolute bottom-0 w-full text-center py-2 bg-white bg-opacity-80 text-black">
                             การจัดวาง
                           </div>
                        </>
                      ) : (
                        <>
                          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-gray-400 text-4xl mb-2">+</div>
                              <div className="text-gray-400 text-sm">เร็วๆ นี้</div>
                            </div>
                          </div>
                          <div className="absolute bottom-0 w-full text-center py-2 bg-white bg-opacity-80 text-gray-400">
                            เร็วๆ นี้
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
             </div>

                         <div className="flex justify-center">
               <button 
                 onClick={closeBlockModal}
                 className="btn-secondary px-6 py-2"
               >
                 ยกเลิก
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Modal for form-three style */}
      {formThreeModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-8 relative max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <button onClick={closeFormThreeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-medium">เลือกรูปแบบการจัดวาง</h2>
              <h3 className="text-lg font-medium pt-2">และเพิ่มบล็อคที่คุณต้องการ</h3>
              <p className="text-sm mt-2 mb-4 text-gray-600">
                คุณสามารถเพิ่มเติมบล็อคและจัดเรียงบล็อคได้ในภายหลังจากคุณเลือกบล็อคที่จำเป็นเสร็จแล้ว
              </p>
            </div>
            
            <div className="mb-6">
              <div className="text-lg font-medium mb-3">ช่องทางโซเชียลมีเดีย</div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className={`relative rounded-xl border overflow-hidden transition-all ${
                      selectedSocial === item 
                        ? 'border-orange-500 text-orange-500' 
                        : 'border-gray cursor-pointer hover:border-orange-500'
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
                    <div className={`absolute bottom-0 w-full text-center py-2 bg-white bg-opacity-80 ${
                      selectedSocial === item ? 'text-orange-500' : 'text-black'
                    }`}>
                      {item === 1 ? '1 คอลลัมน์' : '2 คอลลัมน์'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button 
                onClick={closeFormThreeModal}
                className="btn-secondary px-6 py-2"
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleBlockSubmit}
                className="btn-primary px-6 py-2"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;