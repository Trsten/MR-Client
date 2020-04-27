import React, { useState } from "react";
import ConfirmDialog from "./ConfirmationDialog"
import { Upload } from "./Upload";
import { fileUpload, fileDelete } from "../uploadApi";

function UploadWrapper({ open, handleClose, formFiles, storageData, onChange, onDelete, onConfirm }) {
    const [files, setFiles] = useState(formFiles)
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState({})
    const [successfullUploaded, setSuccessfullUploaded] = useState(false)
    const entityStorageData = storageData

    const onFilesAdded = (newFiles) => {
        setFiles([...files, ...newFiles])
        uploadFiles(newFiles)
        onChange(newFiles)
    }

    const uploadFiles = async (newFiles) => {
        setUploadProgress({})
        setUploading(true)
        const promises = [];
        newFiles.forEach((file, index) => {
            const config = requestConfing(file)
            promises.push(sendRequest(file, index, config));
        });
        try {
            await Promise.all(promises);
            console.log("done vsetky")
            setSuccessfullUploaded(true)
            setUploading(false)
        } catch (e) {
            // Not Production ready! Do some error handling here instead...
        }
    }

    const requestConfing = (file) => {
        return {
            onUploadProgress: function (progressEvent) {
                var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                setUploadProgress(prevState => ({
                    ...prevState, [file.name]: {
                        state: percentCompleted === 100 ? "done" : "pending",
                        percentage: percentCompleted
                    }
                }))
            },
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
    }

    const sendRequest = async (file, index, config) => {
        const formData = new FormData();
        const entityFileData = {
            index: index,
            name: file.name,
            size: file.size,
            uploaded: null
        }
        entityStorageData.fileDataList = [entityFileData]
        formData.append('entityStorageData', JSON.stringify(entityStorageData))
        formData.append('file', file)

        return await fileUpload(formData, config);
    }

    const handleDelete = async (deletedFile) => {
        setFiles(files.filter(file => file !== deletedFile))
        onDelete(deletedFile)
        const entityFileData = {
            name: deletedFile.name,
            size: deletedFile.size,
            uploaded: null
        }
        entityStorageData.fileDataList = [entityFileData]
        await fileDelete(entityStorageData)
    }
    return (
        <ConfirmDialog
            open={open}
            handleClose={handleClose}
            onClick={() => { onConfirm(); handleClose() }}
            dialogTexts={{ title: "Attach file", button: "Ok" }}
            render={() => (
                    <Upload
                    files={files}
                    onFilesAdded={onFilesAdded}
                    uploading={uploading}
                    uploadProgress={uploadProgress}
                    successfullUploaded={successfullUploaded}
                    handleDelete={handleDelete}
                />               
            )}
        />
     )
}
export default UploadWrapper