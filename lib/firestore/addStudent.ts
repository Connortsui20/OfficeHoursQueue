import { addDoc, collection } from "firebase/firestore";

import { firestore } from "../firebase";
import { StudentData } from "../interfaces";

/**
 * Creates a student in the "studentData" collection
 * @async Firestore add
 * @returns A promise containing the auto-generated ID of that document
 * @throws "" (Empty String)
 */
export default async function addStudent(): Promise<string> {

    const studentDataRef = collection(firestore, "studentData");

    const newStudent: StudentData = {
        meetingsAttended: 0,
        penalties: 0,
        inQueue: false,
        inMeeting: false,
    };

    try {
        const studentDoc = await addDoc(studentDataRef, newStudent);
        return studentDoc.id;
    } catch (err) {
        console.error("Error creating a new student:", err);
        return "";
    }

}
