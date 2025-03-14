import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebase"; 
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";

const DiscountPage = () => {
  const { slug } = useParams();
  const [discountCode, setDiscountCode] = useState("");
  const [message, setMessage] = useState("");
  const [discountOwner, setDiscountOwner] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setDiscountOwner("");

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
          setDiscountOwner(existingDiscount.email || "Email no disponible");

          if (existingDiscount.isDiscountClaimed) {
            setMessage(
              <span className="font-bold text-red-500">Este código ya fue utilizado.</span>
            );
          } else {
            await updateDoc(discountRef, {
              discountCodes: arrayRemove(existingDiscount)
            });
            await updateDoc(discountRef, {
              discountCodes: arrayUnion({
                ...existingDiscount,
                isDiscountClaimed: true,
              })
            });
            setMessage(
              <span className="font-bold text-green-700">
                ¡Código válido! Descuento aplicado.
              </span>
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
    <div className="flex flex-col items-center justify-center w-screen h-screen gap-5">
      <h2 className="text-xl font-bold text-black">Ingresa el código de descuento</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center gap-5 sm:flex-row"
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
          className="px-4 py-2 transition-all duration-75 rounded bg-c text-b1 hover:scale-105"
        >
          {isLoading ? "Verificando..." : "Verificar código"}
        </button>
      </form>
      
      {message && <p className="w-full px-3 text-center">{message}</p>}

      {discountOwner && (
        <p className="w-full px-3 text-center">
          Código perteneciente a: <span className="font-bold">{discountOwner}</span>
        </p>
      )}
    </div>
  );
};

export default DiscountPage;
