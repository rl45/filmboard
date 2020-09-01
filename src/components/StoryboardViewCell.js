import React from 'react';

export default function StoryboardViewCell(props) {
    return (
        <div className="storyboard-view-cell">
            <img className="storyboard-view-img" src={props.story.fileUrl}/>
            <p className="story-title">{props.story.title}</p>
            <span className="story-description">{props.story.description}</span>
            {/*<a data-toggle="collapse" href={`#cell${props.story._id}`} aria-expanded="false"*/}
            {/*   aria-controls={`cell${props.story._id}`}>*/}
            {/*    Description*/}
            {/*</a>*/}
            {/*<div className="collapse" id={`cell${props.story._id}`}>*/}
            {/*    <span className="story-description">{props.story.description}</span>*/}
            {/*</div>*/}
        </div>
    );
}