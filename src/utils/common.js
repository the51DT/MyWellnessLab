// mobile check
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/** vector normaliza 0~1 */
export const vector_normalise = (vec) => {
  var vmin = Math.min(...vec);
  var vmax = Math.max(...vec);
  
  var vdelta = vmax - vmin;
  
  var vec_ret = [];
  
  var vnorm;
  
  vec.forEach(value => {
    vnorm = (value - vmin) / vdelta;
    vec_ret.push(vnorm);
  })
  return vec_ret
}

export const randomRange = (start, end) => {
  return Math.floor(Math.random() * (end - start + 1) + start);
};

export const centroid = (points) => {
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

export const getVector = (point1, point2) => {
  const x = point1[0] - point2[0];
  const y = point1[1] - point2[1];
  const mag = Math.sqrt(x * x + y * y);
  return [(point1[0] - point2[0]) / mag, (point1[1] - point2[1]) / mag];
};

/** get Images */
export const renderImage = async (target_dir) => {
  var images = [];

  // 특정 폴더의 이미지를 동적으로 가져오기
  const allImageModules = import.meta.glob('@/assets/images/**/*.{png,jpg,jpeg,svg}');

  // target_dir 필터링
  const imageModules = Object.fromEntries(
    Object.entries(allImageModules).filter(([path]) => path.includes(`/assets/images/${target_dir}/`))
  );

  // 파일 이름과 경로 매핑 생성
  const imageEntries = Object.entries(imageModules).map(([path, importFn]) => {
      // 경로에서 파일 이름만 추출
      const fileName = path.match(/\/([^/]+)\.(png|jpe?g|svg)$/)[1];
      return { path, fileName, importFn };
  });

  // 파일 이름을 숫자로 변환하여 정렬
  const sortedEntries = imageEntries.sort((a, b) => {
      const numA = parseInt(a.fileName, 10);
      const numB = parseInt(b.fileName, 10);
      return numA - numB;
  });

  // 정렬된 순서대로 이미지 로드
  const imagePromises = sortedEntries.map((entry) => entry.importFn());
  const loadedImages = await Promise.all(imagePromises);

  // 이미지를 배열에 저장
  images = loadedImages.map((module) => module.default);

  return images
}

/** yyyy to yy */
export const datetimeStrToDateFormat = (datetimeString, format)  => {
  // Date 객체로 변환
  const date = new Date(datetimeString);

  switch(format) {
    case 'yyyy.mm.dd':
      return dateToFormatString(date, 'yyyy.mm.dd');
    case 'yyyy.mm':
      return dateToFormatString(date, 'yyyy.mm');
    case 'yyyy-mm-dd':
      return dateToFormatString(date, 'yyyy-mm-dd');
    case 'dd/mm/yyyy':
      return dateToFormatString(date, 'dd/mm/yyyy');
    case 'mm-dd-yyyy':
      return dateToFormatString(date, 'mm-dd-yyyy');
    case 'yyyy년mm월dd일':
      return dateToFormatString(date, 'yyyy년mm월dd일');
    
    case 'yyyy년mm월dd일dd요일':
      return dateToFormatString(date, 'yyyy년mm월dd일dd요일');
    case 'AMPM hh:mm':
      return datetoAMPMFormat(date);
    default:
      return dateToFormatString(date, 'yyyy-mm-dd');
  }
}

export const sleep = (delay) =>
  new Promise((resolve) => setTimeout(resolve, delay));

export const convertName = (str, name) => {
  return str.replace(/@@@/g, name);
}

/**
 * 
 * 나이대 계산
 */
export const ageToAgeGroup = (age) => {
  return Math.floor(age / 10) * 10;
}