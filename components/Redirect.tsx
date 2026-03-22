'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Redirect() {
    const router = useRouter();
    const [seconds, setSeconds] = useState<number>(5);

    useEffect(() => {
        if (seconds === 0) {
            router.push("/");
            return;
        }

        const intervalId = setInterval(() => {
            setSeconds(prev => prev -= 1)
        }, 1000)

        return () => clearInterval(intervalId);

    }, [seconds, router])  

    return (
        <div className="text-emerald-600 font-bold text-[0.95rem] py-4">
            Redirecting to shops in {seconds}s...
        </div>
    );
}