
import React from 'react';

export default function LogoExplication({logoImg, logoName, LogoExplication, setLogoExplication}) {
    return (
        <section className='w-screen h-screen z-30 absolute top-0 left-0 bg-black bg-opacity-55 flex flex-col justify-center items-center'
        onClick={() => setLogoExplication(false)}>
            <article className='p-4 bg-b1 flex flex-row justify-center items-center rounded-xl'>
                <img
                src={logoImg}
                alt={logoName}
                className='w-32'>
                </img>

                <div className='flex flex-col text-left text-white p-4'>
                    <h2 className='text-c text-2xl font-bold'>{logoName}</h2>
                    <p className='text-black text-opacity-85'>{LogoExplication}</p>
                </div>
            </article>
        </section>
    );
}