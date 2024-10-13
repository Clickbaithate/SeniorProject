import React from "react";

const SocialActivityCard = ({ activity }) => {

  return (

    <div className="flex items-center ml-6">

      <img 
        src={activity.pfp}
        className="w-12 rounded-full"
      />

      <div className="flex flex-col ml-6 " >
        <div className="font-body text-theme" > {activity.message} </div>
        <div className="font-body text-gray-500" > {activity.time} </div>
      </div>

    </div>

  );

}

export default SocialActivityCard;