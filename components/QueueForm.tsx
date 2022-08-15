import { useState, useMemo } from "react";
import toast from "react-hot-toast";

import Loader from "../components/Loader";
import { QueueArgs } from "../lib/interfaces";

//* Takes in a function that will use the form contents
export default function QueueForm(props: QueueArgs) {
    const [location, setLocation] = useState<string>("");
    const [questionType, setQuestionType] = useState<string>("");
    const [question, setQuestion] = useState("");
    const [studentNotes, setStudentNotes] = useState("");

    const [showLoading, setShowLoading] = useState<boolean>(false);

    const submitForm = async (e) => {
        e.preventDefault();
        if (location && questionType && question && studentNotes) {
            setShowLoading(true);
            await props.handleSubmit(
                location,
                questionType,
                question,
                studentNotes
            );
            setShowLoading(false);
        } else {
            toast.error("Please enter something into each field");
            setShowLoading(false);
        }
    };

    useMemo(() => {
        if (props.queueDetails) {
            setLocation(props.queueDetails.location);
            setQuestionType(props.queueDetails.questionType);
            setQuestion(props.queueDetails.question);
            setStudentNotes(props.queueDetails.studentNotes);
        } else {
            setLocation("");
            setQuestionType("");
            setQuestion("");
            setStudentNotes("");
        }
    }, [props]);

    return (
        <>
            {showLoading ? (
                <div>
                    <Loader />
                </div>
            ) : (
                <div>
                    <form onSubmit={submitForm}>
                        <div>Enter Location</div>
                        <input
                            className=""
                            name="location"
                            value={location}
                            onChange={(e) => {
                                setLocation(e.target.value);
                            }}
                        />
                        <div>Enter Question type</div>
                        <input
                            name="question type"
                            value={questionType}
                            onChange={(e) => {
                                setQuestionType(e.target.value);
                            }}
                        />
                        <div>Enter Question</div>
                        <input
                            name="question"
                            value={question}
                            onChange={(e) => {
                                setQuestion(e.target.value);
                            }}
                        />
                        <div>Enter any Notes and/or Comments!</div>
                        <input
                            name="notes"
                            value={studentNotes}
                            onChange={(e) => {
                                setStudentNotes(e.target.value);
                            }}
                        />
                        <button className="btn-blue" type="submit"> Submit </button>
                    </form>
                </div>
            )}
        </>
    );
}
