import React, {useState, useEffect} from 'react';
import config from "../config.json";
import axios from 'axios';

export default function ThumbnailVimeo(props) {

    const [imgUrl, setImgUrl] = useState(`${config.appUrl}/images/default-video.png`);

    useEffect(() => {
        const id = props.item.fileUrl.split('/').pop();
        (async () => {
            await axios.get(`http://vimeo.com/api/v2/video/${id}.json`)
                .then(resp => {
                    if (resp.status === 200) {
                        const data = resp.data;
                        setImgUrl(data[0].thumbnail_large);
                    }
                });
        })();
    }, []);

    const handlePlay = e => {
        e.preventDefault();
        props.setPlaying(props.item);
    }

    return (
        <img src={imgUrl} className="video-thumbnail" title="Click to play this video." onClick={handlePlay} />
    );
}