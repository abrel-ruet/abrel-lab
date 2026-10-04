import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  getCountFromServer,
  query,
  orderBy,
  limit,
  where,
  onSnapshot,
  serverTimestamp,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const COLLECTIONS = {
  team: "team",
  domains: "domains",
  publications: "publications",
  projects: "projects",
  news: "news",
  announcements: "announcements",
  certificates: "certificates",
  resources: "resources",
  recruitment: "recruitmentApplications",
  contact: "contactMessages",
  newsletter: "newsletterSubscribers",
} as const;

/** Firestore Timestamps can't cross the server→client boundary; flatten them to ISO strings. */
function plain(value: unknown): unknown {
  if (value && typeof value === "object") {
    if ("toDate" in value && typeof (value as { toDate: unknown }).toDate === "function") {
      return (value as { toDate: () => Date }).toDate().toISOString();
    }
    if (Array.isArray(value)) return value.map(plain);
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, plain(v)]));
  }
  return value;
}

function withId<T>(id: string, data: Record<string, unknown>): T {
  return { id, ...(plain(data) as Record<string, unknown>) } as T;
}

export async function fetchCollection<T>(
  name: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const q = query(collection(db, name), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => withId<T>(d.id, d.data()));
}

export async function fetchDocByField<T>(
  name: string,
  field: string,
  value: string
): Promise<T | null> {
  const q = query(collection(db, name), where(field, "==", value), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return withId<T>(snap.docs[0].id, snap.docs[0].data());
}

export async function fetchDocById<T>(name: string, id: string): Promise<T | null> {
  const snap = await getDoc(doc(db, name, id));
  return snap.exists() ? withId<T>(snap.id, snap.data()) : null;
}

export async function countCollection(name: string): Promise<number> {
  const snap = await getCountFromServer(collection(db, name));
  return snap.data().count;
}

export function subscribeCollection<T>(
  name: string,
  cb: (items: T[]) => void,
  constraints: QueryConstraint[] = [],
  onError?: (error: Error) => void
) {
  const q = query(collection(db, name), ...constraints);
  return onSnapshot(
    q,
    (snap) => {
      cb(snap.docs.map((d) => withId<T>(d.id, d.data())));
    },
    (error) => {
      console.error(`Firestore subscription error on "${name}":`, error.message);
      onError?.(error);
    }
  );
}

function stripMeta(data: Record<string, unknown>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, createdAt, updatedAt, ...rest } = data;
  return rest;
}

export async function createDoc(name: string, data: Record<string, unknown>) {
  const ref = await addDoc(collection(db, name), {
    ...stripMeta(data),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateDocById(
  name: string,
  id: string,
  data: Record<string, unknown>
) {
  await updateDoc(doc(db, name, id), { ...stripMeta(data), updatedAt: serverTimestamp() });
}

export async function deleteDocById(name: string, id: string) {
  await deleteDoc(doc(db, name, id));
}

export { orderBy, limit, where };
export type { QueryConstraint };
