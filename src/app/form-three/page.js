"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StepThree from '../component/form/StepThree';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const FormThreePage = () => {
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
                        } else if (!form_one_completed) {
                            router.push('/form-one');
                        } else if (form_three_completed) {
                            router.push('/form-two');
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
            <StepThree />
        </div>
    );
};

export default FormThreePage;
