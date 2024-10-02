import React, { useRef, useMemo, useEffect, useState } from "react";
import { createWorker } from "tesseract.js";
import idGen from "./utils/newId.js";
import { useDropzone } from "react-dropzone";

import "./App.css";

//
const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  height: "100%",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
  justifyContent: "center",
  marginBottom: "5rem",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

function Basic(props) {
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ accept: "image/*" });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  const drop = props.dropfiles;

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      drop(acceptedFiles);
      console.log("Basic=> file changed");
    }
  }, [acceptedFiles, drop]);

  const converter = (bytes) => {
    const pow = Math.log2(bytes);
    switch (true) {
      case pow >= 10 && pow < 20:
        return `${(bytes / 1024).toFixed(2)} Kb`;
      case pow >= 20 && pow < 30:
        return `${(bytes / 1024 / 1024).toFixed(2)} Mb`;
      default:
        return `${bytes} bytes`;
    }
  };

  const fileSum = acceptedFiles.length;

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {converter(file.size)}
    </li>
  ));

  return (
    <section class="bg-gray-100 w-full h-72 border-8 rounded-xl border-dotted border-green-400">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p class="text-xl font-bold text-gray-500">Drag & drop files here.</p>
      </div>
      {/* {files.length > 0 ? (
        <div class="pt-20 pb-20">
          <h4>Files</h4>
          <ul>{files}</ul>
          <div>{`Total files: ${fileSum}`}</div>
        </div>
      ) : (
        ""
      )} */}
    </section>
  );
}

