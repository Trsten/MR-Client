import React from "react";

function Progress(props) {
    return (
        <div className="ProgressBar">
            <div
                className="Progress"
                style={{ width: props.progress + "%" }}
            />
        </div>
    );

}

export default Progress;