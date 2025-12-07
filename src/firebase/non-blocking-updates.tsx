// NOTE: This file is a placeholder to resolve module not found errors.
// It will be properly implemented in the next steps.
import {
    DocumentReference,
    CollectionReference,
    addDoc,
    setDoc,
    deleteDoc,
    SetOptions
} from 'firebase/firestore';

export function addDocumentNonBlocking<T>(
    collectionRef: CollectionReference<T>,
    data: T
) {
    return addDoc(collectionRef, data);
}

export function setDocumentNonBlocking<T>(
    docRef: DocumentReference<T>,
    data: T,
    options?: SetOptions
) {
    if (options) {
        return setDoc(docRef, data, options);
    }
    return setDoc(docRef, data);
}

export function deleteDocumentNonBlocking(docRef: DocumentReference) {
    return deleteDoc(docRef);
}
