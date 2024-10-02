import React from 'react';
// import Recognization from './recognization'
import Recogmulti from './recogMulti'
import './App.css';

const Navbar = (props) =>{

  return (<div className="navbar-container" class="w-screen fixed top-0 p-1 flex bg-green-600 justify-between items-center text-white ">
<div className="navbar-title" class="text-2xl font-bold">The utlities</div>
<div className="navbar-btns"><div className="navbar-btn">Diffchecker</div> </div>
  </div>)

};

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
    <div className="App" class="h-screen">
      <Navbar></Navbar>
      <header className="App-header">
      </header>
    <div className="App-container" class="w-screen flex justify-evenly items-start flex-wrap">   
      <Recogmulti path={this.state.path} ></Recogmulti>
    </div>

    </div>
  );
  }
}

export default App;
