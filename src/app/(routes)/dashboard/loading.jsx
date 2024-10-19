'use client'
import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

const Loading = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="mb-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
      <div className="w-64 mb-4">
        <Progress value={progress} className="h-2" />
      </div>
      <p className="text-gray-600 font-medium">Loading... {progress}%</p>
    </div>
  );
};

export default Loading;