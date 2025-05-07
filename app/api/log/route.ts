import { app } from "@/app/lib/firebase";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const db = getFirestore(app);
    const data = await req.json();
    if (!data.mouvement || !data.timestamp) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }
    await addDoc(collection(db, "LOG"), {
      mouvement: data.mouvement,
      timestamp: data.timestamp,
      type: "detection",
      source: data.source || "capteur-pir-uno",
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement du log" },
      { status: 500 }
    );
  }
}
