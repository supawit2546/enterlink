import React from "react";

const VideoCard = ({ videoId}) => {
  return (
    <div className="video-card bg-white py-7 px-7">
      {/* ฝัง YouTube Video */}
      <div className='flex justify-between items-center mb-3'> 
         <h2 className='text-lg font-medium'>วีดีโอล่าสุด</h2>
         <button
             className='text-orange-600 hover:text-gray-500 outline-none text-sm'
         >
             วีดีโออื่นๆ
         </button>
     </div>
      <div className="video-frame">
        <iframe
          width="100%"
          height="315"
          src={`https://www.youtube.com/embed/${videoId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default VideoCard;
