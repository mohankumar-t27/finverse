'use client';

import {
    DocumentReference,
    CollectionReference,
    addDoc,
    setDoc,
    deleteDoc,
    SetOptions,
    WithFieldValue
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

export function addDocumentNonBlocking<T>(
    collectionRef: CollectionReference<T>,
    data: WithFieldValue<T>
) {
    addDoc(collectionRef, data)
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: collectionRef.path,
                operation: 'create',
                requestResourceData: data,
            } satisfies SecurityRuleContext);
            errorEmitter.emit('permission-error', permissionError);
        });
}

export function setDocumentNonBlocking<T>(
    docRef: DocumentReference<T>,
    data: WithFieldValue<T>,
    options?: SetOptions
) {
    const operation = options && 'merge' in options ? 'update' : 'create';
    setDoc(docRef, data, options || {})
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: docRef.path,
                operation: operation,
                requestResourceData: data,
            } satisfies SecurityRuleContext);
            errorEmitter.emit('permission-error', permissionError);
        });
}

export function deleteDocumentNonBlocking(docRef: DocumentReference) {
    deleteDoc(docRef)
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: docRef.path,
                operation: 'delete',
            } satisfies SecurityRuleContext);
            errorEmitter.emit('permission-error', permissionError);
        });
}
