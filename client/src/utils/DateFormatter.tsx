/**
 * Internal Helper: Pad numbers with leading zeros (e.g., 9 -> 09)
 */
const pad = (num: number): string => num.toString().padStart(2, "0");

/**
 * Internal Helper: Safe Date Parsing
 * Handles standardizing string formats (fixing the hyphen issue for older browsers/SQL strings)
 */
const safeParse = (dateString: string | null): Date | null => {
    if (!dateString || typeof dateString !== "string") return null;
    try {
        // Replaces SQL-style dashes with slashes and ensures T is a space for cross-browser safety
        const normalizedString = dateString.replace(/-/g, "/").replace("T", " ");
        const parsedDate = new Date(normalizedString);
        // Check if the date is valid
        if (isNaN(parsedDate.getTime())) {
            return null;
        }
        return parsedDate;
    } catch {
        console.error("Invalid date string provided to safeParse");
        return null;
    }
};

/**
 * Validates if a string is strictly "YYYY-MM-DD" and represents a real date.
 * Example: isValidDate("2023-02-30") returns false.
 * @param {string} dateString
 * @returns {boolean}
 */
export const isValidDate = (dateString: string): boolean => {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) return false;

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return false;
    return date.toISOString().slice(0, 10) === dateString;
};

const MONTH_NAMES_FULL = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
const MONTH_NAMES_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Formats date to "Month DD, YYYY" or "Month DD, YYYY at HH:MMam"
 */
export const formatDate = (dateString: string | null = null, abbr = false, includeTime = false): string | null => {
    const myDate = safeParse(dateString);
    if (!myDate) return null;

    const year = myDate.getFullYear();
    const month = (abbr ? MONTH_NAMES_SHORT : MONTH_NAMES_FULL)[myDate.getMonth()];
    const day = myDate.getDate();

    if (includeTime) {
        let hour = myDate.getHours();
        const minute = pad(myDate.getMinutes());
        const meridian = hour >= 12 ? "pm" : "am";

        hour = hour % 12;
        hour = hour === 0 ? 12 : hour;

        return `${month} ${day}, ${year} at ${hour}:${minute}${meridian}`;
    }

    return `${month} ${day}, ${year}`;
};

/**
 * Returns a SQL-ish format: YYYY-MM-DD 00:00:00
 * @param {string} dateString
 * @returns {string|null}
 */
export const formatIsoDate = (dateString: string | null = null): string | null => {
    const myDate = safeParse(dateString);
    if (!myDate) return null;

    const year = myDate.getFullYear();
    const month = pad(myDate.getMonth() + 1);
    const day = pad(myDate.getDate());

    return `${year}-${month}-${day} 00:00:00`;
};

export const formatDateAndTime = (dateString: string | null = null): string | null => {
    const myDate = safeParse(dateString);
    if (!myDate) return null;

    const year = myDate.getFullYear();
    const month = myDate.toLocaleString("default", { month: "long" });
    const day = myDate.getDate();

    let hour = myDate.getHours();
    const minute = pad(myDate.getMinutes());
    const meridian = hour >= 12 ? "pm" : "am";

    hour = hour % 12;
    hour = hour === 0 ? 12 : hour;

    return `${month} ${day}, ${year} at ${hour}:${minute}${meridian}`;
};

// --- "Get Current Time" Helpers ---

export const getToday = (): string => {
    const myDate = new Date();
    return `${pad(myDate.getMonth() + 1)}-${pad(myDate.getDate())}`;
};

export const getSingleYear = (): string => {
    return new Date().getFullYear().toString();
};

export const getTodayWithYear = (): string => {
    const myDate = new Date();
    return `${myDate.getFullYear()}-${pad(myDate.getMonth() + 1)}-${pad(myDate.getDate())}`;
};

export const getTodayWithTime = (): string => {
    const myDate = new Date();
    const year = myDate.getFullYear();
    const month = pad(myDate.getMonth() + 1);
    const day = pad(myDate.getDate());
    const hour = pad(myDate.getHours());
    const minute = pad(myDate.getMinutes());
    const second = pad(myDate.getSeconds());

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

// --- Epoch Helpers ---

/**
 * Converts a Date string to an Epoch timestamp (milliseconds)
 */
export const getEpoch = (dateString: string): number | string => {
    if (dateString) {
        // safeParse returns a Date object, .getTime() gives ms
        const date = safeParse(dateString);
        return date ? date.getTime() : dateString;
    }
    return dateString;
};

/**
 * Converts an Epoch (Seconds or Milliseconds) to a formatted string.
 * Automatically detects if the input is in seconds or milliseconds.
 * @param {number|string} epoch - The timestamp
 * @returns {string} Formatted date string (YYYY-MM-DD@HH:MM:SS)
 */
export const getDateFromEpoch = (epoch: number | string): string => {
    if (!epoch) return "";

    let numericEpoch = Number(epoch);
    if (isNaN(numericEpoch)) return "";

    // Convert seconds to milliseconds if needed (threshold: 1 trillion)
    if (numericEpoch < 1000000000000) {
        numericEpoch *= 1000;
    }

    const myDate = new Date(numericEpoch);
    if (isNaN(myDate.getTime())) return "";

    const year = myDate.getFullYear();
    const month = pad(myDate.getMonth() + 1);
    const day = pad(myDate.getDate());
    const hour = pad(myDate.getHours());
    const minute = pad(myDate.getMinutes());
    const second = pad(myDate.getSeconds());

    return `${year}-${month}-${day}@${hour}:${minute}:${second}`;
};
