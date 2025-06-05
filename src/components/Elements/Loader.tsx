import { useProgress } from "@react-three/drei";
import React, { useState, useEffect } from "react";

export function Loader({ onContinue }: { onContinue: () => void }) {
    const [progress, setProgress] = useState(0);
    const [show, setShow] = useState(true);

    useEffect(() => {
        document.body.classList.add("overflow-hidden");
        if (progress < 100) {
            const interval = setInterval(() => {
                setProgress((prev) => Math.min(prev + 5, 100));
            }, 100); // Adjust speed as needed
            return () => clearInterval(interval);
        }

    }, [progress]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-3xl">
            {/* Centered Enter button */}
            <div className="absolute inset-0 flex items-center justify-center">
                {progress === 100 && (

                    <button className="border-2 border-white p-1 opacity-50" onClick={() => {
                        onContinue();
                    }}>
                        <div

                            className="w-44 h-10 bg-white text-black shadow-lg hover:shadow-xl transition-shadow duration-200 flex items-center justify-center">
                            <span className="flex items-baseline space-x-1 leading-none">
                                <span className="font-inter text-base font-normal leading-none">
                                    Enter the
                                </span>
                                <span className="font-playfair text-base font-normal italic leading-none">
                                    Experience
                                </span>
                            </span>
                        </div>
                    </button>
                )}
            </div>
            {/* Bottom-right loading bar */}
            <div className="absolute bottom-8 right-8 flex flex-col items-end space-y-2">
                <div className="text-xs text-white">{Math.floor(progress)}%</div>
                <div className="w-70 h-2 bg-black/50 overflow-hidden mb-1">
                    <div
                        className="bg-white h-full transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
}