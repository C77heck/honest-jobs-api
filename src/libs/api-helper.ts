import axios from 'axios';

export const fetch = async () => {
    return await new Promise((resolve, reject) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            const response = (axios as any).get(`${process.env?.API_ENDPOINT_LISTINGS || ''}latest`, {
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'deflate, gzip',
                },
                params: {
                    limit: 5000,
                }
            });
            resolve(response?.data);
        } catch (err) {
            reject(err);
        }
    });
};
