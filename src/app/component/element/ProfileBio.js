import React from 'react'
import PaginationBio from '../paginationBio'
import Image from 'next/image'

const ProfileBio = () => {
  return (
    <div className='top'>
    <div className='cover-bio'>
        <div className='relative'>
            <PaginationBio />
        </div>
        <Image
            src="/upload/cover-test.jpg"
            alt="Picture of the author"
            width={500}
            height={500}
            className='w-full h-full bg-center object-cover'
        />
    </div>
    <div className='top-bio flex py-2 px-5 items-center'>
        <div className='profile-bio'>
            <Image
                src="/upload/test.jpg"
                alt="Picture of the author"
                width={100}
                height={100}
                className='w-full h-full bg-center object-cover'
            />
        </div>
        <div className='w-full ml-5 flex flex-col justify-center'>
            <h1 className='name-bio'>JIB Computer Group</h1>
            <p className='sub-name-bio'>
                JIB จำหน่ายสินค้าไอที คอมประกอบ โน้ตบุ๊ค สินค้า Apple ให้คำแนะนำทุกสาขา และช้อปออนไลน์ ส่งด่วน 24 ชม.
            </p>
        </div>
    </div>
</div>
  )
}

export default ProfileBio