"use client";

import React, { useState , useEffect} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Pagination from "../component/pagination";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const RegisterPage = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        domain: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [domainError, setDomainError] = useState("");


        useEffect(() => {
            const currentToken = localStorage.getItem('token');
            const currentUserId = localStorage.getItem('user_id');
            
            // ตรวจสอบว่าทั้ง token และ user_id มีค่าและไม่ใช่ undefined หรือ null
            if (currentToken && currentUserId && currentUserId !== 'undefined' && currentUserId !== 'null') {
                // ถ้ามีทั้ง token และ user_id อยู่แล้ว ให้ redirect ไปยังหน้า /profile
                router.push('/profile');
            } else {
                // ถ้าไม่มี token หรือ user_id ให้ล้าง localStorage และไม่ให้ redirect
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
                setToken(null);
            }

            // ดึง businessName จาก localStorage ถ้ามี และยังไม่ได้กรอก domain
            const businessName = localStorage.getItem('businessName');
            if (businessName && !formData.domain) {
                setFormData((prev) => ({ ...prev, domain: businessName }));
            }
        }, [router]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === "domain") {
            // ตรวจสอบว่ามีตัวอักษรภาษาไทยหรือไม่
            const thaiRegex = /[\u0E00-\u0E7F]/;
            if (thaiRegex.test(value)) {
                setDomainError("กรุณากรอกชื่อเว็บไซต์เป็นภาษาอังกฤษเท่านั้น");
            } else {
                setDomainError("");
            }
            
            // อนุญาตให้กรอกได้เฉพาะตัวอักษรภาษาอังกฤษ ตัวเลข และขีดกลาง
            const englishOnly = value.replace(/[^a-zA-Z0-9-]/g, '');
            setFormData({
                ...formData,
                [name]: englishOnly,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!agreedToTerms) {
            setError("โปรดยอมรับเงื่อนไขและข้อตกลงก่อนดำเนินการต่อ");
            setLoading(false);
            return;
        }

        if (domainError) {
            setError("กรุณากรอกชื่อเว็บไซต์เป็นภาษาอังกฤษเท่านั้น");
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("รหัสผ่านไม่ตรงกัน");
            setLoading(false);
            return;
        }

        const payload = {
            domain: formData.domain,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("สมัครสมาชิกไม่สำเร็จ");
            }

            const data = await response.json();
            console.log("สมัครสมาชิกสำเร็จ", data);
            // นำทางไปหน้า /profile
            router.push("/login");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Pagination />
            <div className="h-screen bg-white md:bg-gray-50 flex items-center">
                <div className="flex flex-col bg-white border-0 md:border border-gray rounded-xl max-w-md w-full m-auto p-5 md:p-10">
                    <Link href="/">
                        <Image src="/images/logo.png" alt="Logo" width={190} height={190} className="pb-5 m-auto" />
                    </Link>
                    <h1 className="text-2xl text-center font-medium mb-3">สมัครสมาชิกเพื่อสร้างลิ้งค์</h1>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <form className="space-y-3" onSubmit={handleSubmit}>
                        <div>
                            <label className="block mb-2 text-sm font-medium">ชื่อเว็บไซต์</label>
                            <div className="p-2 flex border border-gray bg-gray-50 rounded-xl w-full">
                                <span className="text-md ml-2">enterlink.co/</span>
                                <input
                                    type="text"
                                    name="domain"
                                    value={formData.domain}
                                    onChange={handleChange}
                                    placeholder="ชื่อร้านค้า (ภาษาอังกฤษเท่านั้น)"
                                    className="outline-none pl-3 bg-gray-50 w-36"
                                />
                            </div>
                            {domainError && (
                                <p className="text-red-500 text-sm mt-1">{domainError}</p>
                            )}
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium">อีเมล์</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="อีเมล์ของคุณ"
                                className="py-2 px-4 border border-gray bg-gray-50 rounded-xl w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium">เบอร์โทรศัพท์</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="เบอร์โทรศัพท์ของคุณ"
                                className="py-2 px-4 border border-gray bg-gray-50 rounded-xl w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium">รหัสผ่าน</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="รหัสผ่านของคุณ"
                                    className="py-2 px-4 border border-gray bg-gray-50 rounded-xl w-full"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 mt-1"
                                >
                                    {showPassword ? (
                                        <i className="fi fi-rr-eye"></i>
                                    ) : (
                                        <i className="fi fi-rr-eye-crossed"></i>
                                    )}
                                </button>

                            </div>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium">ยืนยันรหัสผ่าน</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="ยืนยันรหัสผ่าน"
                                className="py-2 px-4 border border-gray bg-gray-50 rounded-xl w-full"
                            />
                        </div>
                        <div className="flex items-center justify-center pt-1">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="peer hidden"
                            />
                            <label htmlFor="terms" className="flex items-center cursor-pointer select-none">
                                <span
                                    className={`w-5 h-5 flex items-center justify-center rounded border-2 transition-colors ${agreedToTerms ? 'border-gray-300 bg-white' : 'border-gray-300 bg-white'}`}
                                    style={{ position: 'relative' }}
                                >
                                    {agreedToTerms && (
                                        <svg
                                            className="w-5 h-5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#fb923c"
                                            strokeWidth="2.5"
                                        >
                                            <path d="M6 13L10.5 17L18 8" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </span>
                                <span className="ml-2 text-sm">ยินยอมเปิดเผยข้อมูลส่วนตัว</span>
                            </label>
                        </div>
                        <div className="text-center">
                            <button
                                type="submit"
                                className="w-full bg-orange-500 text-white py-3 px-5 rounded-xl hover:bg-orange-600 transition-colors font-medium"
                                disabled={loading}
                            >
                                {loading ? "กำลังสมัคร..." : "สร้างเลย"}
                            </button>
                        </div>
                    </form>
                    <div className='pt-2 text-center'>
                        <span className='text-sm'>มีบัญชีอยู่แล้ว? </span>
                        <Link href="/login">
                            <span className='text-sm text-yellow-700'>เข้าสู่ระบบ</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
