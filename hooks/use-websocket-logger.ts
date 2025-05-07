import { app } from "@/app/lib/firebase";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { useEffect } from "react";

export const useWebSocketLogger = () => {
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");
    const db = getFirestore(app);

    ws.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.mouvement === "MOUVEMENT") {
          await addDoc(collection(db, "LOG"), {
            mouvement: data.mouvement,
            timestamp: data.timestamp,
            type: "detection",
            source: data.source || "capteur-pir-uno",
          });
        }
      } catch (err) {
        // Optionnel: afficher une erreur
        console.error("Erreur lors de l'enregistrement du log:", err);
      }
    };

    return () => ws.close();
  }, []);
};
