import React from 'react'
import { useState } from 'react';
import Image from 'next/image';
const HiddenCard = () => {
    const products = [
        { name: "Laptop", image: "1.webp" },
        { name: "PC", image: "2.webp" },
        { name: "Accessories", image: "3.webp" },
        { name: "Gaming", image: "4.webp" }
    ];
    const [showMore, setShowMore] = useState(false);
  return (
    <div className='px-7 py-4'>
     <div className=''>
    <div className='flex justify-between items-center mb-3'> 
         <h2 className='text-lg font-medium'>หมวดหมู่สินค้า</h2>
         <button
             className='text-orange-600 hover:text-gray-500 outline-none text-sm'
             onClick={() => setShowMore(!showMore)}
         >
             {showMore ? 'ซ่อน' : 'ดูเพิ่มเติม'}
         </button>
     </div>
</div>
    <div className={`grid grid-cols-2 gap-2 transition-all duration-300`}>
        {products.slice(0, showMore ? 4 : 2).map((product, index) => (
            <div key={index} className='rounded-lg shadow-sm p-1 mb:pt-3 flex flex-col items-center'>
                <Image
                    src={`/upload/${product.image}`}
                    alt={product.name}
                    width={100}
                    height={100}
                    className='w-full h-full object-cover rounded-md'
                />
                <p className='text-center mt-2 font-semibold'>{product.name}</p>
            </div>
        ))}
    </div>
    </div>
  )
}

export default HiddenCard