import React from 'react';
import neutralCommentIcon from '../lib/icons/com-nuetral.png';
import highlyPosCommentIcon from '../lib/icons/com-highly-pos.png'
import posCommentIcon from '../lib/icons/com-pos.png'
import slightlyPosCommentIcon from '../lib/icons/com-slightly-pos.png'
import highlyNegCommentIcon from '../lib/icons/com-highly-neg.png'
import negCommentIcon from '../lib/icons/com-neg.png'
import slightlyNegCommentIcon from '../lib/icons/com-slightly-neg.png'

const Message = (props) => {

  const getMoodIcon = (score) => {
    let icon = neutralCommentIcon;
    if (score >= 8) {
      icon = highlyPosCommentIcon;
    } else if (score >= 4) {
      icon = posCommentIcon;
    } else if (score > 0) {
      icon = slightlyPosCommentIcon;
    } else if (score <= -8) {
      icon = highlyNegCommentIcon;
    } else if (score <= -4) {
      icon = negCommentIcon;
    } else if (score < 0) {
      icon = slightlyNegCommentIcon;
    }
    return icon;
  }

  return (
    <tr className="message-row">
      <td style={{width: 45}} className="user-icon">
        <img src={getMoodIcon(props.messageData.score)}/>
        {props.messageData.username}
      </td>
      <td className="message-text-box">{props.messageData.text}</td>
    </tr>
  )
}
// Need to add more information into messages array so that user name can be displayed here
export default Message; 