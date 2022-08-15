export default function extractAndrewID(email: string): string {
    if (email.includes("@andrew.cmu.edu")) {
        return email.slice(0, email.length - 15);
    } else if (email.includes("@gmail.com")) {
        return email.slice(0, email.length - 10);
    }
}
