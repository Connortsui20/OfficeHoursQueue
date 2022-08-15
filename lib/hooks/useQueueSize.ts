import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import { firestore } from "../firebase";
import { isQueueSizeDoc } from "../interfaces";

/**
 * Custom hook that retrieves the size of the queue from the size document
 * @returns The size of the queue
 * @throws -1
 */
export default function useQueueSize(): number {

    const [queueSize, setQueueSize] = useState<number>(-1);

    useEffect(() => {
        let unsubscribe;
        unsubscribe = onSnapshot(
            doc(firestore, "queue", "--size--"),
            (document) => {
                if (document.exists()) {
                    const data = document.data();
                    if (isQueueSizeDoc(data)) {
                        setQueueSize(data.size);
                    } else {
                        console.error("Queue size document is not valid");
                        setQueueSize(-1);
                    }
                } else {
                    console.error("Queue size document is missing!!");
                    setQueueSize(-1);
                }
            }
        );
        return unsubscribe;
    }, []);

    return queueSize;
}
