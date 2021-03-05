import React, { useRef } from 'react';
import './App.css';

const IMG = (imgName) => {
  return require(`./assets/img/${imgName}`).default
}
const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

const Canvas =  props => {

  
  const [image, setImage] = React.useState(null);
  const canvasRef = useRef(null);

  
  React.useEffect(() => {
    const memeImage = new Image();
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

// class Canvas extends React.Component {
//   constructor(props) {
//     super(props);
//     this.imgRef = React.createRef();
//     this.canvasRef = React.createRef();
//   }
// // Similar to componentDidMount and componentDidUpdate:
// useEffect(() => {
//   // Update the document title using the browser API
//   document.title = `You clicked ${count} times`;
// });

  
//   render() {
//       return(
//         <div>
//           <canvas ref={this.canvasRef} width={640} height={425} />
//           <img alt="" ref={this.imgRef} src={IMG(this.props.path)} className="hidden" />
//         </div>
//       )
//     }
//   }
// class Memecontainer extends React.Component {

//   render() {
//     return (
//       <div>
//         <img alt=""  src={IMG(this.props.path)} />
//         <div onClick={this.downloadCanvas()}>Download</div>

//       </div>
//     );
//   }
// }

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      path:'001.jpg',
      text:'Just another meme'
    };
  }

  handleInputChange = (e) => {
    this.setState({ text: e.target.value });
  };

  render()
  { return (
    <div className="App">
      <header className="App-header">
        <div className="App-header-title">The ultimate worthless meme generator </div>
      </header>
    <div className="App-container">
    <input placeholder="Make your own meme" className="App-input" value={this.state.text} onChange={this.handleInputChange}></input>

      <Canvas path={this.state.path} text={this.state.text}></Canvas>
    {/* <Memecontainer path={this.state.path}></Memecontainer> */}
    </div>

    </div>
  );
  }
}

export default App;
