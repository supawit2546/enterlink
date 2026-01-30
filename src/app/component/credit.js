import React from 'react'
import Image from 'next/image'

const Credit = () => {
    return (
        <div className='flex justify-center pt-5'>
            <span className='items-center flex p-1'>สร้างโดย</span>
            <Image
                src="/images/logo.png"
                alt="Icon"
                width={100}
                height={100}
                className="w-fit h-fit w-13"
            />
        </div>
    )
}

export default Credit