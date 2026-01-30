"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StepTwo from '../component/form/StepTwo';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const FormTwo = () => {
    const router = useRouter();

    useEffect(() => {
        const checkProfileStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/profile`, {
                    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                });
                if (!response.ok) {
                    // Redirect to login or show an error if profile can't be fetched
                    router.push('/login');
                    return;
                }
                const data = await response.json();

                if (data.user) {
                    const { form_one_completed, form_two_completed, form_three_completed } = data.user;

                    if (form_one_completed && form_three_completed && form_two_completed) {
                        router.push('/profile');
                    } else if (!form_one_completed) {
                        router.push('/form-one');
                    } else if (!form_three_completed) {
                        router.push('/form-three');
                    }
                    
                } else {
                    // No user data, redirect to login
                    router.push('/login');
                }
            } catch (error) {
                console.error("Error fetching profile status:", error);
                router.push('/login');
            }
        };

        checkProfileStatus();
    }, [router]);

    return (
        <div className='min-h-screen flex items-center'>
            <StepTwo/>
        </div>
    );
};

export default FormTwo;
