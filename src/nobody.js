
import React, { useRef } from 'react';
import './App.css';



const NobodyMeme =  props => {
    const [somebody, setSomebody] = React.useState("Somebody");
    // const [something, setSomething] = React.useState("");
    const [imgUrl, setImgUrl] = React.useState("https://thiscatdoesnotexist.com/");
  
    const somebodyOnChange = (event) => {
      setSomebody(event.target.value);
    };
    const imgUrlOnChange = (event) => {
      setImgUrl(event.target.value);
    };
    const handleImage = (e) => {
      const file = document.getElementById('imageInput').files[0];
      const fr = new FileReader();
      fr.readAsDataURL(file);
      fr.onloadend = (e) => {
        setImgUrl(e.target.result)
      }
      console.log(file,fr,fr.result)
      // setImgUrl(fr.result);
  
  }
    // const somethingOnChange = (event) => {
    //   setSomething(event.target.value);
    // };
    
  
    
    const [image, setImage] = React.useState(null);
    const canvasRef = useRef(null);
  
    
    React.useEffect(() => {
      const memeImage = new Image();
      memeImage.crossOrigin =  "anonymous";
      // "https://thiscatdoesnotexist.com/"
      memeImage.onload = () => setImage(memeImage);
      memeImage.src=imgUrl;
    
    }, [imgUrl])
  
    React.useEffect(()=>{
      if(image && canvasRef){
        const blankHeight = 150;
        const ctx = canvasRef.current.getContext('2d')
        ctx.save();
        const scale = 0.6;
        const ratio = window.outerWidth/image.width>=1.15?1:scale*window.outerWidth/image.width;
        const width = ratio<1?scale*window.outerWidth:image.width;
        ctx.canvas.width  = width;
        ctx.canvas.height = ratio<1?ratio*image.height+blankHeight:image.height+blankHeight;
        ctx.fillStyle = "#FFFFFF";
        ctx.rect(0, 0, width, blankHeight);
        ctx.fill();
        if(ratio<1){
          ctx.scale(ratio, ratio);
        }
        
  
        ctx.drawImage(image,0,blankHeight);
        //
        ctx.fillStyle = "#000000";
        const tSize = (width+150)/somebody.length;
        const tPx = (tSize>30)?30:tSize;
        ctx.font = tPx+"px Verdana";
        const startPoint = 20;
        ctx.fillText("Nobody: ", startPoint, 40);
        ctx.fillText(somebody+": ", startPoint, blankHeight-20);
        // ctx.scale(-ratio, -ratio);
        // ctx.setTransform(-1*ratio, 0.2*ratio, 0, -1*ratio, 0, 60*ratio);
        // ctx.font = tPx/3+"px Verdana";
        // const startPoint2 = (250/3 - ctx.measureText(props.text).width)/2;
        // ctx.fillText(props.text, -350+startPoint2, -455+20/tPx);
        //
        ctx.restore();
  
  
      }
    }, [somebody,image,canvasRef])
    
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
          <input type="text" placeholder="Somebody" className="App-input" value={somebody} onChange={somebodyOnChange}></input>
          {/* <input type="text" placeholder="Something" className="App-input" value={something} onChange={somethingOnChange}></input> */}
          <input type="text" placeholder="Url or upload an image" className="App-input" value={imgUrl} onChange={imgUrlOnChange}></input>
          <label className="download-btn" htmlFor="imageInput">Browse...</label>
          <input className="download-btn" type="file" id="imageInput" accept = "image/*" onChange={handleImage}></input>
  
               <canvas ref={canvasRef}  />
               <div className="download-btn" onClick={downloadCanvas}>Download your meme</div>
               {/* <a id="down"  download="FILENAME.png" href={`${canvasImg}`}>Download</a> */}
  
               </div>)
  }

  export default NobodyMeme;