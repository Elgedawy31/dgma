import { useCallback, useMemo } from "react"

export default function useDate() {
    const shortDate = useCallback((date: string) => {
        const dateObj = new Date(date);
        const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(dateObj);
        const day = dateObj.getDate();
        return `${month}${day}`;
    }, [])
    const dateFormatter = useCallback((date: string) => {
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString('en-US', { year: "numeric", month: "long", day: "numeric", });
    }, [])

    const dateEncoder = useCallback((date: string) => {
        const dateObj = new Date(date);
        return dateObj.toISOString().split("T")[0];
    }, [])

    const calcDeadline = useCallback((date: string) => {
        const dateObj = new Date(date);
        const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(dateObj);
        const day = dateObj.getDate() + 1;
        return `${month}${day}`;
    }, [])

    const nextMonth = useCallback((today: Date) => {
        const nextMonth = new Date(today);

        nextMonth.setMonth(today.getMonth() + 1);

        return nextMonth.toISOString().split("T")[0];

    }, [])
    const obj = useMemo(() => ({
        shortDate, nextMonth, dateFormatter
    }), [shortDate, nextMonth, dateFormatter])

    return obj;
}