import React from "react";
import InputQueryForm from "./components/InputFormComponents/InputQueryForm";
import VideoDisplay from "./components/VideoDisplayComponents/VideoDisplay";
import SearchVideoButton from "./components/SearchVideoComponent";
import { useState } from "react";

function App() {
  const [updatedGroupedScenes, setUpdatedGroupedScenes] = useState({
    isQueryAndQnA: false,
    L02_V001: [
      {
        fusedScore: 0.028068137824235385,
        path: "L02_V001/scene/L02_V001_frame_0053_00128640.png",
      },
      {
        fusedScore: 0.02788769549651404,
        path: "L02_V001/scene/L02_V001_frame_0059_00140600.png",
      },
      {
        fusedScore: 0.0266900790166813,
        path: "L02_V001/scene/L02_V001_frame_0266_00923080.png",
      },
      {
        fusedScore: 0.026438310608579978,
        path: "L02_V001/scene/L02_V001_frame_0253_00893960.png",
      },
      {
        fusedScore: 0.025676937441643323,
        path: "L02_V001/scene/L02_V001_frame_0075_00175400.png",
      },
      {
        fusedScore: 0.02480203197370387,
        path: "L02_V001/scene/L02_V001_frame_0292_01015520.png",
      },
      {
        fusedScore: 0.02186379928315412,
        path: "L02_V001/scene/L02_V001_frame_0268_00926360.png",
      },
      {
        fusedScore: 0.019232547387887194,
        path: "L02_V001/scene/L02_V001_frame_0068_00161640.png",
      },
      {
        fusedScore: 0.018978233495232956,
        path: "L02_V001/scene/L02_V001_frame_0252_00891960.png",
      },
      {
        fusedScore: 0.015151515151515152,
        path: "L02_V001/scene/L02_V001_frame_0065_00156160.png",
      },
      {
        fusedScore: 0.014492753623188406,
        path: "L02_V001/scene/L02_V001_frame_0271_00931720.png",
      },
      {
        fusedScore: 0.014084507042253521,
        path: "L02_V001/scene/L02_V001_frame_0061_00147200.png",
      },
      {
        fusedScore: 0.013513513513513514,
        path: "L02_V001/scene/L02_V001_frame_0254_00896200.png",
      },
      {
        fusedScore: 0.013333333333333334,
        path: "L02_V001/scene/L02_V001_frame_0060_00143720.png",
      },
      {
        fusedScore: 0.013157894736842105,
        path: "L02_V001/scene/L02_V001_frame_0069_00163600.png",
      },
      {
        fusedScore: 0.01282051282051282,
        path: "L02_V001/scene/L02_V001_frame_0346_01193800.png",
      },
      {
        fusedScore: 0.01282051282051282,
        path: "L02_V001/scene/L02_V001_frame_0121_00336440.png",
      },
      {
        fusedScore: 0.012658227848101266,
        path: "L02_V001/scene/L02_V001_frame_0093_00246240.png",
      },
      {
        fusedScore: 0.0125,
        path: "L02_V001/scene/L02_V001_frame_0066_00158440.png",
      },
      {
        fusedScore: 0.012048192771084338,
        path: "L02_V001/scene/L02_V001_frame_0327_01118960.png",
      },
      {
        fusedScore: 0.011904761904761904,
        path: "L02_V001/scene/L02_V001_frame_0263_00918200.png",
      },
      {
        fusedScore: 0.011627906976744186,
        path: "L02_V001/scene/L02_V001_frame_0299_01034920.png",
      },
    ],
    L02_V002: [
      {
        fusedScore: 0.03333333333333333,
        path: "L02_V002/scene/L02_V002_frame_0300_01113920.png",
      },
      {
        fusedScore: 0.030330882352941176,
        path: "L02_V002/scene/L02_V002_frame_0249_00878600.png",
      },
      {
        fusedScore: 0.026631393298059962,
        path: "L02_V002/scene/L02_V002_frame_0297_01099600.png",
      },
      {
        fusedScore: 0.02548562548562549,
        path: "L02_V002/scene/L02_V002_frame_0247_00873960.png",
      },
      {
        fusedScore: 0.01639344262295082,
        path: "L02_V002/scene/L02_V002_frame_0195_00698600.png",
      },
      {
        fusedScore: 0.015151515151515152,
        path: "L02_V002/scene/L02_V002_frame_0177_00636360.png",
      },
      {
        fusedScore: 0.014925373134328358,
        path: "L02_V002/scene/L02_V002_frame_0275_00984840.png",
      },
      {
        fusedScore: 0.014705882352941176,
        path: "L02_V002/scene/L02_V002_frame_0109_00403200.png",
      },
      {
        fusedScore: 0.013888888888888888,
        path: "L02_V002/scene/L02_V002_frame_0298_01102680.png",
      },
      {
        fusedScore: 0.013333333333333334,
        path: "L02_V002/scene/L02_V002_frame_0197_00703680.png",
      },
      {
        fusedScore: 0.012195121951219513,
        path: "L02_V002/scene/L02_V002_frame_0256_00906040.png",
      },
      {
        fusedScore: 0.012048192771084338,
        path: "L02_V002/scene/L02_V002_frame_0238_00846720.png",
      },
      {
        fusedScore: 0.011904761904761904,
        path: "L02_V002/scene/L02_V002_frame_0332_01222000.png",
      },
      {
        fusedScore: 0.011764705882352941,
        path: "L02_V002/scene/L02_V002_frame_0269_00954160.png",
      },
    ],
    L02_V003: [
      {
        fusedScore: 0.031754032258064516,
        path: "L02_V003/scene/L02_V003_frame_0238_00878840.png",
      },
      {
        fusedScore: 0.024451318309029312,
        path: "L02_V003/scene/L02_V003_frame_0292_01075880.png",
      },
      {
        fusedScore: 0.023856578204404292,
        path: "L02_V003/scene/L02_V003_frame_0337_01315040.png",
      },
      {
        fusedScore: 0.015384615384615385,
        path: "L02_V003/scene/L02_V003_frame_0255_00940520.png",
      },
      {
        fusedScore: 0.014285714285714285,
        path: "L02_V003/scene/L02_V003_frame_0221_00796000.png",
      },
      {
        fusedScore: 0.014084507042253521,
        path: "L02_V003/scene/L02_V003_frame_0336_01306960.png",
      },
      {
        fusedScore: 0.013888888888888888,
        path: "L02_V003/scene/L02_V003_frame_0033_00090960.png",
      },
      {
        fusedScore: 0.0136986301369863,
        path: "L02_V003/scene/L02_V003_frame_0247_00913960.png",
      },
      {
        fusedScore: 0.013513513513513514,
        path: "L02_V003/scene/L02_V003_frame_0281_01031320.png",
      },
      {
        fusedScore: 0.013157894736842105,
        path: "L02_V003/scene/L02_V003_frame_0283_01039400.png",
      },
      {
        fusedScore: 0.012987012987012988,
        path: "L02_V003/scene/L02_V003_frame_0245_00909440.png",
      },
      {
        fusedScore: 0.012658227848101266,
        path: "L02_V003/scene/L02_V003_frame_0227_00810680.png",
      },
      {
        fusedScore: 0.0125,
        path: "L02_V003/scene/L02_V003_frame_0261_00962760.png",
      },
      {
        fusedScore: 0.012345679012345678,
        path: "L02_V003/scene/L02_V003_frame_0231_00819040.png",
      },
    ],
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
