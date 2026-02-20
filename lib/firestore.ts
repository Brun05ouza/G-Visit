import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore"
import { db } from "./firebase"
import type { FullFormData } from "./schema"

// Helper para verificar se está em Mock Mode (Sem credenciais de Firebase)
const isMockMode = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

export async function saveVisit(data: FullFormData): Promise<string> {
  if (isMockMode) {
    const id = Math.random().toString(36).substring(7);
    const visit = { id, ...data, status: "pending", createdAt: new Date().toISOString() };
    const saved = JSON.parse(localStorage.getItem("@gevisit:visits") || "[]");
    localStorage.setItem("@gevisit:visits", JSON.stringify([...saved, visit]));

    // Simula a latência da rede
    await new Promise(resolve => setTimeout(resolve, 800));
    return id;
  }

  const docRef = await addDoc(collection(db, "visits"), {
    ...data,
    createdAt: serverTimestamp(),
    status: "pending",
  })
  return docRef.id
}

// Recebe a data no formato YYYY-MM-DD (horário local, não UTC)
export async function getVisitsByDate(date: string): Promise<(FullFormData & { id: string })[]> {
  if (isMockMode) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const saved = JSON.parse(localStorage.getItem("@gevisit:visits") || "[]") as (FullFormData & { id: string; status: string; createdAt: string })[];
    return saved
      .filter(v => v.preferredDate === date)
      .sort((a, b) => a.preferredTime.localeCompare(b.preferredTime));
  }

  const q = query(
    collection(db, "visits"),
    where("preferredDate", "==", date)
  )

  const snapshot = await getDocs(q)
  const visits = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as (FullFormData & { id: string })[]

  return visits.sort((a, b) => a.preferredTime.localeCompare(b.preferredTime))
}
