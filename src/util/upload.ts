import axios from 'axios';
const MEDIA_API_URL = process.env.REACT_APP_MEDIA_API_URL;
const MEDIA_API_TOKEN = process.env.REACT_APP_MEDIA_API_TOKEN;

const axiosInstance = axios.create({
    baseURL: MEDIA_API_URL,
    headers: { 
        Authorization: `Bearer ${MEDIA_API_TOKEN}`,
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
});

/**
 * 
 * @param file file(s) to upload
 * @param module directory identifier where to upload
 * @param type specifies what media type to upload
 * @returns Object that contains file or array of files in object storage form
 */
export const uploadMedia = async (file: File | Array<File>, module: string, type?: string): Promise<Array<object>> => {
    const media = new FormData();
    if (Array.isArray(file)) {
        for (const f of file) media.append('media', f);
    }
    else media.append('media', file);

    const mediaUploadRes = await axiosInstance.post(`upload/repnotes/${module}${type ? `?type=${type}` : '?type=json'}`, media);
    return mediaUploadRes.data.media;
}