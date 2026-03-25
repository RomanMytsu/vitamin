import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  startAfter,
  updateDoc,
  where,
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

export async function getCatalogPage<T>({
  pageSize = 4,
  lastDoc,
  category,
  sale,
}: {
  pageSize?: number;
  lastDoc?: QueryDocumentSnapshot;
  category?: string;
  sale?: boolean;
} = {}) {
  const colRef = collection(db, "catalog");

  const constraints: QueryConstraint[] = [orderBy("sort"), limit(pageSize)];

  if (category && category !== "All categories") {
    constraints.push(where("category", "==", category));
  }

  if (sale) {
    constraints.push(where("sale", "==", true));
  }

  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }

  const q = query(colRef, ...constraints);
  const snapshot = await getDocs(q);

  return {
    data: snapshot.docs.map((doc) => doc.data() as T),
    lastDoc: snapshot.docs[snapshot.docs.length - 1],
  };
}

export async function updateDocument<T extends Record<string, unknown>>(
  collectionName: string,
  docId: string,
  data: UpdateData<T>,
): Promise<void> {
  const docRef = doc(db, collectionName, docId);

  await updateDoc(docRef, data);
}
