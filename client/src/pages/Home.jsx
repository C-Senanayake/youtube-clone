import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Card from "../components/Card";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Home = ({trend}) => {
  const [videos,setVIdeos] = useState([]);
  useEffect(()=>{
    axios.get(`/videos/${trend}`)
    .then((res)=>{
      setVIdeos(res.data);
    })
    .catch((err)=>{
      console.log(err);
    })
  },[trend])
  return (
    <Container>
      {videos.map(video=>(
        <Card key={video._id} video={video}/>
      ))}
    </Container>
  );
};

export default Home;
