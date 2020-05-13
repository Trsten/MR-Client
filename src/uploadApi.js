import axios from "axios"

const FILE_URL = 'http://localhost:9080/mrreport/file';
const FILE_DELETE_URL = FILE_URL + "/delete/entity";
const FILE_UPLOAD_URL = FILE_URL + "/upload";
const FILE_DELETE_TMP_FOLDER_URL = FILE_URL + "/delete/";
const FILE_DOWNLOAD_URL = FILE_URL + "/download";
const FILE_INFO_URL = FILE_URL + "/info";

const fileDelete = (formData) =>
    axios.post(FILE_DELETE_URL, formData)
        .then(result => ({ result }))
        .catch(error => ({ error }))

const fileUpload = (formData, config) =>
    axios.post(FILE_UPLOAD_URL, formData, config)
        .then(result => ({ result }))
        .catch(error => ({error}))

const fileDownload = (formData, config) =>
    axios.post(FILE_DOWNLOAD_URL, formData, config)
        .then(result => {
            const file = JSON.parse(result.config.data).fileDataList[0];

            let suffix = file.name.substring(file.name.indexOf('.') + 1,file.name.length)
            if ( suffix === 'pdf' ) {
                //open new tab with PDF
                const file2 = new Blob(
                    [result.data], 
                    {type: 'application/pdf'});
                const fileURL = URL.createObjectURL(file2);
                window.open(fileURL);
            } else {
                //download         
                const url = window.URL.createObjectURL(new Blob([result.data]));
                const link = document.createElement('a');
                link.href = url;
                link.download = file.name; 
                document.body.appendChild(link);
                link.click();
    
            }            
        })
        .catch(error => ({error}))

const getFilesInfo = (formData) => 
    axios.post(FILE_INFO_URL, formData)
    .then(result => ({ result }))
    .catch(error => ({ error }))

export {
    fileDelete,
    fileUpload,
    fileDownload,
    getFilesInfo
};
