import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, limit, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, onSnapshot, DocumentData } from 'firebase/firestore';

export interface FirestoreHookOptions {
  realtime?: boolean;
  limitCount?: number;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
}

export const useFirestore = <T = DocumentData>(
  collectionName: string,
  options: FirestoreHookOptions = {}
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    realtime = false,
    limitCount,
    orderByField,
    orderDirection = 'desc'
  } = options;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let q = query(collection(db, collectionName));

        if (orderByField) {
          q = query(q, orderBy(orderByField, orderDirection));
        }

        if (limitCount) {
          q = query(q, limit(limitCount));
        }

        if (realtime) {
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as T[];
            setData(docs);
            setLoading(false);
          });

          return () => unsubscribe();
        } else {
          const snapshot = await getDocs(q);
          const docs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as T[];
          setData(docs);
          setLoading(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, realtime, limitCount, orderByField, orderDirection]);

  const addDocument = async (data: Omit<T, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      return docRef.id;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al agregar documento');
    }
  };

  const updateDocument = async (id: string, data: Partial<T>) => {
    try {
      await updateDoc(doc(db, collectionName, id), data);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al actualizar documento');
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al eliminar documento');
    }
  };

  const getDocument = async (id: string) => {
    try {
      const docSnap = await getDoc(doc(db, collectionName, id));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al obtener documento');
    }
  };

  return {
    data,
    loading,
    error,
    addDocument,
    updateDocument,
    deleteDocument,
    getDocument,
  };
};

export const useFirestoreQuery = <T = DocumentData>(
  collectionName: string,
  field: string,
  operator: any,
  value: any,
  options: FirestoreHookOptions = {}
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    realtime = false,
    limitCount,
    orderByField,
    orderDirection = 'desc'
  } = options;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let q = query(
          collection(db, collectionName),
          where(field, operator, value)
        );

        if (orderByField) {
          q = query(q, orderBy(orderByField, orderDirection));
        }

        if (limitCount) {
          q = query(q, limit(limitCount));
        }

        if (realtime) {
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as T[];
            setData(docs);
            setLoading(false);
          });

          return () => unsubscribe();
        } else {
          const snapshot = await getDocs(q);
          const docs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as T[];
          setData(docs);
          setLoading(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, field, operator, value, realtime, limitCount, orderByField, orderDirection]);

  return { data, loading, error };
};
