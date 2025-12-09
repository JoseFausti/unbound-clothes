import { useState } from "react";

interface UseImageProps {
  maxSizeMB?: number;
  allowedTypes?: string[];
}

const useImage = ({ maxSizeMB = 5, allowedTypes = ['image/jpeg', 'image/png'] }: UseImageProps = {}) => {

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // Validate file type
        if (!allowedTypes.includes(selectedFile.type)) {
            setError(`Only ${allowedTypes.join(', ')} are allowed`);
            return;
        }

        // Validate file size
        if (selectedFile.size > maxSizeMB * 1024 * 1024) {
            setError(`File size exceeds ${maxSizeMB}MB`);
            return;
        }

        setFile(selectedFile);
        setError(null);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        }
        reader.readAsDataURL(selectedFile); // Convert to base64 string for preview
    }

    const reset = () => {
        setFile(null);
        setPreview(null);
        setError(null);
    }

    return {
        file,
        preview,
        error,
        handleImageChange,
        reset
    }
}

export default useImage
