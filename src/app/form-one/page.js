"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StepOne from '../component/form/StepOne';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const ProfileSetting = () => {
    const router = useRouter();

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/profile`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.user) {
                        const { form_one_completed, form_two_completed, form_three_completed } = data.user;

                        if (form_one_completed && form_three_completed && form_two_completed) {
                            router.push('/profile');
                        } else if (form_one_completed) {
                            router.push('/form-three');
                        }
                    } else {
                        router.push('/login');
                    }
                } else {
                    console.error("Failed to fetch user status:", response.statusText);
                    router.push('/login');
                }
            } catch (error) {
                console.error("Error checking user status:", error);
                router.push('/login');
            }
        };

        checkStatus();
    }, [router]);

    return (
        <div className='min-h-screen flex items-center'>
            <StepOne/>
        </div>
    );
};

export default ProfileSetting;
