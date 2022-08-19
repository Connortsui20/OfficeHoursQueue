import { useState, useEffect, useContext, useCallback } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

import useQueue from "../../lib/hooks/useQueue";
import Loader from "../../components/Loader";
import { auth } from "../../lib/firebase";

export default function TAHome(props) {
    console.log("At TA Home");

    const queue = useQueue();
    const [user] = useAuthState(auth);

    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/login");
        }
    }, [user]);

    if (user && queue) {
        queue.sort((a, b) => {
            if (a.position !== 0 && b.position !== 0) {
                return a.position - b.position;
            } else if (a.position === 0) {
                return Infinity; // force zeroes to be placed last
            } else if (b.position === 0) {
                return -Infinity;
            }
        });
        const queueList = queue.map(displayQueueData);

        return (
            <div>
                This is the Queue
                {queueList}
            </div>
        );
    } else {
        return (
            <div>
                <Loader />
            </div>
        );
    }
}

function displayQueueData(data) {
    return (
        <div key={data.email}>
            <ul>
                <li>Email: {data.email}</li>
                <li>Location: {data.location}</li>
                <li>Question Type: {data.questionType}</li>
                <li>Question: {data.question}</li>
                <li>Position: {data.position}</li>
            </ul>
        </div>
    );
}
