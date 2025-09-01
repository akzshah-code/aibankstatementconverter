
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

    if (!response.ok) {
        let errorText = `Request failed with status ${response.status}`;
        const responseBody = await response.text();
        try {
            const errorData = JSON.parse(responseBody);
            errorText = errorData.error || errorText;
        } catch {
            errorText = responseBody || errorText;
        }
        throw new Error(errorText);
    }

    const responseData = await response.json();
    return responseData as ExtractedTransaction[];
};
