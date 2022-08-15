import {
    writeBatch,
    doc,
    serverTimestamp,
    increment,
} from "firebase/firestore";

import { QueueItem } from "../interfaces";
import { firestore } from "../firebase";

/**
 * Enqueues a student by updating the studentData document,
 * adds a QueueItem document to the "queue" collection,
 * and finally increments the size of the queue, all in a batch write.
 * @async Firestore batch write
 * @param {QueueItem} item
 * @param {string} id
 * @param {string} email
 * @returns Undefined
 */
export default async function enqueueStudent(
    item: QueueItem,
    id: string,
    email: string
) {
    const batch = writeBatch(firestore);

    const studentRef = doc(firestore, "studentData", id);
    batch.update(studentRef, { inQueue: true });

    const queueRef = doc(firestore, "queue", email);
    item.enqueuedAt = serverTimestamp();
    batch.set(queueRef, item);

    const queueSizeRef = doc(firestore, "queue", "--size--");
    batch.update(queueSizeRef, { size: increment(1) });

    await batch.commit();
}
