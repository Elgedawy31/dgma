import { useCallback, useMemo } from "react"

export default function useDate() {
    const shortDate = useCallback((date: string) => {
        const dateObj = new Date(date);
        const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(dateObj);
        const day = dateObj.getDate();
        return `${month}${day}`;
    }, [])

    const obj = useMemo(() => ({
        shortDate
    }), [shortDate])

    return obj;
}