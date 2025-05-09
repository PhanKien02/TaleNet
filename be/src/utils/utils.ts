/**
 * Normalize text
 * @param {*} text
 * @returns
 */
export const normalize = (str) => {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
};