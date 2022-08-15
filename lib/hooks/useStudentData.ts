import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import { firestore } from "../firebase";
import { StudentData, isStudentData } from "../interfaces";


/**
 * Custom hook that takes queries the studentData collection by firestore ID
 * @param id Firestore ID of a studentData document
 * @returns StudentData document representing private information of a student
 */
export default function useStudentData(id: string | undefined): StudentData {
    
    const [studentData, setStudentData] = useState<StudentData>(null);

    useEffect(() => {
        let unsubscribe;

        if (id) {
            unsubscribe = onSnapshot(
                doc(firestore, "studentData", id),
                (document) => {
                    if (document.exists()) {
                        const data = document.data();
                        if (isStudentData(data)) {
                            setStudentData(data);
                        } else {
                            console.error("studentData document is not valid");
                            setStudentData(null);
                        }
                    } else {
                        console.error("studentData document does not exist");
                        setStudentData(null);
                    }
                }
            );
        } else {
            setStudentData(null);
        }

        return unsubscribe;
    }, [id]);

    return studentData;
}
