import React from 'react';

export default function StoryboardViewCell(props) {
    return (
        <div className="storyboard-view-cell text-left">
            <img className="img-fluid storyboard-view-img" src={props.story.fileUrl}/>
            <p className="story-title">{props.story.title}</p>
            <span className="story-description">{props.story.description}</span>
            <span className="story-description">{props.story.shot}&nbsp;{props.story.angle}&nbsp;{props.story.movement}&nbsp;{props.story.audio} </span>
        </div>
    );
}