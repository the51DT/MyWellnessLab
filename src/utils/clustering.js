export const clustering = (cluster_array, max_distance) => {

  let changeCount = -1;

  //클러스터 저장용
  let current_cluster = [];

  //클러스터 초기화
  for (let i = 0; i < cluster_array.length; i++) {
    const cluster = [];
    cluster.push(cluster_array[i]);
    current_cluster.push(cluster);
  }

  //클러스터 가까운것끼리 묶으면서 묶을거 없을때까지 진행 changeCount값으로 체크
  while (changeCount !== 0) {
    const new_cluster = [];
    const includedIndex = [];
    changeCount = 0;

    //루프 돌면서 가까운것끼리 묶음
    for (let i = 0; i < current_cluster.length; i++) {
      let minDistance = max_distance;
      let minIndex = -1;

      const current = current_cluster[i];

      let exist = false;
      for (let k = 0; k < includedIndex.length; k++) {
        if (includedIndex[k] === i) {
          exist = true;
          break;
        }
      }
      if (exist) continue;
      if (i < current_cluster.length - 1) {
        for (let j = i + 1; j < current_cluster.length; j++) {
          for (let k = 0; k < includedIndex.length; k++) {
            if (includedIndex[k] === j) {
              exist = true;
              break;
            }
          }
          if (exist) continue;

          const next = current_cluster[j];

          const distance = calcDistance(
            getCentroid(current),
            getCentroid(next)
          );
          if (minDistance > distance) {
            minIndex = j;
            minDistance = distance;
          }
        }
      }

      //인접 클러스터 있을때
      if (minIndex !== -1) {
        const cluster = [];
        includedIndex.push(i);
        includedIndex.push(minIndex);

        cluster.push(...current);
        cluster.push(...current_cluster[minIndex]);

        new_cluster.push(cluster);
        changeCount++;
      }
      //인접 클러스터 없을때
      else {
        const cluster = [];
        includedIndex.push(i);

        cluster.push(...current);

        new_cluster.push(cluster);
      }
    }

    current_cluster = new_cluster;
  }

  return current_cluster;
};

const calcDistance = (a, b) => {
  //   const x = b[0] - a[0];
  const y = b[1] - a[1];
  const d = Math.sqrt(y * y); //Math.sqrt(x * x + y * y);
  return d;
};

const getCentroid = (points) => {
  let centroid = [0, 0];

  for (let i = 0; i < points.length; i++) {
    centroid[0] += points[i][0];
    centroid[1] += points[i][1];
  }

  let totalPoints = points.length;
  centroid[0] = centroid[0] / totalPoints;
  centroid[1] = centroid[1] / totalPoints;

  return centroid;
};
