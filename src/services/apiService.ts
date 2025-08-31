
import { ExtractedTransaction } from "../lib/types";

export const extractTransactionsFromApi = async (file: File, password: string | null): Promise<ExtractedTransaction[]> => {
    const formData = new FormData();
    formData.append('file', file);
    if (password) {
        formData.append('password', password);
    }

    const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.error || `Request failed with status ${response.status}`);
    }

    return responseData as ExtractedTransaction[];
};
