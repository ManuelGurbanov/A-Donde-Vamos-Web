import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebase"; 
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";

const DiscountPage = () => {
  const { slug } = useParams();
  const [discountCode, setDiscountCode] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (!discountCode || discountCode.length !== 6 || isNaN(discountCode)) {
      setMessage(
        <span className="text-red-500">
          Por favor, ingresa un código de descuento válido de 6 dígitos.
        </span>
      );
      setIsLoading(false);
      return;
    }

    try {
      const discountRef = doc(db, "discounts", slug);
      const discountSnap = await getDoc(discountRef);

      if (discountSnap.exists()) {
        const discountCodes = discountSnap.data().discountCodes || [];
        const existingDiscount = discountCodes.find(
          (discount) => discount.code === discountCode
        );

        if (existingDiscount) {
          if (existingDiscount.isDiscountClaimed) {
            setMessage(
              <span className="text-red-500">Este código ya fue utilizado.</span>
            );
          } else {
            // Primero, removemos el objeto original del array
            await updateDoc(discountRef, {
              discountCodes: arrayRemove(existingDiscount)
            });
            // Luego, agregamos el objeto actualizado
            await updateDoc(discountRef, {
              discountCodes: arrayUnion({
                ...existingDiscount,
                isDiscountClaimed: true,
              })
            });
            setMessage(
              <>
                <span className="text-green-200 font-bold">¡Código válido!</span>
              </>
            );
          }
        } else {
          setMessage(
            <span className="text-red-500">Código de descuento no encontrado.</span>
          );
        }
      } else {
        setMessage(
          <span className="text-red-500">
            No se encontraron códigos de descuento para este producto.
          </span>
        );
      }
    } catch (error) {
      console.error("Error al verificar el código de descuento: ", error);
      setMessage(
        <span className="text-red-500">Ocurrió un error al verificar el código.</span>
      );
    }

    setIsLoading(false);
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-5">
      <h2 className="text-black text-xl font-bold">Ingresa el código de descuento</h2>
      <form
        onSubmit={handleSubmit}
        className="flex gap-5 flex-col sm:flex-row items-center justify-center"
      >
        <input
          type="text"
          maxLength="6"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          placeholder="Código de descuento"
          className="p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-c text-b1 hover:scale-105 transition-all duration-75 rounded"
        >
          {isLoading ? "Verificando..." : "Verificar código"}
        </button>
      </form>
      {message && <p className="p-3 w-full text-center bg-black">{message}</p>}
    </div>
  );
};

export default DiscountPage;
