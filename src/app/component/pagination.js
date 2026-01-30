import React from 'react'
import Link from 'next/link'

const Pagination = () => {
    return (
        <div className='absolute py-5 px-8'>
            <div className='flex items-center justify-center'>
            <i className="fi fi-sr-angle-small-left"></i>
            <Link href="/" className='mb-1 ml-1 font-medium'>ย้อนกลับ </Link>
            </div>
</div>
    )
}

export default Pagination