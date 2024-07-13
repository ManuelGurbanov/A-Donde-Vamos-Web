import React from "react"
import { useState } from "react"
import Cap1 from "./img/Cap1.JPG"
import Cap2 from "./img/Cap2.JPG"
const cards = [
  {
    name: 'Pantalla Principal',
    description: 'Deslizá para ver las cafeterías como en Tik Tok',
    link : 'https://i.ibb.co/tqWhLTD/captura-rese-a.jpg',
  },
  {
    name: 'Información',
    description: '¿Querés saber si es apto vegano? ¿o sin TAC?',
    link : 'https://i.ibb.co/tqWhLTD/captura-rese-a.jpg',
  },
  {
    name: 'Dejá tu reseña',
    description: '¿Te gustó el café? Comentalo!',
    link : 'https://i.ibb.co/tqWhLTD/captura-rese-a.jpg',
  },
]




export default function Banner() {

  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
    window.open("https://www.googleplay.com", "_blank");
  }

  const buttonText = isClicked ? "¡Gracias por Descargar!" : "Ver en Google Play";
  const buttonClassName = isClicked ? "mt-6 bg-zinc-200 text-white font-semibold py-3 px-6 rounded-lg" : "mt-6 bg-coffe hover:scale-105 transition duration-75 text-white font-semibold py-3 px-6 rounded-lg";
  
  return (
    <div className="relative py-24 overflow-hidden bg-zinc-900 isolate sm:py-32">
      <img
        src="https://wallpapers.com/images/featured/cup-of-coffee-4tc627vmaw0tiqiv.jpg"
        className="absolute inset-0 object-cover object-right w-full h-full -z-10 md:object-center blur-md brightness-50"
        alt="bg"
      />

      <div className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl">
        <div
          className="aspect-[1097/845] w-[68.5625rem]"
        />
      </div>
      <div className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu">
        <div
          className="aspect-[1097/845] w-[68.5625rem]"
        />
      </div>
      <div className="px-8 mx-auto max-w-7xl lg:px-8">
        <div className="flex-col w-full mx-auto lg:mx-0">
          <h2 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">A Dónde Vamos</h2>
          <p className="w-full mt-6 text-2xl leading-8 text-gray-300">
            Aplicación diseñada para encontrar las mejores cafeterías en Buenos Aires, Argentina
          </p>
        </div>

        <button
          onClick={handleClick}
          type="button"
          className={buttonClassName}
        >
          {buttonText}
        </button>

        <div className="grid grid-cols-1 gap-6 mx-auto mt-16 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8 md:grid-cols-2">
          {cards.map((card) => (
            <div key={card.name} className="flex p-6 ml-0 transition gap-x-4 rounded-xl bg-zinc-900 ring-1 ring-inset ring-coffe hover:ring-b_coffe sm:w-[200px] lg:w-[350px] h-[775px] ">
              <div className="m-auto text-base leading-7">
                <img
                    src={card.link}
                    className="w-auto h-auto rounded-xl"
                    alt="screenshot"
                />
                <h3 className="mt-4 font-semibold text-white">{card.name}</h3>
                <p className="mt-2 text-gray-300">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}