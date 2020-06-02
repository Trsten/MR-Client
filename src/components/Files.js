import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { Upload } from "./Upload";
import { fileUpload, fileDownload,fileDelete } from "../uploadApi";

function Files(props) {

//    const [file, setFile] = useState('');
    const [ uploading, setUploading ] = useState(false);
    const [ uploadProgress, setUploadProgress ] = useState({});
    const entityStorageData = {
        entityId: props.index,
        entityDate: new Date().toISOString().substr(0,10),
        directory: undefined,
        fileDataList: undefined
    };

    const uploadFiles = async (newFiles) => {
        setUploadProgress(0)
        setUploading(true)
        const promises = [];
        newFiles.forEach((file, index) => {
            const config = requestConfing(file)
            promises.push(sendRequest(file, index, config));
        });
        try {
            await Promise.all(promises);
            console.log("done vsetky")
            setUploading(false)
        } catch (e) {
            
        }
        const addFile = { 
            index: props.infoFiles.length-1,
            name: normalizeString(newFiles[0].name),
            size: newFiles[0].size,
            uploaded: true
        }
        props.updateFiles([...props.infoFiles,addFile]);
    }

    const requestConfing = (file) => {
        return {
            onUploadProgress: function (progressEvent) {
                var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                setUploadProgress(percentCompleted);
            },
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
    }

    const downloadFile = async ( file ) => {
        const promises = [];
            promises.push(sendDownloadRequest(file, file.index));
        try {
            await Promise.all(promises);
            console.log("done download")
        } catch (e) {
        }
    };

    const sendDownloadRequest = async (file, index) => {
        const entityStorageData = {
            entityId: props.index,
            entityDate: new Date().toISOString().substring(0,10),
            directory: "",
            fileDataList: []};
        
        const entityFileData = {
            index: index,
            name: file.name,
            size: file.size,
            uploaded: false
        }
        entityStorageData.fileDataList = [entityFileData]
        const config = {responseType: 'blob', headers: {
            'content-type': 'application/json'
        }}
        return await fileDownload( entityStorageData , config );
    };

    const sendRequest = async (file, index, config) => {

        const formData = new FormData();
        const entityFileData = {
            index: index,
            name: normalizeString(file.name),
            size: file.size,
            uploaded: null
        }
        entityStorageData.fileDataList = [entityFileData]
        formData.append('entityStorageData', JSON.stringify(entityStorageData))
        formData.append('file', file)

        return await fileUpload(formData, config);
    }

    const deleteFile = async (deletedFile) => {
        props.updateFiles(props.infoFiles.filter(file => file !== deletedFile))
        entityStorageData.fileDataList = [deletedFile]
        await fileDelete(entityStorageData)
    }

    const uploadFile = (file) => {
        let newFile = new File([file[0]], `${normalizeString(file[0].name)}`, { type: file[0].type });
        uploadFiles([newFile]);
    }

    const normalizeString = ( text ) => {
            var accents    = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽžŤť';
            var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZzTt";
            var str = text.split('');
            var strLen = str.length;
            var i, x;
            for (i = 0; i < strLen; i++) {
              if ((x = accents.indexOf(str[i])) != -1) {
                str[i] = accentsOut[x];
              }
            }
            return str.join('');
    } 

  return (
    <div >
        { props.infoFiles ? <Upload 
            files={props.infoFiles} 
            onFileAdded={uploadFile}
            uploading={uploading}
            uploadProgress={uploadProgress}
            downloadFile={downloadFile}
            deleteFile={deleteFile}
            editable={props.editable}
            ></Upload> : "" }
    </div>
  );
}

export default Files;