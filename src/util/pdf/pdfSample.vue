<script setup>
import { jsPDF } from "jspdf";
import { ref, onMounted, } from 'vue';

const pdfScale = ref(4);
const pdfProcessing = ref(false);

//API 데이터
const health = ref(null); //rstHQ_DiagRepMHI1
const eatingHabit = ref(null); //rstHQ_DiagRepMHI1_R1
const hcr = ref(null); //GetHCRList
const comph = ref(null); //rstComphCkRep
const meal = ref(null); //rstHE_DiagRep
const recommendData = ref(null); //mhnPNSReport

const check_date = ref(null);

const loading = ref(true);
const userInfo = ref(null);

const isSub = ref(false);
const totalPage = ref(27);
// totalPage = ref(1,
// 이미지로 처리하는 페이지 리스트
const staticPageList = ref([2, 4, 5, 8, 9, 10, 14, 16, 22, 25, 27]);

const report_no = ref(-1);
const isLoading = ref(true);

const test = ref(false);
const testPage = ref(23);
const pdfProcessingPage = ref(-1);
const loadingGraph = ref(false); //22페이지 로딩 중 여부
const loadingPage29 = ref(false); //29페이지 로딩 중 여부
const enableDownload = ref(true);

function simpleExportToPdf(isPassword) {
    console.log('#### simpleExportToPdf')
    const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: [210, 297],
        encryption: {//암호설정
            userPassword:'1234',
            ownerPassword:'mwlab',
            userPermissions: ["print", "modify", "copy", "annot-forms"],
        },
    });
    
    pdf.line(15, 19, 195, 19);
    pdf.text(15, 40, '안녕하세요.');

    //document.save('web_Pdf');
    let blob;
    let blobUrl;
    //삼성 브라우저일 경우 자동 다운로드 안되고 유저가 다운로드 버튼을 클릭해야 다운로드 가능하다.
    if(needBlodDownload()) {
        blob = new Blob([pdf.output('blob')], {
            type:'application/pdf',
        });
        blobUrl = URL.createObjectURL(blob);
    }
    else {
        if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        )
        ) {
            blob = new Blob([pdf.output("blob")], {
                // type: "application/pdf",
            });
            blobUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            // a.download = name || Math.random();
            a.href = blobUrl;
            a.setAttribute("download", getFileName());
            document.body.appendChild(a);
            setTimeout(() => {
                a.click();
                setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
                document.body.removeChild(a);
                }, 1);
            }, 0);
        }
        // PC 브라우저 다운로드
        else {
            blob = new Blob([pdf.output("blob")], {
                // type: "application/pdf",
            });
            blobUrl = URL.createObjectURL(blob);

            const filename = getFileName();
            if (window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(pdf, filename);
            } else {
                const a = document.createElement("a");
                document.body.appendChild(a);
                const url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = filename;
                a.click();
                setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                }, 0);
            }
        }
    }
}

