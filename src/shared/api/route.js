const axios = require('axios');
import AsyncStorage from '@react-native-async-storage/async-storage';
const BASE_URL = 'https://calling-nodejs.onrender.com';
export const OnLogin = async (userName,password) => {
    //login to server and get token and store token in async storage
    try {
        console.log(userName,BASE_URL);
        //call api using fetch method
        const response = await fetch(`${BASE_URL}/users/login`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                userName,
                password
            })
        });
        const responseJson = await response.json();
        console.log(responseJson);
        const {token,user} = responseJson.data;
    //     // store token in async storage
        await AsyncStorage.setItem('token',token);
        await AsyncStorage.setItem('user',JSON.stringify(user));
        return token;    
    } catch (error) {
        console.log("error",error);
    }
    
    };

export const GetUsers = async token => {
    //get all users from server
    try {
        const response = await fetch(`${BASE_URL}/users/user-list`,{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            }
        });
        const responseJson = await response.json();
        console.log(responseJson);
        return responseJson.data;
    } catch (error) {
        console.log("error",error);
    }
}

export const GetCallToken = async (token) => {
    //get call token from server
    try {
        const response = await fetch(`${BASE_URL}/call/tokens`,{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            }
        });
        const responseJson = await response.json();
        console.log(responseJson);
        return responseJson.data;
    } catch (error) {
        console.log("error",error);
    }
}

export const createMeeting = async (token) => {
    try {
        const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
            method: 'POST',
            headers: {
              authorization: token,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
          });
          const response = await res.json();
          console.log('room id hhh', response);
          return response.roomId;
    } catch (error) {
        console.log("error",error);
    }
   
  };

export const GetUserProfile = async (token) => {
    try {
        const response = await fetch(`${BASE_URL}/users/profile-data`,{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            }
        });
        const responseJson = await response.json();
        console.log("responseJson profile",responseJson);
        return responseJson?.data;
    } catch (error) {
        console.log("error",error);
    }
}
  