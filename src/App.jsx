import React from "react";
import InputQueryForm from "./components/InputFormComponents/InputQueryForm";
import VideoDisplay from "./components/VideoDisplayComponents/VideoDisplay";

function App() {
  const updatedGroupedScenes = {
    L01_V001: [
      {
        path: "L01_V001/scenes/L01_V001_frame_0229_00935840.png",
        fusedScore: 0.031754032258064516,
      },
      {
        path: "L01_V001/scenes/L01_V001_frame_0136_00502480.png",
        fusedScore: 0.02803921568627451,
      },
      {
        path: "L01_V001/scenes/L01_V001_frame_0142_00540560.png",
        fusedScore: 0.016666666666666666,
      },
      {
        path: "L01_V001/scenes/L01_V001_frame_0242_00994920.png",
        fusedScore: 0.016666666666666666,
      },
      {
        path: "L01_V001/scenes/L01_V001_frame_0139_00529920.png",
        fusedScore: 0.016129032258064516,
      },
      {
        path: "L01_V001/scenes/L01_V001_frame_0143_00544560.png",
        fusedScore: 0.015384615384615385,
      },
      {
        path: "L01_V001/scenes/L01_V001_frame_0120_00444840.png",
        fusedScore: 0.015384615384615385,
      },
      {
        path: "L01_V001/scenes/L01_V001_frame_0152_00586560.png",
        fusedScore: 0.015151515151515152,
      },
      {
        path: "L01_V001/scenes/L01_V001_frame_0114_00428680.png",
        fusedScore: 0.014925373134328358,
      },
      {
        path: "L01_V001/scenes/L01_V001_frame_0058_00217960.png",
        fusedScore: 0.014925373134328358,
      },
      {
        path: "L01_V001/scenes/L01_V001_frame_0228_00932200.png",
        fusedScore: 0.014705882352941176,
      },
      {
        path: "L01_V001/scenes/L01_V001_frame_0262_01068200.png",
        fusedScore: 0.014492753623188406,
      },
      {
        path: "L01_V001/scenes/L01_V001_frame_0232_00946000.png",
        fusedScore: 0.014285714285714285,
      },
    ],
    L01_V002: [
      {
        path: "L01_V002/scenes/L01_V002_frame_0279_00957160.png",
        fusedScore: 0.027972027972027972,
      },
      {
        path: "L01_V002/scenes/L01_V002_frame_0066_00204120.png",
        fusedScore: 0.01639344262295082,
      },
      {
        path: "L01_V002/scenes/L01_V002_frame_0251_00840320.png",
        fusedScore: 0.01639344262295082,
      },
      {
        path: "L01_V002/scenes/L01_V002_frame_0238_00775400.png",
        fusedScore: 0.015873015873015872,
      },
      {
        path: "L01_V002/scenes/L01_V002_frame_0270_00927920.png",
        fusedScore: 0.015873015873015872,
      },
      {
        path: "L01_V002/scenes/L01_V002_frame_0202_00623440.png",
        fusedScore: 0.015625,
      },
      {
        path: "L01_V002/scenes/L01_V002_frame_0036_00098680.png",
        fusedScore: 0.014492753623188406,
      },
    ],
  };

  const colorWheel = [
    "bg-[#FFEBEB]", // Light Pink
    "bg-[#EBFFEB]", // Light Green
    "bg-[#EBEFFF]", // Light Blue
    "bg-[#FFF3EB]", // Light Orange
    "bg-[#F1EBFF]", // Light Purple
    "bg-[#EBFFF9]", // Light Teal
  ];

  return (
    <div className="mx-auto p-4">
      <InputQueryForm />
      {Object.entries(updatedGroupedScenes).map(
        ([videoName, frames], index) => (
          <VideoDisplay
            key={videoName}
            videoName={videoName}
            frames={frames}
            bgColor={colorWheel[index % colorWheel.length]}
          />
        )
      )}
    </div>
  );
}

export default App;