const CanvasImg = (props) => {
  /** Special ID for each canvas */
  const id = idGen();
  const [file, setFile] = useState(props.file);
  const [imgUrl, setImgUrl] = useState("");
  const [image, setImage] = useState(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatus, setOcrStatus] = useState("init");
  const [ocr, setOcr] = useState(["Recognizing..."]);

  const canvasRef = useRef(null);
 
  //OCR
  const worker = createWorker({
    logger: (m) => {
      console.log(m);
      if (m.progress) setOcrProgress(m.progress);
      if (m.status) setOcrStatus(m.status);
    },
  });
  const doOCR = async (src) => {
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(src);
    setOcr(
      text
        .split(/\r?\n/)
        .sort()
        .filter((ele) => ele)
    );
  };
  //

  const handleImage = (file) => {
    const fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onloadend = (e) => {
      setImgUrl(e.target.result);
    };

    // setImgUrl(fr.result);
  };

  useEffect(() => {
    console.log("Canvas=> file changed");
    setFile(props.file);
    setOcr(["Recognizing..."]);
    handleImage(file);
  },[file,props.file]);

  // if (props.file) {
  //   const fr = new FileReader();
  //   fr.readAsDataURL(props.file);
  //   fr.onloadend = (e) => {
  //     setImgUrl(e.target.result);
  //   };
  // }

  useEffect(() => {
    // console.log("image changed", imgUrl);
    const memeImage = new Image();
    memeImage.crossOrigin = "anonymous";
    memeImage.onload = () => setImage(memeImage);
    memeImage.src = imgUrl;
  }, [imgUrl]);

  useEffect(() => {
    if (image && canvasRef) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.save();
      const scale = 0.4;
      // const ratio =
      // image.width / window.outerWidth  > 1.15
      //     ? 1
      //     : (scale * window.outerWidth) / image.width;
      // const width = ratio < 1 ? scale * window.outerWidth : image.width;
      // ctx.canvas.width = width;
      // ctx.canvas.height = ratio < 1 ? ratio * image.height : image.height;

      // const ratio =
      //   image.width /window.outerWidth > 0.4
      //     ? 1
      //     : (scale * window.outerWidth) / image.width;
      // const width = ratio < 1 ? scale * window.outerWidth : image.width;
      const width =
        image.width / window.outerWidth > 0.4
          ? scale * image.width
          : image.width;
      const height =
        image.width / window.outerWidth > 0.4
          ? scale * image.height
          : image.height;
      ctx.canvas.width = width;
      ctx.canvas.height = height;

      if (image.width / window.outerWidth > 0.4) {
        ctx.scale(scale, scale);
      }

      ctx.drawImage(image, 0, 0);
      const src = document.getElementById(`recCanvas${id}`);

      doOCR(src);
      // ctx.scale(-ratio, -ratio);
      // ctx.setTransform(-1*ratio, 0.2*ratio, 0, -1*ratio, 0, 60*ratio);
      // ctx.font = tPx/3+"px Verdana";
      // const startPoint2 = (250/3 - ctx.measureText(props.text).width)/2;
      // ctx.fillText(props.text, -350+startPoint2, -455+20/tPx);
      //
      ctx.restore();
    }
  }, [image, canvasRef]);

  return (
    <div class="flex flex-col justify-center border">
      <div>{`Case: ${id}`}</div>
      <div class="border-xl border-gray-400 flex justify-center">
        <canvas ref={canvasRef} id={`recCanvas${id}`} />
      </div>
      <div className="relative pt-1 px-5">
        <div className="flex mb-2 items-center justify-between">
          <div>
            {ocrProgress !== 1 || ocrStatus !== `recognizing text` ? (
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                {ocrStatus}
              </span>
            ) : (
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                Done
              </span>
            )}
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-green-600">
              {ocrProgress * 100}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
          <div
            style={{ width: `${ocrProgress * 100}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
          ></div>
        </div>
      </div>
      <div class="w-full flex flex-col justify-center items-center">
        <div class="w-9/12">
          <table class="w-full table-auto border-separate border border-green-800 rounded-md bg-green-100">
            <thead>
              <tr>
                <th class="font-bold boreder border-green-800">Items</th>
              </tr>
            </thead>
            <tbody class="bg-emerald-200">
              {ocr.map((ele,index) => (
                <tr class="border border-green-800">
                  {index%2===0?<td class="border border-green-800">{ele}</td>:<td class="bg-yellow-100 border border-green-800">{ele}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {ocrStatus===`recognizing text` && ocrProgress===1?
      <div> There're {ocr.length} items in total.</div>:""
              }
    </div>
  );
};

//

const Recogmulti = (props) => {
  /** Special ID for each canvas */
  const id = idGen();

  //Drag & drop files
  const onDropFiles = (files) => {
    console.log("Recogmulti=> file changed");
    // handleImage(files);
    setFiles(files);
  };

  //OCR
  const worker = createWorker({
    logger: (m) => console.log(m),
  });
  const doOCR = async (src) => {
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(src);
    setOcr(
      text
        .split(/\r?\n/)
        .sort()
        .filter((ele) => ele)
    );
  };
  const [ocr, setOcr] = React.useState(["Recognizing..."]);
  //
  const [files, setFiles] = React.useState(null);

  useEffect(() => {
    // console.log("files changed =>", files);
  }, [files]);

  //
  // const [something, setSomething] = React.useState("");
  // const [imgUrl, setImgUrl] = React.useState("");

  // const handleImage = (files) => {
  //   const fr = new FileReader();
  //   fr.readAsDataURL(files[0]);
  //   fr.onloadend = (e) => {
  //     setImgUrl(e.target.result);
  //   };

  //   // setImgUrl(fr.result);
  // };

  // const handleInput = (e) => {
  //   const file = document.getElementById(`imageInput${id}`).files[0];
  //   handleImage(file);
  // };
  // const somethingOnChange = (event) => {
  //   setSomething(event.target.value);
  // };

  // const [image, setImage] = React.useState(null);
  // const canvasRef = useRef(null);

  // React.useEffect(() => {
  //   const memeImage = new Image();
  //   memeImage.crossOrigin = "anonymous";
  //   memeImage.onload = () => setImage(memeImage);
  //   memeImage.src = imgUrl;
  // }, [imgUrl]);

  // React.useEffect(() => {
  //   if (image && canvasRef) {
  //     const ctx = canvasRef.current.getContext("2d");
  //     ctx.save();
  //     const scale = 0.6;
  //     const ratio =
  //       window.outerWidth / image.width >= 1.15
  //         ? 1
  //         : (scale * window.outerWidth) / image.width;
  //     const width = ratio < 1 ? scale * window.outerWidth : image.width;
  //     ctx.canvas.width = width;
  //     ctx.canvas.height = ratio < 1 ? ratio * image.height : image.height;

  //     if (ratio < 1) {
  //       ctx.scale(ratio, ratio);
  //     }

  //     ctx.drawImage(image, 0, 0);
  //     const src = document.getElementById(`recCanvas${id}`);

  //     doOCR(src);
  //     // ctx.scale(-ratio, -ratio);
  //     // ctx.setTransform(-1*ratio, 0.2*ratio, 0, -1*ratio, 0, 60*ratio);
  //     // ctx.font = tPx/3+"px Verdana";
  //     // const startPoint2 = (250/3 - ctx.measureText(props.text).width)/2;
  //     // ctx.fillText(props.text, -350+startPoint2, -455+20/tPx);
  //     //
  //     ctx.restore();
  //   }
  // }, [image, canvasRef]);

  // const downloadCanvas = () => {
  //   const img = canvasRef.current.toDataURL();
  //   // const dt = img.replace(/^data:image\/png;base64,/, "");
  //   // const blob = b64toBlob(dt, "image/png");
  //   // const blobUrl = URL.createObjectURL(blob);

  //   const a = document.createElement("a");
  //   document.body.appendChild(a);
  //   a.href = img;
  //   a.download = "meme.png";
  //   a.click();
  //   document.body.removeChild(a);
  // };

  return (
    <div className="canvas-container" class="w-10/12">
      <div class="h-full">
        {" "}
        <Basic dropfiles={(files) => onDropFiles(files)} />
      </div>
      {/* <input
        type="file"
        id={`imageInput${id}`}
        accept="image/*"
        onChange={handleInput}
        multiple
        class="hidden"
      ></input> */}
      {/* <canvas ref={canvasRef} id={`recCanvas${id}`} /> */}
      {/* {ocr.map((ele) => (
        <div>{ele}</div>
      ))} */}
      {/* <a id="down"  download="FILENAME.png" href={`${canvasImg}`}>Download</a> */}
      <div class="flex flex-col md:grid md:grid-cols-2 mt-5">
        {files && files.length > 0
          ? files.map((ele) => {
              return (
                <div>
                  <CanvasImg file={ele}></CanvasImg>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default Recogmulti;