function exportToPdf() {{
    //this.pdfProcessing = true;
    //this.resize();

    //await sleep(1);
    const page = document.querySelector("#mainpage");
    console.log("PAGE", page);
    const windowWidth = page.offsetWidth;
    const targetWidth = 960;
    console.log("scale", page.offsetWidth, targetWidth / windowWidth);

    const main = document.querySelector("#main");

    console.log("exportToPdf", window.devicePixelRatio * 2);

    let pixelRatio = window.devicePixelRatio * 2;
    //아이폰인 경우 메모리 제한이 있어서 기본 해상도로 설정
    if (/iPhone|iPod/i.test(navigator.userAgent)) {
    pixelRatio = window.devicePixelRatio;
    }

    // 해상도 낮을 경우 강제로 해상도 스케일업
    if (window.devicePixelRatio < 2) {
        pixelRatio = 4;
    }

    // 캔버스 내보내기 설정
    const canvasOptions = {
        allowTaint: true,
        useCORS: true,
        scale: pixelRatio,
        letterRendering: true,
        logging: false,
        skipAutoScale: true,
        skipFonts: false,
        removeContainer: true,
        foreignObjectRendering: false,
    };

    const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: [210, 297],

        // pdf 암호 설정
        encryption: {
            userPassword: '1234',
            ownerPassword: 'MWLAB',
            userPermissions: ["print", "modify", "copy", "annot-forms"],
        }, //패스워드 생년월일로 설정
    });

    /* for (let i = 0; i < this.totalPage; i++) {
        this.pdfProcessingPage = i + 1;
        console.log("page" + this.pdfProcessingPage);

        //graphchart 로딩 여부 확인
        if (
            (!this.test && this.pdfProcessingPage === 23) ||
            (this.test && this.testPage === 23 && this.pdfProcessingPage === 23)
        ) {
            this.loadingGraph = false;

            while (!this.loadingGraph) {
            console.log("1");
            await sleep(1);
            }
        }

        // Page29.vue 페이지 로딩여부
        if (
            (!this.test && this.pdfProcessingPage === 26) ||
            (this.test && this.testPage === 26 && this.pdfProcessingPage === 26)
        ) {
            this.loadingPage29 = false;

            // 로딩까지 대기
            while (!this.loadingPage29) {
            await sleep(1);
            }
        }

        await sleep(1);

        if (this.updateProgress)
            this.updateProgress((i / this.totalPage) * 100);

        const elementDOM = document.querySelector("#page" + (i + 1));

        if (!elementDOM) continue;

        canvasOptions.height = elementDOM.scrollHeight / 4;

        // 사파리 브라우저일경우 width값 설정 따로 해줘야한다.
        if (this.isSafari()) {
            canvasOptions.width = elementDOM.scrollWidth;
        } else {
            console.log("issafarifalse", navigator.maxTouchPoints);
            canvasOptions.width = elementDOM.scrollWidth / 4;
        }

        // pdf 화면을 4배 크게 만들어서 4배 축소시켜야한다. pdfScale
        canvasOptions.canvasHeight = elementDOM.scrollHeight / 4;
        canvasOptions.canvasWidth = elementDOM.scrollWidth / 4;

        // 이미지로 된 페이지 캔버스로 내보낸 후 이미지로 저장해서 pdf파일에 추가
        if (this.isStaticPage(i + 1)) {
            console.log("html2canvas staticpage", i + 1);
            await html2canvas(elementDOM, canvasOptions)
            .then(async (canvas) => {
                console.log("canvas", canvas, canvas.width, canvas.height);
                const imgData = canvas.toDataURL("image/jpeg");

                // a4용지사이즈
                let imageWidth = 210;
                let imageHeight = 297;

                // 첫페이지 출력 (imgData,    확장자 ,  시작x,   시작y,  폭,     높이)
                // pdf.addPage();
                if (i !== 0) {
                pdf.addPage();
                }

                await pdf.addImage(
                imgData,
                "JPEG",
                0,
                0,
                imageWidth,
                imageHeight
                );

                // pdf 저장 후 캔버스 제거(메모리 이슈)
                canvas.width = 0;
                canvas.height = 0;
                canvas.remove();
                canvas = null;
                if (this.test && i === this.testPage) {
                document.body.appendChild(canvas);
                }
                await sleep(1);
            })
            .catch((error) => {
                console.log("error1", error);
            });
        }
        // 코딩처리한 페이지 처리하는 부분. 해당 페이지 동일하게 캔버스로 내보낸 후 이미지로 저장
        else {
            await html2canvas(elementDOM, canvasOptions)
            .then(async (canvas) => {
                console.log("canvas", canvas);
                // 이미지 변환
                const imgData = canvas.toDataURL("image/jpeg");

                let imageWidth = 210; //canvas.width / (canvas.width / 210);
                let imageHeight = 297;

                // 첫페이지 출력 (imgData,    확장자 ,  시작x,   시작y,  폭,     높이)
                // pdf.addPage();
                if (i !== 0) {
                pdf.addPage();
                }

                //pdf페이지에 이미지 저장
                await pdf.addImage(
                imgData,
                "JPEG",
                0,
                0,
                imageWidth,
                imageHeight
                );

                // pdf 저장 후 캔버스 초기화
                canvas.width = 0;
                canvas.height = 0;
                canvas.remove();
                canvas = null;

                if (this.test && i === this.testPage) {
                console.log("TestPage", this.testPage);
                document.body.appendChild(canvas);
                }

                await sleep(1);
            })
            .catch((error) => {
                console.log("error2", error);
            });
        }

        if (this.test && i == this.testPage - 1) break; //테스트 코드 */
    }

    if (enableDownload === true) {
        let blob;
        let blobUrl;

        console.log("enableDownload");

        // 삼성 브라우저일 경우 자동 다운로드 안되고 유저가 다운로드 버튼을 클릭해야 다운로드 가능하다.
        if (needBlodDownload()) {
            blob = new Blob([pdf.output("blob")], {
                type: "application/pdf",
            });
            blobUrl = URL.createObjectURL(blob);
        }
        // 기타 모바일 브라우저 다운로드 코드
        else {
            if (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            )
            ) {
                blob = new Blob([pdf.output("blob")], {
                    // type: "application/pdf",
                });
                blobUrl = URL.createObjectURL(blob);
                const a = document.createElement("a");
                // a.download = name || Math.random();
                a.href = blobUrl;
                a.setAttribute("download", getFileName());
                document.body.appendChild(a);
                setTimeout(() => {
                    a.click();
                    setTimeout(() => {
                    URL.revokeObjectURL(blobUrl);
                    document.body.removeChild(a);
                    }, 1);
                }, 0);
            }
            // PC 브라우저 다운로드
            else {
            blob = new Blob([pdf.output("blob")], {
                // type: "application/pdf",
            });
            blobUrl = URL.createObjectURL(blob);

            const filename = getFileName();
            if (window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(pdf, filename);
            } else {
                const a = document.createElement("a");
                document.body.appendChild(a);
                const url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = filename;
                a.click();
                setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                }, 0);
            }
            }
        }

        console.log("test");
        //this.pdfProcessing = false;
        //this.resize();
        main.style = "";
        //this.finish(blobUrl, this.getFileName());
    }
}

function needBlodDownload() {
    var browser = navigator.userAgent.toLowerCase();

    return (
        browser.indexOf("samsungbrowser") != -1 ||
        browser.indexOf("kakaotalk") != -1
    );
}

function getFileName() {
     return "로그미.pdf";
}

//상위에 전달용
defineExpose({simpleExportToPdf, exportToPdf});

</script>

<template>



</template>

<style lang="scss">

</style>