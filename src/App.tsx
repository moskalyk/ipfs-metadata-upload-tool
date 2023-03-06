import type { Component } from 'solid-js';
import {createSignal} from 'solid-js'

import styles from './App.module.css';

import { Web3Storage } from 'web3.storage'

import {Buffer} from 'buffer';

function getAccessToken () {
  return ""
}

function makeStorageClient () {
  return new Web3Storage({ token: getAccessToken() })
}

var csvFiles: any = {}

const App: Component = () => {
  const [link, setLink] = createSignal<any>('')
  const [uploadedCSV, setUploadedCSV] = createSignal<any>(false)
  const [uploadingFile, setUploadingFile] = createSignal<any>(false)

  async function storeFiles (files: any) {
    const client = makeStorageClient()
    const cid = await client.put(files)
    console.log('stored files with cid:', cid)
    setLink(`https://${cid}.ipfs.nftstorage.link`)
    setUploadingFile(false)
  }

  const handleFilesEvent = async (e: any) => {

    let uploadVerification = true;

    // check for mismatch in e.target.files
    if(Object.entries(csvFiles).length != e.target.files.length){
      alert('please make sure there is a 1-1 mapping between uploaded images and your csv')
      uploadVerification = false;
      return;
    }

    const cids: any = {}
    const csvArray = Object.entries(csvFiles)

    let i = 0;
    for (; i < e.target.files.length; i++){
      if(csvFiles[e.target.files[i].name] === undefined){
        console.log(e.target.files[i].name)
        alert('csv and file upload mismatch')
        uploadVerification = false
        return;
      }
    }

    if(i != csvArray.length) {
      alert('csv and file upload mismatch')
      uploadVerification = false
      return;
    }

    setUploadingFile(true)

    for (let i = 0; i < e.target.files.length; i++){
      const client = makeStorageClient()
      if(e.target.files[i].name.includes('.png') || e.target.files[i].name.includes('.jpg') || e.target.files[i].name.includes('.jpeg')){
        const cid = await client.put([e.target.files[i]])
        console.log('stored files with cid:', cid)
        cids[e.target.files[i].name] = `https://${cid}.ipfs.nftstorage.link/${e.target.files[i].name}`
      }else {
        alert('wrong file type, must be .png, jpeg, or jpg')
        uploadVerification = false
        return;
      }
      
    }

    const files = []

    for (let i = 0; i < csvArray.length; i++ ) {
      const obj = { 
        name: csvArray[i][0],
        description: csvArray[i][1],
        image: cids[csvArray[i][0]]
      }
      const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' })
      
      // if image is png / jpg
      if(csvArray[i][0].includes('.png')){
        files.push(new File([blob], csvArray[i][0].replace('.png', '.json')))
      } else if (csvArray[i][0].includes('.jpg')){
        files.push(new File([blob], csvArray[i][0].replace('.jpg', '.json')))
      } else if (csvArray[i][0].includes('.jpeg')){
        files.push(new File([blob], csvArray[i][0].replace('.jpeg', '.json')))
      } else {
        alert('wrong file type, must be .png, jpeg, or jpg')
        uploadVerification = false
      }
    }

    if(uploadVerification) storeFiles(files)

  }

  function upload(e: any) {
    var data = null;
    var file = e.target.files[0];
    var reader = new FileReader();
    var uploadVerification = true;
    reader.readAsText(file);
    reader.onload = function (event: any) {
        var csvData = event.target.result;
        csvData.split('\n').map((row: any) => {
          const rowSeperated = row.split(',')

          // check that csv doesn't contain commas, and 3 columns
          if(rowSeperated.length != 3) {
            alert('your csv must have 3 columns, and no commas')
            uploadVerification = false
            return
          }
          
          // check that each entry is filled out
          if(rowSeperated[1].length > 0 && rowSeperated[2].length > 0){
            csvFiles[rowSeperated[0]] = {
              name: rowSeperated[1],
              description: rowSeperated[2]
            }
          }
          else {
            alert('please fill in all cells in your csv')
            uploadVerification = false
            return;
          }
        })
      
        if(uploadVerification){
          setUploadedCSV(true)
          console.log(csvFiles)
        }
    }
}

  return (
    <div class={styles.App}>
      <br/>
      <br/>
      <img class="center" src="https://sequence.xyz/sequence-wordmark.svg" />
      <br/>
      <br/>
      <label for="upload" class="custom-file-upload">
        Upload CSV Metadata (fileName, name, description)
      </label>
      <input id="upload" type="file" onChange={upload}>upload csv</input>
      {
        uploadedCSV() 
        ? 
        <>
          <label for="fileUpload" class="custom-file-upload">
            Upload Metadata
          </label>
          <input id='fileUpload' type='file' multiple
                  accept='image/jpg image/jpeg image/png'
                  onChange={handleFilesEvent}
          />
        </>
        : 
          null
      }
      <br/>
      <br/>
      <br/>
      <br/>
      {link() != '' ? <a class="ipfs-link" href={link()} target="_blank">ipfs link</a> : uploadingFile() ? <p class='loading'>uploading...</p> : null }
      <br />
      <br />
    </div>
  );
};

export default App;