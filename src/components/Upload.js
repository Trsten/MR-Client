import React, { useState} from "react";
import Dropzone from "./Dropzone";
import Progress from "./Progress";
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import doc from "../icons/doc.svg";
import jpg from "../icons/jpg.svg";
import pdf from "../icons/pdf.svg";
import png from "../icons/png.svg";
import txt from "../icons/txt.svg";
import file from "../icons/file.svg";
import { makeStyles } from '@material-ui/core/styles';
import Zoom from '@material-ui/core/Zoom';
import Typography from '@material-ui/core/Typography';

function FILE() {
  return (
    <Icon >
      <img style={{ height: '100%', marginBottom: "12px"}} src={file} alt='' />
    </Icon>
  )
}

function DOC() {
  return (
    <Icon >
      <img style={{ height: '100%', marginBottom: "12px"}} src={doc} alt='' />
    </Icon>
  )
}

function JPG() {
  return (
    <Icon >
      <img style={{ height: '100%', marginBottom: "12px" }} src={jpg} alt='' />
    </Icon>
  )
}

function PDF() {
  return (
    <Icon >
      <img style={{ height: '100%', marginBottom: "12px" }} src={pdf} alt='' />
    </Icon>
  )
}

function PNG() {
  return (
    <Icon >
      <img style={{ height: '100%', marginBottom: "12px" }} src={png} alt='' />
    </Icon>
  )
}

function TXT() {
  return (
    <Icon >
      <img style={{ height: '100%', marginBottom: "12px" }} src={txt} alt='' />
    </Icon>
  )
}

const getAvatar = (fileName) => {
  let suffix = fileName.substring(fileName.indexOf('.') + 1,fileName.length)
    switch (suffix) {
      case 'png': return <PNG />
      case 'jpg': return <JPG />
      case 'txt': return <TXT />
      case 'pdf': return <PDF />
      case 'docx': return <DOC />
      case 'doc': return <DOC />
      default:
        return <FILE />;
    }
}

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: '10px',
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      marginLeft: theme.spacing(1,5),
    },
  },
}));

function Upload({ files, successfullUploaded, handleDelete,...props }) {

  const classes = useStyles();
  const [ fileUpload, setFileUpload ] = useState(props.fileAdded)
  const [ removeDialog, setRemoveDialog ] = useState({open: false, file: ''})

  const renderProgress = () => {
    if (props.uploading ) {
      return (
        <div className="ProgressWrapper">
          <PDF />;
          <Progress progress={props.uploadProgress} />
        </div>
      );
    }
  }

  const onFileChange = ( file ) => {
    setFileUpload(file);
    props.onFileAdded(file);
  }

  const onClickDownload = (file) => {
    props.downloadFile(file)
  }

  const onDelete = ( file ) => {
    setRemoveDialog({open: true, file: file})
  }

  const handleCloseRemoveDialog = () => {
    setRemoveDialog({open: false, file: null})
  }

  const handleRemoveDialog = () => {
    props.deleteFile(removeDialog.file)
    handleCloseRemoveDialog();
  }

  return (
    <div className="Upload">
       <Dialog open={removeDialog.open} onClose={handleCloseRemoveDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Remeve File !</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want remove file {removeDialog.name} ?
          </DialogContentText>             
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRemoveDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRemoveDialog} color="primary">
            Remove
          </Button>
        </DialogActions>
      </Dialog>
      <div className="Content">
        <div className="Files">
          {files.map( (file, index) => {
            return (
              <div key={file.name} className="Row">
              {/* <Progress progress={80} ></Progress>  */}
                <Chip
                  className={classes.root}
                  size="medium"
                  label={file.name}
                  icon={getAvatar(file.name)}
                  onDelete={props.editable ? () => onDelete(file) : null }
                  onClick={() => onClickDownload(file)}
                />
                { props.uploading && index === (files.length - 1) ? renderProgress(fileUpload) :  "" } 
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <div className="Content">
          { props.editable ? <Zoom in={props.editable}>
            <Typography  variant="h6">
            <Dropzone
              onFilesAdded={ props.uploading ? null : onFileChange }
              disabled={false || false}
            />
            </Typography>
          </Zoom> : '' }
          </div>
        </div>
    </div>
  );
}

export { Upload, getAvatar };