import wx, { Component, PropTypes } from 'labrador-immutable';

class IndexMap extends Component {
  state = {
    position: {
      latitude: 23.099994,
      longitude: 113.324520,
    },
    markers: [{
      id: 0,
      latitude: 30.572269,
      longitude: 104.066541,
      title: '鱼说',
      iconPath: './controls.jpg',
      alpha: 0.5,
      width: 50,
      height: 50
    }, {
      id: 1,
      latitude: 31.572269,
      longitude: 105.066541,
      title: '鱼说',
      iconPath: 'https://image-cdn.fishsaying.com/9f751c617ffc4fa5b0bba8e83bb4d20e.jpeg',
      alpha: 0.5,
      width: 25,
      height: 25
    }],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    controls: [{
      id: 1,
      iconPath: './controls.jpg',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }]
  };
  regionchange(e) {
    console.log(e.type)
  };
  markertap(e) {
    console.log(e.markerId)
  };
  controltap(e) {
    console.log(e.controlId)
  }
  async onReady() {
    const sysInfo = await wx.getSystemInfo();
    const position = await wx.getLocation();
    console.log(position)
    this.setState({ sysInfo, position });

    const allMarkersResp = await wx.request({ url: 'https://capi.fishsaying.com/capi/homepage/allMarks?bottomLeft=103.92639,30.378892&topRight=104.194493,30.762335&scale=1996.3065' });
    const allMarkers = allMarkersResp.data;
    const voices = allMarkers.result.voices;
    console.log('voices: ', voices);
    const markers = voices.map((e, i) => {
      return {
        id: i,
        latitude: e.latitude,
        longitude: e.longitude,
        title: '鱼说',
        iconPath: './controls.jpg',
        alpha: 0.5,
        width: 25,
        height: 25
      }
    });
    console.log(markers);
    this.setState({markers});
  }
}

export default IndexMap;