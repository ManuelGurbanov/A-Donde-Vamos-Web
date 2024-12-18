import React from "react";


const TeamMember = ({ name, role }) => {
    return (
        <div className="w-2/3 flex flex-col items-center text-center justify-center bg-white rounded-xl px-6 py-2 ring-2 ring-c2">
            <h2 className="text-base font-semibold text-c2">{name}</h2>
            <h3 className="text-sm font-semibold text-c">{role}</h3>
        </div>
    );
}

export default TeamMember;
