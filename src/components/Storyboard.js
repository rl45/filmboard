import React, {useState, useEffect} from 'react';
import {Redirect} from 'react-router-dom';
import StoryboardCell from "./StoryboardCell";

export default function Storyboard(props) {

    const init = [{fileUrl: '', title: '', description: ''}];
    const [items, setItems] = useState(init);

    useEffect(() => {
        if(props.storyboards && props.storyboards.length > 0) {
            setItems(props.storyboards);
        }
    }, [props.storyboards]);

    useEffect(() => {
        try {
            const els = document.querySelectorAll(`.storyboard .item`);
            if (els.length > 0) {
                const el = els[els.length - 1];
                el.querySelector(`.item-title`).focus();
                el.querySelector(`.item-title`).scrollIntoView();
            }
        }
        catch (e) {}
    }, [items]);

    const handleAddMore = () => {
        const t = Array.from(items);
        t.push({fileUrl: '', title: '', description: ''});
        setItems(t);
    }

    const renderItems = () =>
        items.map(item => <StoryboardCell key={item._id} item={item}/>);

    return (
        <div className="container storyboard">
            <div className="row mt-10 mb-10">
                <div className="col-6 col-sm-6 text-left">
                    <small style={{color: 'grey'}}>* Only items with valid title and file will be saved. Others will be skipped.</small>
                </div>
                <div className="col-6 col-sm-6 text-right">
                    <button className="btn btn-sm btn-outline-light m-1"
                            onClick={() => handleAddMore()}>Add Cell
                    </button>
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-sm-12">
                    {renderItems()}
                </div>
            </div>
        </div>
    );
}