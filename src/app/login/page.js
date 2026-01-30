"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Pagination from '../component/pagination';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const LoginPage = () => {
    const router = useRouter();
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                credentials: 'include', // สำคัญมาก!
                headers: {
                    'Content-Type': 'application/json',
                },
                
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || 'เข้าสู่ระบบไม่สำเร็จ');
            }

            const data = await response.json();
            // สมมติว่า data.token คือ JWT ที่ backend ส่งกลับมา
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            router.push('/profile');
        } catch (err) {
            setError(err.message);
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Pagination />
            <div className='h-screen bg-white md:bg-gray-50 flex items-center'>
                <div className='flex flex-col bg-white border-0 md:border border-gray rounded-xl max-w-md w-full m-auto px-10 py-10'>
                    <Image 
                        src="/images/logo.png" 
                        alt="Logo" 
                        width={190} 
                        height={190} 
                        className="pb-5 m-auto" 
                    />
                    <h1 className='text-2xl text-center font-medium'>เข้าสู่ระบบ</h1>
                    <form className='space-y-5' onSubmit={handleSubmit}>
                        <div>
                            <label 
                                htmlFor="email" 
                                className="block mb-2 text-sm font-medium"
                            >
                                อีเมล์
                            </label>
                            <input
                                type='email'
                                id="email"
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                placeholder='อีเมล์ของคุณ'
                                className='p-2 border border-gray bg-gray-50 rounded-xl w-full py-3 px-5'
                                required
                            />
                        </div>
                        <div>
                            <label 
                                htmlFor="password" 
                                className="block mb-2 text-sm font-medium"
                            >
                                รหัสผ่าน
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name='password'
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder='รหัสผ่านของคุณ'
                                    className='p-2 border border-gray bg-gray-50 rounded-xl w-full py-3 px-5'
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                >
                                    {showPassword ? (
                                        <i className="fi fi-rr-eye"></i>
                                    ) : (
                                        <i className="fi fi-rr-eye-crossed"></i>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className='text-center'>
                            <button
                                type='submit'
                                className='w-full bg-orange-500 text-white py-3 px-5 rounded-xl hover:bg-orange-600 transition-colors font-medium'
                                disabled={loading}
                            >
                                {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                            </button>
                        </div>
                    </form>
                    <div className='pt-4 text-center'>
                        <span className='text-sm'>ยังไม่มีบัญชีใช่ไหม? </span>
                        <Link href="/register">
                            <span className='text-sm text-yellow-700'>สมัครสมาชิก</span>
                        </Link>
                        {error && (
                            <p className='text-red-500 text-center mt-3'>{error}</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;