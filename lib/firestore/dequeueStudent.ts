import { writeBatch, doc, increment } from "firebase/firestore";

import { firestore } from "../firebase";

/**
 * Dequeues a student by updating the studentData document,
 * deleting the QueueItem document from the "queue" collection,
 * and finally decrementing the size of the queue,
 * all in a batch write.
 * @param {string} id
 * @param {string} email
 * @returns Undefined
 */
export default async function dequeueStudent(id: string, email: string) {

    const batch = writeBatch(firestore);

    const studentRef = doc(firestore, "studentData", id);
    batch.update(studentRef, { inQueue: false });

    const queueRef = doc(firestore, "queue", email);
    batch.delete(queueRef);

    const queueSizeRef = doc(firestore, "queue", "--size--");
    batch.update(queueSizeRef, { size: increment(-1) });

    try {
        await batch.commit();
    } catch (err) {
        console.error("Error trying to dequeue a student (batch write):", err);
    }
}
