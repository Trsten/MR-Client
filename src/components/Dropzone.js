import React, { useState} from "react";
import CloudUpload from "@material-ui/icons/CloudUploadOutlined";

function Dropzone(props) {
  const [hightlight, setHighLight] = useState(false)
  var fileInputRef = React.createRef();

  const openFileDialog = () => {
    if (props.disabled) return;
    fileInputRef.current.click();
  }

  const onFilesAdded = (evt) => {
    if (props.disabled) return;
    const files = evt.target.files;
    if (props.onFilesAdded) {
      const array = fileListToArray(files);
      props.onFilesAdded(array);
    }
  }

  const onDragOver = (event) => {
    event.preventDefault();
    if (props.disabed) return;
    setHighLight(true);
  }

  const onDragLeave = (event) => {
    setHighLight(false);
  }

  const onDrop = (event) => {
    event.preventDefault();
    if (props.disabed) return;
    const files = event.dataTransfer.files;
    if (props.onFilesAdded) {
      const array = fileListToArray(files);
      props.onFilesAdded(array);
    }
    setHighLight(true);
  }

  const fileListToArray = (list) => {
    const array = [];
    for (var i = 0; i < list.length; i++) {
      array.push(list.item(i));
    }
    return array;
  }

  return (
    <div
      className={`Dropzone ${hightlight ? "Highlight" : ""}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={openFileDialog}
      style={{ cursor: props.disabled ? "default" : "pointer" }}
    >
      <input
        ref={fileInputRef}
        className="hidden"
        type="file"
        multiple
        onChange={onFilesAdded}
      />
      <CloudUpload style={{ fontSize: 50, opacity: .5 }}/>
      <span>Upload Files</span>
    </div>
  );
}

export default Dropzone;