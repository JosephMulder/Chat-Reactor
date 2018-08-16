import React from 'react'
import { Navbar } from 'react-bootstrap';

export default class Title extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      term : ''
    }
    this.onChange = this.onChange.bind(this);
    this.addnewroom = this.addnewroom.bind(this);
  }
  addnewroom(roomname) {
    this.props.addRoom(roomname);
  }

  onChange (e) {
    this.setState({
      term: e.target.value
    });
  }

render() {

  return (
    <Navbar className="title">
    <div>
      You are logged in as {this.props.user}.
      You are in 
      <select name="room-selector" onChange={this.props.changeRoom}>
        {this.props.rooms.map((room, index) => {
          return <option value={room} key={index}>{room}</option>;
        })}
      </select>
        <button onClick={() =>this.addnewroom(this.state.term)}>Add Room</button>
        <input value={this.state.term} onChange={this.onChange}></input>
        <button onClick={this.props.logout}>Log Out</button>
    </div>
    </Navbar>
  )
}
}
