import React from 'react';

const PriceContainer = () => {
  return (
    <section className="bg-white h-screen landing-container">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h2 className="mb-4 text-5xl font-medium text-gray-900">
            เลือกบริการที่คุณสนใจ
          </h2>
          <p className="mb-5 font-light text-black sm:text-xl">
            คุณสามารถเลือกแพคเกจที่สนใจ เพื่อให้ใช้บริการของเราได้อย่างมีประสิทธิภาพสูงสุดและเลือกให้เข้ากับธุรกิจของคุณมากที่สุด
          </p>
        </div>
        <div className='flex flex-col md:flex-row items-center justify-center space-x-0 space-y-6 md:space-x-6 md:space-y-0'>
            {/* Block1 */}
          <div className='border border-black h-96 w-64 text-center items-center py-3 px-3 rounded-xl pt-10 justify-center'>
            <p className='text-sm m-auto'>แพคเกจเริ่มต้น</p>
            <div className='flex justify-center items-center space-x-1 mt-1'>
              <span className='text-black-500 text-2xl'>ราคา</span>
              <h2 className='header-color font-medium text-3xl'>ฟรี</h2>
            </div>
            <p className='bg-gray-100 rounded-full w-max px-3 text-sm m-auto mt-2 mb-5'>ราคา/เดือน</p>
            <p>บลาๆๆ</p>
            <hr className='style1 ml-7 mr-7 mt-2 mb-2'></hr>
            <p>บลาๆๆ</p>
            <hr className='style1 ml-7 mr-7 mt-2 mb-2'></hr>
            <p>บลาๆๆ</p>
            <hr className='style1 ml-7 mr-7 mt-2 mb-2'></hr>
            <p>บลาๆๆ</p>
            <hr className='style1 ml-7 mr-7 mt-2 mb-2'></hr>
            <p>บลาๆๆ</p>
          </div>
          {/* Block2 */}
          <div className='bg-primary h-96 w-64 text-center items-center py-3 px-3 rounded-xl pt-10 justify-center'>
            <p className='text-sm m-auto text-white'>แพคเกจเริ่มต้น</p>
            <div className='flex justify-center items-center space-x-2 mt-1'>
              <span className='text-2xl text-white'>ราคา</span>
              <h2 className='font-medium text-3xl text-white'>50.-</h2>
            </div>
            <p className='bg-gray-100 rounded-full w-max px-3 text-sm m-auto mt-2 mb-5'>ราคา/ต่อปี</p>
            <p className='text-white'>บลาๆๆ</p>
            <hr className='style2 ml-7 mr-7 mt-2 mb-2'></hr>
            <p className='text-white'>บลาๆๆ</p>
            <hr className='style2 ml-7 mr-7 mt-2 mb-2'></hr>
            <p className='text-white'>บลาๆๆ</p>
            <hr className='style2 ml-7 mr-7 mt-2 mb-2'></hr>
            <p className='text-white'>บลาๆๆ</p>
            <hr className='style2 ml-7 mr-7 mt-2 mb-2'></hr>
            <p className='text-white'>บลาๆๆ</p>
          </div>
            {/* Block3 */}
          <div className='border border-black h-96 w-64 text-center items-center py-3 px-3 rounded-xl pt-10 justify-center'>
            <p className='text-sm m-auto'>แพคเกจเริ่มต้น</p>
            <div className='flex justify-center items-center space-x-2 mt-1'>
              <span className='text-black-500 text-2xl'>ราคา</span>
              <h2 className='header-color font-medium text-3xl'>1,000.-</h2>
            </div>
            <p className='bg-gray-100 rounded-full w-max px-3 text-sm m-auto mt-2 mb-5'>ราคา/ต่อปี</p>
            <p>บลาๆๆ</p>
            <hr className='style1 ml-7 mr-7 mt-2 mb-2'></hr>
            <p>บลาๆๆ</p>
            <hr className='style1 ml-7 mr-7 mt-2 mb-2'></hr>
            <p>บลาๆๆ</p>
            <hr className='style1 ml-7 mr-7 mt-2 mb-2'></hr>
            <p>บลาๆๆ</p>
            <hr className='style1 ml-7 mr-7 mt-2 mb-2'></hr>
            <p>บลาๆๆ</p>
          </div>
        </div>
        <button className='m-auto text-center flex pt-10'>สอบถามฝ่ายขายติดต่อ 08-2546-0439</button>
      </div>
    </section>
  );
};

export default PriceContainer;
