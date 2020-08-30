import React, {useState, useEffect} from 'react';
import config from "../config.json";

export default function ThumbnailImage(props) {

    const [imgUrl, setImgUrl] = useState(`${config.appUrl}/images/default-image.jpg`);

    useEffect(() => {
        setImgUrl(props.item.fileUrl);
    }, []);

    const handlePlay = e => {
        e.preventDefault();
        props.setPlaying(props.item);
    }

    return (
        <img src={imgUrl} className="video-thumbnail" title="Click to see this image." onClick={handlePlay} />
    );
}