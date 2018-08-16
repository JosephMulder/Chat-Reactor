import React, { Component } from 'react';
import axios from 'axios';
import { Table, Jumbotron } from 'react-bootstrap';

import NewMessage from './NewMessage.jsx';
import Message from './Message.jsx';
import Title from './Title.jsx';
import { resolve } from 'path';
import textToScore from '../lib/textToScore.js'

export default class Chat extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: 'Hard-Code Bob',
      activeRoom: 'lobby',
      activeRoomId: 1,
      rooms: ['lobby', 'theOtherRoom'],
      roomScore: 0,
      messages: [],
      newMessageText: '',
      messageScore: 0,
      mood: 'neutral',
      moods: ['highly-neg', 'neg', 'slightly-neg', 'neutral', 'slightly-pos', 'pos', 'highly-pos'],
      sessionDuration: 0
    }
    this.handleChange = this.handleChange.bind(this);
    this.postMessage = this.postMessage.bind(this);
    this.refreshInput = this.refreshInput.bind(this);
    this.setMood = this.setMood.bind(this);
    this.addRoom = this.addRoom.bind(this);
  }

  tick = () => {
    this.setState(prevState => ({
      sessionDuration: prevState.sessionDuration + 1
    }))
    this.getMessages();
    if (this.state.sessionDuration > 590) {
      this.props.onLogOut();
    }
  }

  componentDidMount = () => {
    this.getMessages();
    this.setMood();
    this.interval = setInterval(() => {
      this.tick();
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    return (this.state !== nextState);
  }

  getMessages = (activeRoom=this.state.activeRoom) => {
    axios.get('/messages', {
      params: {
        activeRoom: activeRoom
      }})
      .then(res => { // Checks each message from server against activeRoomId
        // and filters out the ones that don't match, messages for the active
        // room are stored in state.messages
        // TODO: change sql query to only select current roomID
        let messages = [];
        if(res.data.length){
          messages = res.data.reverse().filter(msg => {
            return (msg.roomId === this.state.activeRoomId);
          });
        }
        let roomScore = 0;
        messages.forEach((msg)=>roomScore+=msg.score)
        /*******************************************/
        this.setState({messages,roomScore});
        this.setMood();
      })
      .catch(err => {console.error(err)})


      axios.get('/rooms')
      .then(data => {
        var newRooms = [];
        for (var i = 0; i < data.data.length; i++) {
          newRooms.push(data.data[i].roomname);
        }
        this.setState({rooms: newRooms});
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  handleChange = (event) => {
    let input = event.target.value;
    this.setState({
        newMessageText: input,
        messageScore: textToScore(input)
    });
  }

  keyHandler = (event) => {
    if (event.key === 'Enter') {
      this.postMessage();
    }
  }

  refreshInput = () => {this.setState({newMessageText: '',messageScore:0});}

  postMessage = () => {
    axios.post('/messages', {
      roomId: this.state.activeRoomId,
      userId: this.props.userData.id,
      username: this.props.userData.username,
      text: this.state.newMessageText,
      score: this.state.messageScore,
      roomname: this.state.activeRoom
    })
      .then(res => {
        this.refreshInput();
        this.getMessages();
        this.setMood();
      })
      .catch(err => {console.error(err)});
  }

  changeRoom = (event) => {
    this.setState({
      activeRoom: event.target.value
    });
    this.getMessages(event.target.value);
  }

  setMood = () => {
    let score = this.state.roomScore;
    var newMoodIdx = 3;
    if (score >= 18) {
      newMoodIdx = 6;
    } else if (score >= 9) {
      newMoodIdx = 5;
    } else if (score > 4) {
      newMoodIdx = 4;
    } else if (score <= -18) {
      newMoodIdx = 0;
    } else if (score <= -9) {
      newMoodIdx = 1;
    } else if (score < -4) {
      newMoodIdx = 2;
    }
    this.setState({
      mood: this.state.moods[newMoodIdx]
    });
  }

  addRoom = (roomname) => {
    axios.post('/rooms', {
      roomname: roomname,
      users_id: 66,
      roomscore: 0
    })
    .then((res) => {
    })
    .catch(err => {console.log(err)});

    axios.get('/rooms')
      .then(data => {
        var newRooms = [];
        for (var i = 0; i < data.data.length; i++) {
          newRooms.push(data.data[i].roomname);
        }
        this.setState({rooms: newRooms});
      })
      .catch(function (error) {
        console.log(error);
      });

  }


  render() {
  
    return (
      <div >
        <Title user={this.props.userData.username} room={this.state.activeRoom} score={this.state.roomScore} rooms={this.state.rooms} changeRoom={this.changeRoom} addRoom={this.addRoom} logout={this.props.onLogOut} />
        <NewMessage text={this.state.newMessageText} handleChange={this.handleChange} postMessage={this.postMessage} refresh={this.refresh} keyHandler={this.keyHandler}/>
          <Jumbotron className="chat-container" >
            <div className={this.state.mood}>
              <div >
                <Table responsive hover>
                  <tbody>
                    {this.state.messages.map((message, index) => 
                      <Message key={message.messageid} messageData={message} user={this.state.user}/>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          </Jumbotron>
      </div>
    )
  }
}
