import React, { useRef } from 'react';
import './App.css';

const IMG = (imgName) => {
  return require(`./assets/img/${imgName}`).default
}


const Canvas =  props => {

  
  const [image, setImage] = React.useState(null);
  const canvasRef = useRef(null);

  
  React.useEffect(() => {
    const memeImage = new Image();
    // memeImage.crossOrigin='*';
    memeImage.src=IMG(props.path);
    // "https://thiscatdoesnotexist.com/"
    memeImage.onload = () => setImage(memeImage);
    
  
  }, [props])

  React.useEffect(()=>{
    if(image && canvasRef){
      const ctx = canvasRef.current.getContext('2d')
      ctx.save();
      const ratio =window.innerWidth/image.width>=1?1:window.innerWidth/image.width;
      ctx.canvas.width  = ratio<1?window.innerWidth:image.width;
      ctx.canvas.height = ratio<1?ratio*image.height:image.height;
      if(ratio<1){
        ctx.scale(ratio, ratio);
      }

      ctx.drawImage(image,0,0);
      //
      const tSize = 430/props.text.length;
      const tPx = (tSize>30)?30:tSize;
      ctx.font = tPx+"px Verdana";
      const startPoint = (250 - ctx.measureText(props.text).width)/2;
      ctx.fillText(props.text, 95+startPoint, 160-40/tPx);
      ctx.scale(-ratio, -ratio);
      ctx.setTransform(-1*ratio, 0.2*ratio, 0, -1*ratio, 0, 60*ratio);
      ctx.font = tPx/3+"px Verdana";
      const startPoint2 = (250/3 - ctx.measureText(props.text).width)/2;
      ctx.fillText(props.text, -350+startPoint2, -455+20/tPx);
      //
      ctx.restore();


    }
  }, [props,image,canvasRef])
  
  const downloadCanvas = () => {
    const img  = canvasRef.current.toDataURL();
    // const dt = img.replace(/^data:image\/png;base64,/, "");
    // const blob = b64toBlob(dt, "image/png");
    // const blobUrl = URL.createObjectURL(blob);

    const a  = document.createElement("a");
    document.body.appendChild(a);
    a.href = img;
    a.download = "meme.png"
    a.click();
    document.body.removeChild(a);
  }


  return (<div className="canvas-container">
             <canvas ref={canvasRef}  />
             <div className="download-btn" onClick={downloadCanvas}>Download your meme</div>
             {/* <a id="down"  download="FILENAME.png" href={`${canvasImg}`}>Download</a> */}

             </div>)
}




export default Canvas;
