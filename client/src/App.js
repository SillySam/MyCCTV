import React, { Component } from 'react';
import './App.css';
  
  class App extends Component {
  
    constructor(props) {
      super(props)
  
      this.state = {
        cameras: ''
      };
    }
  
    componentWillMount() {
      this.getCameras()
    }
  
    getCameras() {
      fetch('/api/cameras/')
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              cameras: result['data']
            })
          }
        );
    }
  
    render() {
  
      var cameras = [];
  
      for (let i = 0; i < this.state.cameras.length; i++) {
        const element = this.state.cameras[i];
        cameras.push(<Camera cam = {element}/>);
      }
  
      return (
        <div
          className = "App">
            {cameras}
        </div>
      );
    }
  }
  
  class Camera extends React.Component {
    constructor(props) {
  
      super(props);
  
      this.state = {
        interval: '',
        camera: props.cam
      }
    }
  
    componentDidMount() {
  
      var refreshRate = (
        this.state.camera.refreshRate * 1000
      )
  
      var interval_ = setInterval(() => {
        this.getCameraInfo().then(cameraInfo => {
          this.setState({
            camera: cameraInfo
          })
        })
      }, refreshRate)
  
      this.setState({
        interval: interval_
      })
  
    }
  
    componentWillUnmount() {
      clearInterval(this.state.interval);
    }
  
    getCameraInfo() {
  
      return new Promise((resolve, reject) => {
        fetch(`/api/camera/${this.state.camera._id}`)
          .then(res => res.json())
          .then(
            (result) => {
              resolve(result.data)
            }
          ).catch(err => reject(err));
      })
  
    }
  
    render() {
      var latestImage = (
        this.state.camera.images[
          this.state.camera.images.length - 1
        ]['fileName']
      );
      console.log('updated ' + this.state.camera.name)
      return (
        <span>
            <img
            className = "camera"
            src = {
              latestImage
            }
            />
        </span>
      );
    }
  }
  
  
  export default App;