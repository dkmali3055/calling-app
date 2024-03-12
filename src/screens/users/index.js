
//this is a screen to show all users list and call them
// Path: src/screens/users/index.js
import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity,StyleSheet} from 'react-native';
import {useNavigate} from 'react-router-native';
import {COLOR_WHITE} from '../../shared/constants/colors';
import {GetUserProfile, GetUsers} from '../../shared/api/route';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from "socket.io-client";
import BackgroundTimer from 'react-native-background-timer';


const UserScreen = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [socket, setSocket] = useState(null);
    const [authToken, setAuthToken] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    let profile = null;
    const getUsers = async () => {
        const token = await AsyncStorage.getItem('token');
        setAuthToken(token);
        const response = await GetUsers(token);
        console.log("profile" ,response);
        setUsers(response);
    };

    const getUserProfile = async () => {
        const token = await AsyncStorage.getItem('token');
        setAuthToken(token);
        const response = await GetUserProfile(token);
        console.log("profile", response);
        profile = response;
        setUserProfile(response);
    }
    
    useEffect(() => {
        getUsers();
        getUserProfile();
    }, []);
    
    useEffect(() => {
        if(authToken){   
        const newSocket = io("https://calling-nodejs.onrender.com", {
            transportOptions: {
              polling: {
                extraHeaders: {
                  Authorization: authToken,
                },
              },
            },
          });
          console.log(newSocket);
          setSocket(newSocket);
        }
    }, [users]);

    useEffect(() => {
        if (socket) {
            BackgroundTimer.runBackgroundTimer(() => {
                // ping server to keep ws alive in background
                socket.emit('ping');
              }, 3000);
              
            socket.on('incoming-call', (data) => {
                console.log('incoming-call', data);
                if(!data?.meetingId)
                return;
                navigate(`/calling/${data.receiverId}=${data.meetingId}`);
              });
            }
        return () => {
            BackgroundTimer.stopBackgroundTimer();
        }
      }, [socket]);


    const renderItem = ({item}) => {
        return (
        <TouchableOpacity
            onPress={() => navigate(`/call/${item._id}`)}
            style={styles.userContainer}>
            <Text style={styles.userName}>{item.userName}</Text>
        </TouchableOpacity>
        );
    };
    
    return (
        <View style={styles.container}>
        <FlatList
            data={users}
            renderItem={renderItem}
            keyExtractor={item => item._id}
        />
        </View>
    );
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR_WHITE,
    },
    userContainer: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    userName: {
        fontSize: 20,
    },
});

export default  UserScreen;