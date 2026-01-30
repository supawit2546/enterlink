import React from 'react'
import Image from 'next/image'

const Banner = () => {
    return (
        <div className='px-7'>
            <Image
                src='/upload/banner.webp'
                alt=''
                width={1000}
                height={1000}
                className='w-full h-full object-cover rounded-md'
            />
        </div>
    )
}

export default Banner