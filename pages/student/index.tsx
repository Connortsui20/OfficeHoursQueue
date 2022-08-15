import toast from "react-hot-toast";
import { useState, useEffect, useContext, useCallback } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

import Loader from "../../components/Loader";
import QueueForm from "../../components/QueueForm";
import useQueueItem from "../../lib/hooks/useQueueItem";
import useQueueSize from "../../lib/hooks/useQueueSize";
import useStudentData from "../../lib/hooks/useStudentData";
import enqueueStudent from "../../lib/firestore/enqueueStudent";
import dequeueStudent from "../../lib/firestore/dequeueStudent";
import updateQueueItem from "../../lib/firestore/updateQueueItem";
import { auth } from "../../lib/firebase";
import { UserContext } from "../../lib/context";
import {
    UserProfile,
    StudentData,
    QueueItem,
    QueueDetails,
} from "../../lib/interfaces";

export default function Student() {
    const router = useRouter();

    const userProfile: UserProfile = useContext(UserContext);
    const [user] = useAuthState(auth);

    // undefinedness built into the hook, so no worries
    const studentData: StudentData = useStudentData(userProfile?.id);
    const queueItem: QueueItem = useQueueItem(user?.email);
    const queueSize: number = useQueueSize();
    const [showForm, setShowForm] = useState<boolean>(false);

    useEffect(() => {
        if (!user) {
            router.push("/login");
        }
        if (userProfile) {
            if (userProfile.role === "TA") {
                router.push("/ta");
            } else if (userProfile.role !== "Student") {
                console.error(
                    "Something went wrong, you are not entered as a student"
                );
                router.push("/login");
            }
        }
    }, [user, userProfile]);

    const submitForm = useCallback(
        async (
            location: string,
            questionType: string,
            question: string,
            studentNotes: string
        ): Promise<void> => {
            if (studentData.inQueue) {
                const details: QueueDetails = {
                    location,
                    questionType,
                    question,
                    studentNotes,
                };
                toast.promise(updateQueueItem(details, user.email), {
                    loading: "Updating queue details...",
                    success: "Updated details successfully!",
                    error: "Could not update details\nPlease contact a staff member",
                });
            } else {
                const item: QueueItem = {
                    enqueuedAt: null, // timestamp set later in addQueueItem function
                    position: 0,
                    location,
                    questionType,
                    question,
                    isFrozen: false,
                    studentNotes,
                    TANotes: "",
                };
                toast.promise(
                    enqueueStudent(item, userProfile.id, user.email),
                    {
                        loading: "",
                        success: "Succesfully enqueued student!",
                        error: "Could not enqueue student\nPlease contact a staff member",
                    }
                );
            }

            setShowForm(false);
        },
        [user, showForm, studentData]
    );

    const handleDequeue = async () => {
        await dequeueStudent(userProfile.id, user.email);
        toast.success("Successfully left the queue. Goodbye!");
    };

    const queueDetails = queueItem
        ? {
              location: queueItem.location,
              questionType: queueItem.questionType,
              question: queueItem.question,
              studentNotes: queueItem.studentNotes,
          }
        : null;

    if (user && userProfile && studentData) {
        return (
            <div className="h-screen flex justify-center">
                {showForm ? (
                    <QueueForm
                        handleSubmit={submitForm}
                        queueDetails={queueDetails}
                    />
                ) : (
                    <div>
                        <p>This is the Student Queue page!</p>
                        <p>
                            Hello {userProfile.displayName} aka{" "}
                            {userProfile.username}
                        </p>
                        <p>
                            There are currently {queueSize} people in the queue.
                        </p>
                        {!studentData.inMeeting && !studentData.inQueue && (
                            <div>
                                Student is not in the queue nor in a meeting
                                <button
                                    className="btn-blue"
                                    onClick={() => setShowForm(true)}
                                >
                                    Join Queue
                                </button>
                            </div>
                        )}
                        {!studentData.inMeeting && studentData.inQueue && (
                            <div>
                                Student is currently in the queue!
                                {queueItem && (
                                    <ul>
                                        <li>Position: {queueItem.position}</li>
                                        <li>Location: {queueItem.location}</li>
                                        <li>
                                            Question type:{" "}
                                            {queueItem.questionType}
                                        </li>
                                        <li>Question: {queueItem.question}</li>
                                        <li>Notes: {queueItem.studentNotes}</li>
                                    </ul>
                                )}
                                <button
                                    className="btn-blue"
                                    onClick={() => setShowForm(true)}
                                >
                                    Update details
                                </button>
                                <button
                                    className="btn-blue"
                                    onClick={handleDequeue}
                                >
                                    Leave queue
                                </button>
                            </div>
                        )}
                        {studentData.inMeeting && !studentData.inQueue && (
                            <div>Student is currently in a meeting!</div>
                        )}
                    </div>
                )}
            </div>
        );
    } else {
        return (
            <div>
                {" "}
                <Loader />{" "}
            </div>
        );
    }
}
