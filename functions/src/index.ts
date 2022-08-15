// import firebaseConfig from "../../lib/firebaseConfig";
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

//! https://firebase.google.com/docs/emulator-suite/connect_functions
//* https://firebase.google.com/docs/reference/admin/node/firebase-admin.firestore

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const firestore = admin.firestore();

//*****************************************************************************/
//* Firebase cloud functions

export const setPosition = functions.firestore
    .document("queue/{queueID}")
    .onCreate(async (snap, context) => {
        const size = await getQueueSize();
        functions.logger.log(
            "Size at the start of setPosition function: ",
            size
        );

        if (size >= 0) {
            snap.ref.update({ position: size });
            functions.logger.info("Size updated to: ", size);
        } else {
            functions.logger.error(
                "Something went wrong retrieving the queue size"
            );
        }
    });

export const decrementQueue = functions.firestore
    .document("queue/{queueID}")
    .onDelete(async (snap, context) => {
        const size = await getQueueSize();
        functions.logger.info(
            "Size at the start of decrementQueue function: ",
            size
        );

        if (size < 0) {
            functions.logger.error(
                "Something went wrong retrieving the queue size"
            );
        } else if (size == 0) {
            functions.logger.info("Queue is empty, nothing to be done!");
        } else {
            // size >= 1
            await decrementPositionsAfter(snap.data().position);
        }
    });

//TODO create a sanitizing function onWrite to check positions align with the timestamps

//*****************************************************************************/
//* Helper functions

//* Retrieves the size of the current queue from --size-- document
async function getQueueSize(): Promise<number> {
    let size = -1;
    const sizeRef = firestore.collection("queue").doc("--size--");

    await sizeRef
        .get()
        .then((doc) => {
            if (doc.exists && doc.data()) {
                size = doc.data()?.size;
                functions.logger.log("Size is now:", size);
            } else {
                functions.logger.log("Document does not exist");
            }
        })
        .catch((err) => {
            functions.logger.log("Something went wrong in getQueueSize:", err);
        });

    return size;
}

async function decrementPositionsAfter(position: number) {
    const queueRef = firestore.collection("queue");

    await queueRef
        .get()
        .then((queueSnap) => {
            queueSnap.forEach((doc) => {
                if (doc.data().position > position) {
                    doc.ref.update({
                        position: admin.firestore.FieldValue.increment(-1),
                    });
                } else if (doc.data().position === position) {
                    functions.logger.log("2 queue items had the same position");
                }
            });
        })
        .catch((err) => {
            functions.logger.log(
                "Something went wrong in decrementAllPositions:",
                err
            );
        });
}
