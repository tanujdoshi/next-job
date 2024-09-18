// Custom URL validation function
const isValidURL = (value: string | undefined) => {
    try {
        const url = new URL(value?.startsWith('http') ? value : `http://${value}`);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (error) {
        return false;
    }
}

export { isValidURL }