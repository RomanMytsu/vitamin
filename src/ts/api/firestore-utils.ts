import {
  collection,
  doc,
  getDocs,
  query,
  QueryConstraint,
  updateDoc,
  type UpdateData,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export async function getCollectionsData<T>(
  collectionName: string,
  ...constraints: QueryConstraint[]
): Promise<T[]> {
  const colRef = collection(db, collectionName);
  const q = query(colRef, ...constraints);
  const result = await getDocs(q);
  const data: T[] = result.docs.map((doc) => {
    const d = doc.data();
    return { ...d } as T;
  });
  return data;
}

export async function updateDocument<T extends Record<string, unknown>>(
  collectionName: string,
  docId: string,
  data: UpdateData<T>,
): Promise<void> {
  const docRef = doc(db, collectionName, docId);

  await updateDoc(docRef, data);
}
