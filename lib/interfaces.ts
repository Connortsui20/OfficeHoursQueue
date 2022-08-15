// interface UserData_t { //* Context
//     email: string, //* ID of the document
//     profile: UserProfile, //* public profile
//     data: StudentData | TAData | null, //* user specific data
// }

// export type UserData = UserData_t | null; //* Mimic an option

// export function isUserData(obj: any): obj is UserData {

//     if (!obj) return false;
//     return ("email" in obj
//         && obj.email // obj.email !== ""
//         && isUserProfile(obj.profile)
//         && "data" in obj
//         && (((isStudentData(obj.data)
//             && obj.profile.role === "Student")
//         || (isTAData(obj.data)
//             && obj.profile.role === "TA")))
//     );

// }

interface UserProfile_t {
    //* ID by andrewID
    displayName: string;
    photoURL: string;
    username: string;
    role: string;
    id: string; //* Firestore ID that points to private data
}

export type UserProfile = UserProfile_t | null;

export function isUserProfile(obj: any): obj is UserProfile {
    return (
        obj &&
        "displayName" in obj &&
        obj.displayName &&
        "photoURL" in obj &&
        obj.photoURL &&
        "username" in obj &&
        "role" in obj &&
        "id" in obj
    );
}

interface StudentData_t {
    //* ID given by firebase, private
    meetingsAttended: number;
    penalties: number;
    inQueue: boolean;
    inMeeting: boolean;
}

export type StudentData = StudentData_t | null;

export function isStudentData(obj: any): obj is StudentData {
    return (
        obj &&
        "meetingsAttended" in obj &&
        obj.meetingsAttended >= 0 &&
        "penalties" in obj &&
        obj.penalties >= 0 &&
        "inQueue" in obj &&
        "inMeeting" in obj &&
        !(obj.inQueue && obj.inMeeting) //* cannot be both in queue and in meeting
    );
}

interface TAData_t {
    //* ID given by firebase, private
    meetingsHeld: number;
    inOffice: boolean;
    inMeeting: boolean;
}

export type TAData = TAData_t | null;

export function isTAData(obj: any): obj is TAData {
    return (
        obj &&
        "meetingsHeld" in obj &&
        obj.meetingsHeld >= 0 &&
        "inOffice" in obj &&
        "inMeeting" in obj &&
        (obj.inOffice || !obj.inMeeting) //* cannot be in meeting if not in office
    );
}

interface Timestamp {
    seconds: number;
    nanoseconds: number;
}

interface QueueItem_t {
    //* ID by student email
    enqueuedAt: Timestamp | object; //TODO Fix this
    position: number; //* 0th means not in queue, queue is 1-indexed
    location: string;
    questionType: string;
    question: string;
    isFrozen: boolean;
    studentNotes: string;
    TANotes: string;
}

export type QueueItem = QueueItem_t | null;

export function isQueueItem(obj: any): obj is QueueItem {
    return (
        obj &&
        "enqueuedAt" in obj &&
        // obj.enqueuedAt >= 0 && //! Fix this
        "position" in obj &&
        obj.position >= 0 &&
        "location" in obj &&
        obj.location &&
        "questionType" in obj &&
        obj.questionType &&
        "question" in obj &&
        obj.question &&
        "isFrozen" in obj &&
        "studentNotes" in obj &&
        "TANotes" in obj
    );
}

export interface QueueItemData extends QueueItem {
    email: string;
}

export function isQueueItemData(obj: any): obj is QueueItem {
    return (
        obj &&
        "enqueuedAt" in obj &&
        // obj.enqueuedAt >= 0 && //! Fix this
        "position" in obj &&
        obj.position >= 0 &&
        "location" in obj &&
        obj.location &&
        "questionType" in obj &&
        obj.questionType &&
        "question" in obj &&
        obj.question &&
        "isFrozen" in obj &&
        "studentNotes" in obj &&
        "TANotes" in obj &&
        "email" in obj &&
        obj.email
    );
}

interface QueueDetails_t {
    location: string;
    questionType: string;
    question: string;
    studentNotes: string;
}

export type QueueDetails = QueueDetails_t | null;

export interface QueueArgs {
    handleSubmit: (
        location: string,
        questionType: string,
        question: string,
        studentNotes: string
    ) => Promise<void>;
    queueDetails: QueueDetails;
}

export interface QueueSizeDoc {
    size: number;
}

export function isQueueSizeDoc(obj: any): obj is QueueSizeDoc {
    return obj && "size" in obj && obj.size >= 0;
}

export interface ProfileEmail {
    profile: UserProfile;
    email: string;
}
