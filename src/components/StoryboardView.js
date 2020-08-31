import React, {useState, useEffect} from 'react';
import session from '../services/session';
import {
    swalError,
    swalSuccess,
    swalRemoveLike
} from "../utils/swal";
import likeService from "../services/like";
import dislikeService from "../services/dislike";
import storyboardService from "../services/storyboard";
import StoryboardViewCell from './StoryboardViewCell';
import '../css/storyboard-view.css';
import Comment from "./Comment";
import CommentBox from "./CommentBox";
import commentService from "../services/comment";

export default function StoryboardView(props) {

    const [loginOrSignup, setLoginOrSignup] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentToUpdate, setCommentToUpdate] = useState({});
    const [playingVideoData, setPlayingVideoData] = useState(null);

    useEffect(() => {
        (async () => {
            reloadVideoData();
            reloadComments();
        })();
    }, []);

    const renderStoryCells = () => {
        if(props.storyboards) {
            if(props.storyboards.length > 0) {
                return props.storyboards.map(x => <StoryboardViewCell key={x._id} story={x}/>);
            }
            else {
                return <div className="not-found">No storyboards found.</div>;
            }
        }
        else {
            return <div className="not-found">No storyboards found.</div>;
        }
    }

    const reloadComments = async () => {
        const projectId = window.location.href.split('/').pop();
        await commentService.getByStoryboard(projectId)
            .then(result => {
                if (result.error) {
                    swalError(result.error);
                    return;
                }

                setComments(result.data);
            });
    }

    const reloadVideoData = async () => {
        const projectId = window.location.href.split('/').pop();
        await storyboardService.getStats(projectId)
            .then(result => {
                if (result.error) {
                    swalError(result.error);
                    return;
                }

                setPlayingVideoData(result.data);
            });
    }

    const renderComments = () =>
        comments.length > 0 ? comments.map(comment =>
            <CommentBox
                key={comment._id}
                comment={comment}
                reloadComments={reloadComments}
                setCommentToUpdate={obj => setCommentToUpdate(obj)}
            />) : `No comments found.`;

    const handleLike = async e => {
        e.preventDefault();

        if (!session.get('user') || !session.get('user')._id) {
            setLoginOrSignup(true);
            return;
        }

        const type = `storyboard`;
        const moodboardId = null;
        const projectId = window.location.href.split('/').pop();
        await likeService.check(type, moodboardId, projectId)
            .then(async result => {
                if (result.error) {
                    swalError(result.error);
                    return;
                }

                if (result.data.length > 0) {
                    swalRemoveLike(`You already have Liked this Storyboard. Do you want to remove your like?`, async () => {
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
                    await dislikeService.check(type, moodboardId, projectId)
                        .then(async result => {
                            if (result.error) {
                                swalError(result.error);
                                return;
                            }

                            if (result.data.length > 0) {
                                swalRemoveLike(`You already have Disliked this Storyboard. Do you want to remove your dislike and like it instead?`, async () => {
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

        const type = `storyboard`;
        const moodboardId = null;
        const projectId = window.location.href.split('/').pop();
        await dislikeService.check(type, moodboardId, projectId).then(async result => {
            if (result.error) {
                swalError(result.error);
                return;
            }

            if (result.data.length > 0) {
                swalRemoveLike(`You already have Disliked this Storyboard. Do you want to remove your Dislike?`, async () => {
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
                        swalRemoveLike(`You already have Liked this Storyboard. Do you want to remove your like and dislike it instead?`, async () => {
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

    return (
        <div className="container-fluid">
            <div className="row mt-10">
                <div className="col-9 col-sm-9 text-left">
                    {renderStoryCells()}
                </div>
                <div className="col-3 col-sm-3 col-md-3 text-left comments-column">
                    <p className="m-2 text-right">
                        <span className="badge badge-pill badge-light badge-like m-1" onClick={handleLike}
                              title="Like this Storyboard">
                        <i className="fa fa-thumbs-up fa-bigger"></i> {playingVideoData && playingVideoData.likes || 0}</span>
                        <span className="badge badge-pill badge-light badge-like m-1" onClick={handleDislike}
                              title="Dislike this Storyboard">
                        <i className="fa fa-thumbs-down fa-bigger"></i> {playingVideoData && playingVideoData.dislikes || 0}</span>
                        <span className="badge badge-pill badge-light badge-like m-1"
                              title="Comments count this Storyboard">
                        <i className="fa fa-comment fa-bigger"></i> {comments && comments.length || 0}</span>
                    </p>
                    <Comment
                        reloadComments={reloadComments}
                        playingItemId={null}
                        setLoginOrSignup={() => setLoginOrSignup(true)}
                        comment={commentToUpdate}
                        type="storyboard" />
                    {renderComments()}
                </div>
            </div>
        </div>
    );
}