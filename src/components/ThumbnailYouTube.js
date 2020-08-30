import React, {useState, useEffect} from 'react';
import config from "../config.json";

export default function ThumbnailYouTube(props) {
    const [id, setId] = useState('');

    useEffect(() => {
        try {
            const url = new URL(props.item.fileUrl);
            const id = url.searchParams.get('v');
            setId(`http://img.youtube.com/vi/${id}/maxresdefault.jpg`);//maxres1.jpg
        }
        catch (err) {
            setId(`${config.appUrl}/images/default-video.png`);
        }
    }, []);

    const handlePlay = e => {
        e.preventDefault();
        props.setPlaying(props.item);
    }

    return (
        <img src={id} className="video-thumbnail" title="Click to play this video." onClick={handlePlay} />
    );
}