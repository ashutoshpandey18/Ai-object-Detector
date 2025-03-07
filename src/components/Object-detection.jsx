// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import Webcam from "react-webcam";
// import { load as cocossdload } from "@tensorflow-models/coco-ssd";
// import * as tf from "@tensorflow/tfjs"

// const ObjectDetection = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const webcamRef = useRef(null);
//   let detectInterval;

//   const runCoco = async () => {
//     setIsLoading(true);
//     const net = await cocossdload();
//     setIsLoading(false);

//     detectInterval = setInterval(() => {
//       runObjectDetection(net);
//     }, 10);
//   }

// async function runObjectDetection(net){
//     if(
//         canvasRef.current &&
//         webcamRef.current !== null &&
//         webcamRef.current.video?.readyState === 4
//     ) {
//         canvasRef.current.width = webcamRef.current.videoWidth;
//        canvasRef.current.height = webcamRef.current.videoheight

//     //    find detected objects
//     const detectedObjects  = await net.detect(webcamRef.current.video,undefined,0.6)
//     };

//     console.log(detectedObjects)
// }
//   const runObjectDetection = (net) => {
//     if (
//       webcamRef.current &&
//       webcamRef.current.video?.readyState === 4
//     ) {
//       const video = webcamRef.current.video;
//       const myVideoWidth = video.videoWidth;
//       const myVideoHeight = video.videoHeight;

//       video.width = myVideoWidth;
//       video.height = myVideoHeight;

//       // Run object detection
//       net.detect(video).then((predictions) => {
//         console.log(predictions);
//       });
//     }
//   };

//   useEffect(() => {
//     runCoco();
//     return () => clearInterval(detectInterval); // Cleanup interval on unmount
//   }, []);

//   return (
//     <div className="mt-8">
//       {isLoading ? (
//         <div className="gradient-text text-center">Loading AI Model...</div>
//       ) : (
//         <div className="relative flex justify-center items-center bg-gradient-to-b from-white via-green-300 to-gray-600 p-1.5 rounded-md text-black font-semibold">
//           <Webcam ref={webcamRef} className="rounded-md lg:h-auto" />

//           {/* canvas */}
//           <canvas ref={canvasRef} className="absolute top-0 left-0 z-99999 w-full lg:h-[720px]"></canvas>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ObjectDetection;


"use client";

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load as loadModel } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";

const ObjectDetection = () => {
  const [isLoading, setIsLoading] = useState(true); // Show loading message until model loads
  const webcamRef = useRef(null); // Reference for the webcam
  const canvasRef = useRef(null); // Reference for the canvas (to draw results)

  // Load the AI model when the component mounts
  useEffect(() => {
    const loadAIModel = async () => {
      setIsLoading(true);
      const model = await loadModel(); // Load object detection model
      setIsLoading(false);
      startDetection(model); // Start detecting objects
    };

    loadAIModel();
  }, []);

  // Function to detect objects continuously
  const startDetection = (model) => {
    setInterval(() => {
      detectObjects(model);
    }, 500); // Runs every 500ms
  };

  // Function to detect objects in the webcam feed
  const detectObjects = async (model) => {
    if (
      webcamRef.current &&
      webcamRef.current.video?.readyState === 4 && // Check if video is ready
      canvasRef.current
    ) {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Set canvas size same as video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Detect objects
      const objects = await model.detect(video);
      console.log(objects); // Log detected objects

      drawObjects(objects, ctx);
    }
  };

  // Function to draw boxes around detected objects
  const drawObjects = (objects, ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear previous drawings

    objects.forEach((obj) => {
      const [x, y, width, height] = obj.bbox;

      ctx.strokeStyle = "red"; // Red border for objects
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height); // Draw box

      ctx.fillStyle = "red"; // Text color
      ctx.font = "16px Arial";
      ctx.fillText(obj.class, x, y > 10 ? y - 5 : y + 15); // Draw label
    });
  };

  return (
    <div className="mt-8">
      {isLoading ? (
        <div className="text-center">Loading AI Model...</div>
      ) : (
        <div className="relative flex justify-center items-center">
          <Webcam ref={webcamRef} className="rounded-md" />
          <canvas ref={canvasRef} className="absolute top-0 left-0"></canvas>
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;
