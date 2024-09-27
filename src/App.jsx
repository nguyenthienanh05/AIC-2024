import React from "react";
import InputQueryForm from "./components/InputFormComponents/InputQueryForm";
import VideoDisplay from "./components/VideoDisplayComponents/VideoDisplay";
import SearchVideoButton from "./components/SearchVideoComponent/SearchVideoComponent";
import SearchVideoFrame from "./components/SearchVideoComponent/SearchVideoFrame";
import { useState } from "react";

function App() {
  const [updatedGroupedScenes, setUpdatedGroupedScenes] = useState({
    isQueryAndQnA: false,
    L02_V001: [
      {
        fusedScore: 0.028068137824235385,
        path: "L02_V029/scene/L02_V029_frame_0038_00121000_3025_2500.png",
      },
      {
        fusedScore: 0.02788769549651404,
        path: "L02_V029/scene/L02_V029_frame_0038_00121000_3025_2500.png",
      },
      {
        fusedScore: 0.0266900790166813,
        path: "L02_V029/scene/L02_V029_frame_0038_00121000_3025_2500.png",
      },
    ]
  });
  const [isLoading, setIsLoading] = useState(false);

  const colorWheel = [
    "bg-[#FFEBEB]", // Light Pink
    "bg-[#EBFFEB]", // Light Green
    "bg-[#EBEFFF]", // Light Blue
    "bg-[#FFF3EB]", // Light Orange
    "bg-[#F1EBFF]", // Light Purple
    "bg-[#EBFFF9]", // Light Teal
  ];

  const handleQueryResponse = (data) => {
    setUpdatedGroupedScenes(data);
    setIsLoading(false);
  };

  return (
    <div className="mx-auto p-4">
      <InputQueryForm
        onQueryResponse={handleQueryResponse}
        setIsLoading={setIsLoading}
      />
      <SearchVideoButton />
      <SearchVideoFrame />
      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <p className="mt-4 text-lg font-semibold text-gray-700">Loading...</p>
        </div>
      ) : (
        Object.entries(updatedGroupedScenes).map(([videoName, data], index) => {
          if (videoName !== "isQueryAndQnA") {
            return (
              <VideoDisplay
                key={videoName}
                videoName={videoName}
                frames={data}
                bgColor={colorWheel[index % colorWheel.length]}
                isQueryAndQnA={updatedGroupedScenes.isQueryAndQnA}
              />
            );
          }
          return null;
        })
      )}
    </div>
  );
}

export default App;
