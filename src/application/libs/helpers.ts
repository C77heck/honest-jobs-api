export const toLowerCase = (str: string): string => {
    const firstChar = str[0].toLowerCase();

    return `${firstChar}${str.slice(1)}`;
};
