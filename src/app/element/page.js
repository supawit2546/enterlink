"use client"; // ถ้าใช้ใน Next.js 13+ App Router
import React from 'react'
import ProfileBio from '../component/element/ProfileBio';
import SocialOne from '../component/element/SocialOne';
import HiddenCard from '../component/element/HiddenCard';
import Credit from '../component/credit';
import SocialTwo from '../component/element/SocialTwo';
import Banner from '../component/element/Banner';
import SlideBanner from '../component/element/SlideBanner';
import VideoCard from '../component/element/VideoCard';
import Branch from '../component/element/Branch';
import GridBanner from '../component/element/GridBanner';
import LeftSlide from '../component/element/LeftSlide';
const SheetOne = () => {
  return (
    <>
      <div className=''>
        <div className='max-w-xl w-full bg-white m-auto min-h-screen'>
          <ProfileBio />
          <SocialOne />
          <SocialTwo />
          <HiddenCard />
          <Banner />
          <LeftSlide/>
          <SlideBanner />
          <Branch />
          <Credit />
        </div>
      </div>
    </>
  )
}

export default SheetOne