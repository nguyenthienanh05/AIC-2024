const fileContent = `
Node ID: node_241, Source: /kaggle/input/aic-dataset/AIC_Dataset/AIC_Dataset_V001_V002/L01_V001_description_full/response_L01_V001_scene_0229_00934240_00937480.txt, Fused Score: 0.031754032258064516
Node ID: node_26, Source: /kaggle/input/aic-dataset/AIC_Dataset/AIC_Dataset_V001_V002/L01_V001_description_full/response_L01_V001_scene_0136_00499560_00505440.txt, Fused Score: 0.02803921568627451
Node ID: node_551, Source: /kaggle/input/aic-dataset/AIC_Dataset/AIC_Dataset_V001_V002/L01_V002_desciption_full/response_L01_V002_scene_0279_00955640_00958680.txt, Fused Score: 0.027972027972027972
Node ID: node_214, Source: /kaggle/input/aic-dataset/AIC_Dataset/AIC_Dataset_V001_V002/L01_V001_description_full/response_L01_V001_scene_0142_00538720_00542400.txt, Fused Score: 0.016666666666666666
Node ID: node_127, Source: /kaggle/input/aic-dataset/AIC_Dataset/AIC_Dataset_V001_V002/L01_V001_description_full/response_L01_V001_scene_0242_00993880_00996000.txt, Fused Score: 0.016666666666666666
Node ID: node_356, Source: /kaggle/input/aic-dataset/AIC_Dataset/AIC_Dataset_V001_V002/L01_V002_desciption_full/response_L01_V002_scene_0066_00203520_00204760.txt, Fused Score: 0.01639344262295082
Node ID: node_358, Source: /kaggle/input/aic-dataset/AIC_Dataset/AIC_Dataset_V001_V002/L01_V002_desciption_full/response_L01_V002_scene_0251_00839360_00841280.txt, Fused Score: 0.01639344262295082
Node ID: node_176, Source: /kaggle/input/aic-dataset/AIC_Dataset/AIC_Dataset_V001_V002/L01_V001_description_full/response_L01_V001_scene_0139_00527960_00531880.txt, Fused Score: 0.016129032258064516
Node ID: node_488, Source: /kaggle/input/aic-dataset/AIC_Dataset/AIC_Dataset_V001_V002/L01_V002_desciption_full/response_L01_V002_scene_0238_00773960_00776840.txt, Fused Score: 0.015873015873015872
Node ID: node_383, Source: /kaggle/input/aic-dataset/AIC_Dataset/AIC_Dataset_V001_V002/L01_V002_desciption_full/response_L01_V002_scene_0270_00926240_00929600.txt, Fused Score: 0.015873015873015872
Node ID: node_489, Source: /kaggle/input/aic-dataset/AIC_Dataset/AIC_Dataset_V001_V002/L01_V002_desciption_full/response_L01_V002_scene_0202_00622080_00624800.txt, Fused Score: 0.015625
Node ID: node_79, Source: /kaggle/input/aic-dataset/AIC_Dataset/AIC_Dataset_V001_V002/L01_V001_description_full/response_L01_V001_scene_0143_00542440_00546720.txt, Fused Score: 0.015384615384615385
Node ID: node_243, Source: /kaggle/input/aic-dataset/AIC_Dataset/AIC_Dataset_V001_V002/L01_V001_description_full/response_L01_V001_scene_0120_00443760_00445960.txt, Fused Score: 0.015384615384615385
Node ID: node_19, Source: /kaggle/input/aic-dataset/AIC_Dataset/AIC_Dataset_V001_V002/L01_V001_description_full/response_L01_V001_scene_0152_00585480_00587680.txt, Fused Score: 0.015151515151515152
Node ID: node_151, Source: /kaggle/input/aic-dataset/AIC_Dataset/AIC_Dataset_V001_V002/L01_V001_description_full/response_L01_V001_scene_0114_00427480_00429920.txt, Fused Score: 0.014925373134328358
Node ID: node_143, Source: /kaggle/input/aic-dataset/AIC_Dataset/AIC_Dataset_V001_V002/L01_V001_description_full/response_L01_V001_scene_0058_00212120_00223800.txt, Fused Score: 0.014925373134328358
Node ID: node_158, Source: /kaggle/input/aic-dataset/AIC_Dataset/AIC_Dataset_V001_V002/L01_V001_description_full/response_L01_V001_scene_0228_00930200_00934200.txt, Fused Score: 0.014705882352941176
Node ID: node_437, Source: /kaggle/input/aic-dataset/AIC_Dataset/AIC_Dataset_V001_V002/L01_V002_desciption_full/response_L01_V002_scene_0036_00098160_00099240.txt, Fused Score: 0.014492753623188406
Node ID: node_220, Source: /kaggle/input/aic-dataset/AIC_Dataset/AIC_Dataset_V001_V002/L01_V001_description_full/response_L01_V001_scene_0262_01064600_01071840.txt, Fused Score: 0.014492753623188406
Node ID: node_144, Source: /kaggle/input/aic-dataset/AIC_Dataset/AIC_Dataset_V001_V002/L01_V001_description_full/response_L01_V001_scene_0232_00944880_00947160.txt, Fused Score: 0.014285714285714285
`;

const extractSceneInfo = (content) => {
  const lines = content.trim().split('\n');
  const sceneInfo = lines.map(line => {
    const match = line.match(/response_(L\d+_V\d+_scene_\d+)_.*Fused Score: ([\d.]+)/);
    return match ? { sceneID: match[1], fusedScore: parseFloat(match[2]) } : null;
  }).filter(info => info !== null);
  return sceneInfo;
};

const convertToFrame = (scene) => {
  const match = scene.match(/(L\d+_V\d+)_scene_(\d+)/);
  return match ? `${match[1]}_frame_${match[2]}` : null;
};

const sceneInfo = extractSceneInfo(fileContent);

const groupByVideoPrefix = (sceneInfo) => {
  return sceneInfo.reduce((acc, { sceneID, fusedScore }) => {
    const frame = convertToFrame(sceneID);
    const videoPrefix = sceneID.match(/(L\d+_V\d+)/)[0];
    if (!acc[videoPrefix]) {
      acc[videoPrefix] = [];
    }
    if (frame) {
      acc[videoPrefix].push({ frame, fusedScore });
    }
    return acc;
  }, {});
};

const groupedScenes = groupByVideoPrefix(sceneInfo);

const updatePathsForVideo = async (videoPrefix, frames) => {
  const { listFiles } = await import('./getVideoPathName.js');
  
  const allPaths = await listFiles(videoPrefix);
  
  const pathMap = allPaths.reduce((acc, path) => {
    const frameId = path.match(/L\d+_V\d+_frame_\d+/)[0];
    acc[frameId] = path;
    return acc;
  }, {});
  
  return frames.map(({ frame, fusedScore }) => ({
    path: pathMap[frame] || frame,
    fusedScore
  }));
};

const updateAllPaths = async (groupedScenes) => {
  const updatedGroupedScenes = {};
  
  for (const [videoPrefix, frames] of Object.entries(groupedScenes)) {
    updatedGroupedScenes[videoPrefix] = await updatePathsForVideo(videoPrefix, frames);
  }
  
  return updatedGroupedScenes;
};

updateAllPaths(groupedScenes)
  .then(updatedGroupedScenes => {
    console.log('Updated Grouped Scenes:', updatedGroupedScenes);
  })
  .catch(error => {
    console.error('Error updating paths:', error);
  });

export { updateAllPaths };