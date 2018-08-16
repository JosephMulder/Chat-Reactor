import React from 'react'
import { Button, FormGroup, InputGroup, FormControl } from 'react-bootstrap';

export default (props) => {
  return (
    <FormGroup className="new-message">
      <InputGroup >
        <InputGroup.Button>
          <Button onClick={props.postMessage} >Post!</Button>
        </InputGroup.Button>
        <FormControl onChange={props.handleChange} onSubmit={props.handleChange} onKeyPress={props.keyHandler} type='text' value={props.text}/>
      </InputGroup>
    </FormGroup>
  )
}