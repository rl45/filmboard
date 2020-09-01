import React, {useState, useEffect} from 'react';
import session from '../services/session';
import config from "../config.json";
import {
    swalDeleteForm,
    swalError,
    swalSuccess,
    swalRemoveLike,
    swalShare
} from "../utils/swal";
import likeService from "../services/like";
import dislikeService from "../services/dislike";
import moodboardService from '../services/moodboard';
import Comment from "./Comment";
import projectService from "../services/project";
import ThumbnailVimeo from "./ThumbnailVimeo";
import ThumbnailYouTube from "./ThumbnailYouTube";
import ThumbnailAudio from './ThumbnailAudio';
import ThumbnailImage from './ThumbnailImage';
import commentService from "../services/comment";
import CommentBox from "./CommentBox";

export default function MoodboardView(props) {
    const [redirectTo, setRedirectTo] = useState(null);
    const [loginOrSignup, setLoginOrSignup] = useState(false);
    const [project, setProject] = useState(null);
    const [projectId, setProjectId] = useState(null);
    const [playingUrl, setPlayingUrl] = useState(null);
    const [playingItem, setPlayingItem] = useState(null);
    const [playingVideoData, setPlayingVideoData] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentToUpdate, setCommentToUpdate] = useState({});

    useEffect(() => {
        (async () => {
            reloadProject();
        })();
    }, []);

    useEffect(() => {
        (async () => {
            reloadVideoData();
            reloadComments();
        })();
    }, [playingItem]);

    const reloadProject = async () => {
        let id = window.location.href.split('/').pop();
        setProjectId(id);
        await projectService.get(id)
            .then(result => {
                if (result.error) {
                    swalError(result.error);
                    return;
                }

                if (result.data.length === 1) {
                    setProject(result.data[0]);
                    if (document.querySelector(`.video-thumbnail`) !== null) {
                        document.querySelector(`.video-thumbnail`).click();
                    }
                }
            });
    }

    const reloadVideoData = async () => {
        if (playingItem && playingItem._id) {
            await moodboardService.getStats(playingItem._id)
                .then(result => {
                    if (result.error) {
                        swalError(result.error);
                        return;
                    }

                    if (result.data.length === 1) {
                        setPlayingVideoData(result.data[0]);
                    }
                });
        }
    }

    const handleEdit = e => setRedirectTo(`/project/${project._id}`);

    const handleDelete = e => {
        e.preventDefault();
        swalDeleteForm(async () => {
            await projectService.delete(project._id).then(result => {
                if (result.error) {
                    swalError(result.error);
                    return;
                }

                swalSuccess('Project deleted successfully!');
                setRedirectTo('/');
            });
        });
    }

    const handleShare = e => swalShare(`${config.appUrl}/projects/${project._id}`);

    const renderThumbnails = () => {
        if (props.moodboards) {
            if (props.moodboards.length > 0) {
                return props.moodboards.map(item => {
                    if (item.type === 'video') {
                        return item.fileUrl.includes('vimeo') ?
                            <ThumbnailVimeo key={item._id} item={item} setPlaying={setPlaying}/>
                            : <ThumbnailYouTube key={item._id} item={item} setPlaying={setPlaying}/>;
                    } else if (item.type === 'audio') {
                        return <ThumbnailAudio key={item._id} item={item} setPlaying={setPlaying}/>
                    } else if (item.type === 'image') {
                        return <ThumbnailImage key={item._id} item={item} setPlaying={setPlaying}/>
                    }
                });
            } else {
                return <div className="not-found">No moodboards found.</div>;
            }
        } else {
            return <div className="not-found">No moodboards found.</div>;
        }
    }

    const setPlaying = item => {
        if (item.type === 'video') {
            if (item.fileUrl.includes('vimeo')) {
                const id = item.fileUrl.split('/').pop();
                setPlayingUrl(`https://player.vimeo.com/video/${id}`);
                setPlayingItem(item);
            } else {
                const id = new URL(item.fileUrl).searchParams.get('v');
                setPlayingUrl(`https://www.youtube.com/embed/${id}`);
                setPlayingItem(item);
            }
        } else {
            setPlayingUrl(item.fileUrl);
            setPlayingItem(item);
        }
    }

    const renderDisplaying = () => {
        if (playingUrl) {
            const type = playingItem.type;
            if (type === 'video') {
                return <iframe id="player" className="player" src={playingUrl} frameBorder="0"
                               allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                               allowFullScreen></iframe>
            } else if (type === 'audio') {
                return <div style={{margin: '20px'}}>
                    <audio controls="controls" className="audio-player" src={playingUrl}></audio>
                </div>
            } else if (type === 'image') {
                return <img className="player" src={playingUrl}/>
            }
        }
    }

    const handleLike = async e => {
        e.preventDefault();

        if (!session.get('user') || !session.get('user')._id) {
            setLoginOrSignup(true);
            return;
        }

        const type = document.querySelector(`.nav-link.active`).text.toLowerCase();
        const moodboardId = type === 'moodboard' ? playingItem._id : null;
        const projectId = window.location.href.split('/').pop();
        await likeService.check(type, moodboardId, projectId).then(async result => {
            if (result.error) {
                swalError(result.error);
                return;
            }

            if (result.data.length > 0) {
                swalRemoveLike(`You already have Liked this Moodboard. Do you want to remove your like?`, async () => {
                    await likeService.delete(type, moodboardId, projectId).then(result => {
                        if (result.error) {
                            swalError(result.error);
                            return;
                        }

                        swalSuccess('Your like is removed successfully!');
                        reloadVideoData();
                    });
                });
            } else {
                await dislikeService.check(type, moodboardId, projectId).then(async result => {
                    if (result.error) {
                        swalError(result.error);
                        return;
                    }

                    if (result.data.length > 0) {
                        swalRemoveLike(`You already have Disliked this Moodboard. Do you want to remove your dislike and like it instead?`, async () => {
                            await dislikeService.delete(type, moodboardId, projectId).then(async result => {
                                if (result.error) {
                                    swalError(result.error);
                                    return;
                                }

                                await likeService.add(type, moodboardId, projectId).then(result => {
                                    if (result.error) {
                                        swalError(result.error);
                                        return;
                                    }

                                    reloadVideoData();
                                });
                            });
                        });
                    } else {
                        await likeService.add(type, moodboardId, projectId).then(result => {
                            if (result.error) {
                                swalError(result.error);
                                return;
                            }

                            reloadVideoData();
                        });
                    }
                });
            }
        });
    }

    const handleDislike = async e => {
        e.preventDefault();

        if (!session.get('user') || !session.get('user')._id) {
            setLoginOrSignup(true);
            return;
        }
        const type = document.querySelector(`.nav-link.active`).text.toLowerCase();
        const moodboardId = type === 'moodboard' ? playingItem._id : null;
        const projectId = window.location.href.split('/').pop();
        await dislikeService.check(type, moodboardId, projectId).then(async result => {
            if (result.error) {
                swalError(result.error);
                return;
            }

            if (result.data.length > 0) {
                swalRemoveLike(`You already have Disliked this Moodboard. Do you want to remove your Dislike?`, async () => {
                    await dislikeService.delete(type, moodboardId, projectId).then(result => {
                        if (result.error) {
                            swalError(result.error);
                            return;
                        }

                        swalSuccess('Your dislike is removed successfully!');
                        reloadVideoData();
                    });
                });
            } else {
                await likeService.check(type, moodboardId, projectId).then(async result => {
                    if (result.error) {
                        swalError(result.error);
                        return;
                    }

                    if (result.data.length > 0) {
                        swalRemoveLike(`You already have Liked this Moodboard. Do you want to remove your like and dislike it instead?`, async () => {
                            await likeService.delete(type, moodboardId, projectId).then(async result => {
                                if (result.error) {
                                    swalError(result.error);
                                    return;
                                }
                                await dislikeService.add(type, moodboardId, projectId).then(result => {
                                    if (result.error) {
                                        swalError(result.error);
                                        return;
                                    }
                                    reloadVideoData();
                                });
                            });
                        });
                    } else {
                        await dislikeService.add(type, moodboardId, projectId).then(result => {
                            if (result.error) {
                                swalError(result.error);
                                return;
                            }
                            reloadVideoData();
                        });
                    }
                });
            }
        });
    }

    const reloadComments = async () => {
        if (playingItem && playingItem._id) {
            await commentService.getByMoodboard(playingItem._id)
                .then(result => {
                    if (result.error) {
                        swalError(result.error);
                        return;
                    }

                    setComments(result.data);
                });
        }
    }

    const renderComments = () =>
        comments.length > 0 ? comments.map(comment =>
            <CommentBox
                key={comment._id}
                comment={comment}
                reloadComments={reloadComments}
                setCommentToUpdate={obj => setCommentToUpdate(obj)}
            />) : `No comments found.`;

    return (
        <div className="container-fluid text-center mt-10">
            <div className="row">
                <div className="col-2 col-sm-2 col-md-2 text-center">
                    {renderThumbnails()}
                </div>
                {
                    playingItem &&
                    <div className="col-7 col-sm-7 col-md-7 text-left">
                        {renderDisplaying()}
                        <p className="h4 m-2 text-left">{playingItem && playingItem.title || ``}</p>
                        <p className="m-2 text-right">
                            <span className="badge badge-pill badge-light badge-like m-1" onClick={handleLike}
                                  title="Like this Moodboard">
                            <i className="fa fa-thumbs-up fa-bigger"></i> {playingVideoData && playingVideoData.likes || 0}</span>
                            <span className="badge badge-pill badge-light badge-like m-1" onClick={handleDislike}
                                  title="Dislike this Moodboard">
                            <i className="fa fa-thumbs-down fa-bigger"></i> {playingVideoData && playingVideoData.dislikes || 0}</span>
                            <span className="badge badge-pill badge-light badge-like m-1"
                                  title="Comments count this Moodboard">
                            <i className="fa fa-comment fa-bigger"></i> {comments && comments.length || 0}</span>
                        </p>
                        <p className="m-2">{playingItem && playingItem.description || ``}</p>
                    </div>
                }
                <div className="col-3 col-sm-3 col-md-3 text-left comments-column">
                    {
                        playingItem &&
                        <Comment
                            reloadComments={reloadComments}
                            playingItemId={playingItem && playingItem._id || null}
                            setLoginOrSignup={() => setLoginOrSignup(true)}
                            comment={commentToUpdate}
                            type="moodboard"/>
                    }
                    {playingItem && renderComments()}
                </div>
            </div>
        </div>
    );
}