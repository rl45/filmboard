import React, {useState} from 'react';
import config from "../config.json";

export default function ThumbnailAudio(props) {

    const [imgUrl, setImgUrl] = useState(`${config.appUrl}/images/default-audio.jpg`);

    const handlePlay = e => {
        e.preventDefault();
        props.setPlaying(props.item);
    }

    return (
        <img src={imgUrl} className="video-thumbnail" title="Click to play this audio." onClick={handlePlay} />
    );
}