import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001/v1/api";

interface Quote {
    id: number;
    author: string;
    content: string;
}

export function useQuotes() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [count, setCount] = useState<number>(50);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios
            .get(`${API_BASE_URL}/tags`)
            .then((response) => setTags(["All", ...response.data.tags]))
            .catch((err) => {
                console.error("Error fetching tags:", err)
                setError(err.message);
            });
    }, []);

    const fetchQuotes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/quotes`, {
                params: { count, tag: selectedTag !== "All" ? selectedTag : undefined },
            });

            setQuotes(response.data.quotes);
        } catch (err: any) {
            console.error("Error fetching quotes:", err)
            setError(err.message);
        }
        setLoading(false);
    };

    return {
        quotes,
        tags,
        selectedTag,
        setSelectedTag,
        count,
        setCount,
        loading,
        error,
        fetchQuotes,
    };
}
