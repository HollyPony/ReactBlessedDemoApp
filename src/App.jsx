import React, {Component} from 'react';
import blessed from 'blessed';
import {render} from 'react-blessed';

import imageToAscii from 'image-to-ascii';

// Rendering a simple centered box
class App extends Component {

  constructor(props) {
    super(props);

    if (!this.state) {
      this.state = {
        main: {
          position: {
            top: 15,
            left: 0
          }
        },
        console: {
          log: []
        }
      }
    }

    console.log = (...msg) => {
      this.state.console.log.push(...msg);
      this.setState({});
    };

    imageToAscii('src/assets/unicorn.jpg', (err, converted) => {
      this.setState({sprite: converted});
    });
  }

  componentDidMount() {
    keyPress['left'] = (params) => {
      console.log('left');
      this.setState(Object.assign(this.state.main.position, {
        left: this.state.main.position.left - 1
      }));
    };
    keyPress['right'] = (params) => {
      console.log('right');
      this.setState(Object.assign(this.state.main.position, {
        left: this.state.main.position.left + 1
      }));
    };
    keyPress['up'] = (params) => {
      console.log('up');
      // console.log('up');
      this.setState(Object.assign(this.state.main.position, {
        top: this.state.main.position.top - 1
      }));
    };
    keyPress['down'] = (params) => {
      console.log('down');
      this.setState(Object.assign(this.state.main.position, {
        top: (this.state.main.position.top + 1)
      }));
    };
    keyPress['d'] = (params) => {
      this.refs.debugView.toggle();
      this.setState({});
    };
  }

  render() {
    return (
      <element ref="root">
        <box ref="main"
             top={this.state.main.position.top}
             left={this.state.main.position.left}
             width="80%"
             height="100%"
             draggable="true"
             // border={{type: 'line'}}
             style={{border: {fg: 'blue'}}}>
          {this.state.sprite}
        </box>
        <list ref="debugView"
              top="0"
              right="0"
              width="25%"
              height="100%"
              mouse="true"
              border={{type: 'line'}}
              style={{border: {fg: 'red'}}}>
          {this.state.console.log.map(line => line + '\n')}
        </list>
      </element>
    );
  }
}

// Creating our screen
const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'Poney'
});

const keyPress = {};

// Adding a way to quit the program
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.on('keypress', function(key, params) {
  params && params.name && keyPress[params.name] && keyPress[params.name](params);
});

// Rendering the React app using our screen
const component = render(<App />, screen);