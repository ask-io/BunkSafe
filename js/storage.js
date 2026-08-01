/*save and load student data from the browser's localStorage */
const STORAGE_KEY = 'bunksafe_data';
function getData() {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw);
    } catch (error) {
        console.error("Failed to parse saved data:", error);
        return null;
    }
}
function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function clearData() {
  localStorage.removeItem(STORAGE_KEY);
}
/*
 ==========================================
    Expected Data Schema (For Reference)
 ==========================================
 {
   profile: {
     name: "Abhijit",
     department: "CSE",
     semester: "S3",
     targetPercent: 75
   },
   subjects: [
     {
       id: "subj_1",
       name: "Data Structures",
       code: "CST201",
       attended: 18,
       total: 20
     }
   ]
 }
*/
const STORAGE_KEY = "bunksafe_data";

export function loadSubjects() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

export function saveSubjects(subjects) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
}
