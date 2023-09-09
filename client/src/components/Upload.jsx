import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import  app  from "../firebase";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #000000a7;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Wrapper = styled.div`
    width: 600px;
    height: 600px;
    background-color: ${({ theme }) => theme.bgLighter};
    color: ${({ theme }) => theme.text};
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
`;

const Close = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
`;

const Title = styled.h1`

`;

const Input = styled.input`
    border: 1px solid ${({ theme }) => theme.text};
    color: ${({ theme }) => theme.text};
    border-radius: 3px;
    padding: 10px;
    background-color: transparent;
`;

const Desc = styled.textarea`
    border: 1px solid ${({ theme }) => theme.text};
    color: ${({ theme }) => theme.text};
    border-radius: 3px;
    padding: 10px;
    background-color: transparent;
`;

const Button = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 3px;
    font-weight: 500;
    cursor: pointer;
    background-color: ${({ theme }) => theme.soft};
    color: ${({ theme }) => theme.textSoft};
`;

const Label = styled.label`
    font-size: 14px;
`;

function Upload({setOpen}) {
    const [img, setImg] = useState(undefined);
    const [video, setVideo] = useState(undefined);
    const [imgPerc, setImgPerc] = useState(0);
    const [videoPerc, setVideoPerc] = useState(0);
    const [title, setTitle] = useState('');
    const [input,setInput] = useState({});
    const [desc, setDesc] = useState('');
    const [tags, setTags] = useState([]);

    const navigate = useNavigate();

    const handleTags = (e) =>{
        setTags(e.target.value.split(','));
    }

    const handleChange = (e) =>{
        setInput((prev)=>{
            return {...prev,[e.target.name]:e.target.value}
        });
    } 

    const uploadFile = (file, urlType)=>{
        const storage = getStorage(app);
        const fileName = new Date().getTime()+file.name;
        const storageRef = ref(storage,fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            urlType === 'imgUrl' ? setImgPerc(progress) : setVideoPerc(progress);
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
              default:
                break;
            }
          }, 
          (error) => {},
          () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log('File available at', downloadURL);
              setInput((prev)=>{
                return {...prev,[urlType]:downloadURL}
            });
            });
          }
        )
        
    }

    useEffect(()=>{
        video && uploadFile(video,'videoUrl');
    },[video]);
    useEffect(()=>{
        img && uploadFile(img,'imgUrl');
    },[img]);

    const handleUpload = async (e)=>{
        e.preventDefault();
        const res = await axios.post("/videos",{...input,tags});
        setOpen(false);
        res.status===200 && navigate(`/video/${res.data._id}`);

    }
  return (
    <Container>
        <Wrapper>
            <Close onClick={()=>setOpen(false)}>X</Close>
            <Title>Upload a New Video</Title>
            <Label>Video:</Label>
            {videoPerc>0 ? ("Uploading: "+ videoPerc.toFixed(2) + "%") :
            <Input type='file' accept='video/*' onChange={e=>setVideo(e.target.files[0])}/>}
            <Input name='title' type='text' placeholder='Title' onChange={handleChange}/>
            <Desc name='desc' placeholder='Description' rows={8} onChange={handleChange}/>
            <Input type='text' placeholder='Seperate the tags with commas.' onChange={handleTags}/>
            <Label>Image:</Label>
            {imgPerc>0 ? ("Uploading: "+ imgPerc.toFixed(2) + "%")
            : <Input type='file' placeholder='image/*' onChange={e=>setImg(e.target.files[0])}/>}
            <Button onClick={handleUpload}>Upload</Button>
        </Wrapper>
    </Container>
  )
}

export default Upload
