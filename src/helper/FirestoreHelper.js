import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    updateDoc
} from "firebase/firestore";
import { db } from "../firebase";

export const getCollection = async (collectionName) => {
    const snapshot = await getDocs(collection(db, collectionName));
   
    return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
    }));
};

export const getDocument = async (collectionName, id) => {
    const snapshot = await getDoc(doc(db, collectionName, id));

    if (!snapshot.exists()) {
        throw new Error("Product not found");
    }

    return {
        id: snapshot.id,
        ...snapshot.data()
    };
};

export const createDocument = async (collectionName, data) => {
    const docRef = await addDoc(collection(db, collectionName), data);
    return {
        id: docRef.id,
        ...data
    };
};

export const updateDocument = async (collectionName, id, data) => {
    const documentRef = doc(db, collectionName, id);

    await updateDoc(documentRef, data);

    return {
        id,
        ...data
    };
};

export const deleteDocument = async (collectionName, id) => {
    await deleteDoc(doc(db, collectionName, id));

    return {
        id
    };
};