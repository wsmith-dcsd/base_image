/**
 * Internal Helper: Pad numbers with leading zeros (e.g., 9 -> 09)
 */
const pad = (num) => num.toString().padStart(2, "0");

/**
 * Internal Helper: Safe Date Parsing
 * Handles standardizing string formats (fixing the hyphen issue for older browsers/SQL strings)
 */
const safeParse = (dateString) => {
    if (!dateString) return null;
    // Replaces SQL-style dashes with slashes and ensures T is a space for cross-browser safety
    return new Date(dateString.replace(/-/g, "/").replace("T", " "));
};

/**
 * Validates if a string is strictly "YYYY-MM-DD" and represents a real date.
 * Example: isValidDate("2023-02-30") returns false.
 * @param {string} dateString
 * @returns {boolean}
 */
export const isValidDate = (dateString) => {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) return false; // Invalid format

    const d = new Date(dateString);
    const dNum = d.getTime();

    // Check for NaN and ensure the date didn't shift (e.g., Feb 31 -> Mar 3)
    if (!dNum && dNum !== 0) return false;
    return d.toISOString().slice(0, 10) === dateString;
};

/**
 * Formats date to "Month DD, YYYY" or "Month DD, YYYY at HH:MMam"
 * @param {string} dateString
 * @param {boolean} abbr - Short month name (Jan vs January)
 * @param {boolean} includeTime - Include HH:MM am/pm
 * @returns {string|null}
 */
export const formatDate = (dateString = null, abbr = false, includeTime = false) => {
    const myDate = safeParse(dateString);
    if (!myDate) return dateString;

    const Y = myDate.getFullYear();
    const month = myDate.toLocaleString("default", { month: abbr ? "short" : "long" });
    const dd = myDate.getDate();

    if (includeTime) {
        let hh = myDate.getHours();
        const ii = pad(myDate.getMinutes());
        const meridian = hh >= 12 ? "pm" : "am";

        // Convert 24h to 12h format
        hh = hh % 12;
        hh = hh === 0 ? 12 : hh; // Handle midnight/noon

        return `${month} ${dd}, ${Y} at ${hh}:${ii}${meridian}`;
    }

    return `${month} ${dd}, ${Y}`;
};

/**
 * Returns a SQL-ish format: YYYY-MM-DD 00:00:00
 * @param {string} dateString
 * @returns {string|null}
 */
export const formatIsoDate = (dateString = null) => {
    const myDate = safeParse(dateString);
    if (!myDate) return dateString;

    const Y = myDate.getFullYear();
    const m = pad(myDate.getMonth() + 1);
    const d = pad(myDate.getDate());

    return `${Y}-${m}-${d} 00:00:00`;
};

export const formatDateAndTime = (dateString = null) => {
    const myDate = safeParse(dateString);
    if (!myDate) return dateString; // Return original if parse fails

    const Y = myDate.getFullYear();
    const month = myDate.toLocaleString("default", { month: "long" });
    const dd = myDate.getDate();

    let hh = myDate.getHours();
    const meridian = hh >= 12 ? "pm" : "am";

    hh = hh % 12;
    hh = hh === 0 ? 12 : hh;

    return `${month} ${dd}, ${Y} at ${hh}${meridian}`;
};

// --- "Get Current Time" Helpers ---

export const getToday = () => {
    const myDate = new Date();
    return `${pad(myDate.getMonth() + 1)}-${pad(myDate.getDate())}`;
};

export const getSingleYear = () => {
    return new Date().getFullYear().toString();
};

export const getTodayWithYear = () => {
    const myDate = new Date();
    return `${myDate.getFullYear()}-${pad(myDate.getMonth() + 1)}-${pad(myDate.getDate())}`;
};

export const getTodayWithTime = () => {
    const myDate = new Date();
    const Y = myDate.getFullYear();
    const m = pad(myDate.getMonth() + 1);
    const d = pad(myDate.getDate());
    const h = pad(myDate.getHours());
    const i = pad(myDate.getMinutes());
    const s = pad(myDate.getSeconds());

    return `${Y}-${m}-${d} ${h}:${i}:${s}`;
};

// --- Epoch Helpers ---

/**
 * Converts a Date string to an Epoch timestamp (milliseconds)
 */
export const getEpoch = (dateString) => {
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
 * * @param {number|string} epoch - The timestamp
 * @returns {string} Formatted date string (YYYY-MM-DD@HH:MM:SS)
 */
export const getDateFromEpoch = (epoch) => {
    if (!epoch) return "";

    let numericEpoch = Number(epoch);

    // Smart Detection:
    // 1 Trillion (1,000,000,000,000) corresponds to the year 33,658 AD in seconds.
    // If the number is smaller than this, it is definitely Seconds.
    // If larger, it is Milliseconds.
    if (numericEpoch < 1000000000000) {
        numericEpoch *= 1000;
    }

    const myDate = new Date(numericEpoch);

    const Y = myDate.getFullYear();
    const m = pad(myDate.getMonth() + 1);
    const d = pad(myDate.getDate());
    const h = pad(myDate.getHours());
    const i = pad(myDate.getMinutes());
    const s = pad(myDate.getSeconds());

    return `${Y}-${m}-${d}@${h}:${i}:${s}`;
};
