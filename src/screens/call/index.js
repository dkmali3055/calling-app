// create call screen which get token from server and call socket server to start call using start call event
// Path: src/screens/call/index.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet,SafeAreaView,TouchableOpacity, FlatList } from "react-native";
import { useNavigate, useParams } from "react-router-native";
import { COLOR_FB_SECONDARY, COLOR_WHITE } from "../../shared/constants/colors";
import { GetCallToken, createMeeting } from "../../shared/api/route";
import AsyncStorage from "@react-native-async-storage/async-storage";
import io from "socket.io-client";
import { Button } from "react-native-paper";
import {
    MeetingProvider,
    useMeeting,
    useParticipant,
    MediaStream,
    RTCView,
  } from '@videosdk.live/react-native-sdk';
const CallScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [callToken, setCallToken] = useState(null);
  const [socket, setSocket] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [receiverId, setReceiverId] = useState(null);

  const getCallToken = async () => {
    const token = await AsyncStorage.getItem("token");
    setAuthToken(token);
    const response = await GetCallToken(token);
    console.log("call token", response.token);
    setCallToken(response.token);
    const roomId = await createMeeting(response.token);
    setRoomId(roomId);
  };
  useEffect(() => {
    //set receiver id from params
    setReceiverId(id);
    getCallToken();
  }, []);

  useEffect(() => {
    if (callToken && roomId) {
      //pass authToken to socket server header for authentication
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
  }, [callToken, roomId]);


  useEffect(() => {
    if (socket) {
      socket.on("call-accepted", (data) => {
        console.log("callUser", data);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("call-rejected", (data) => {
        console.log("callAccepted", data);
        navigate(`/users`);
      });
    }
  }, [socket]);

  const ButtonCom = ({onPress, buttonText, backgroundColor}) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          backgroundColor: backgroundColor,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 12,
          borderRadius: 4,
        }}>
        <Text style={{color: 'white', fontSize: 12}}>{buttonText}</Text>
      </TouchableOpacity>
    );
  };
  function ParticipantView({participantId}) {
    const {webcamStream, webcamOn} = useParticipant(participantId);
    return webcamOn && webcamStream ? (
      <RTCView
        streamURL={new MediaStream([webcamStream.track]).toURL()}
        objectFit={'cover'}
        style={{
          height: 300,
          marginVertical: 8,
          marginHorizontal: 8,
        }}
      />
    ) : (
      <View
        style={{
          backgroundColor: 'grey',
          height: 300,
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 8,
          marginHorizontal: 8,
        }}>
        <Text style={{fontSize: 16}}>NO MEDIA</Text>
      </View>
    );
  }
  
  function ParticipantList({participants}) {
    return participants.length > 0 ? (
      <FlatList
        data={participants}
        renderItem={({item}) => {
          return <ParticipantView participantId={item} />;
        }}
      />
    ) : (
      <View
        style={{
          flex: 1,
          backgroundColor: '#F6F6FF',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 20}}>Press Join button to enter meeting.</Text>
      </View>
    );
  }
  function ControlsContainer({join, leave, toggleWebcam, toggleMic}) {
    return (
      <View
        style={{
          padding: 24,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <ButtonCom
          onPress={() => {
            join();
            socket.emit("start-call", {
                meetingId: roomId,
                receiverId: receiverId,
                });
          }}
          buttonText={'Join'}
          backgroundColor={'#1178F8'}
        />
        <ButtonCom
          onPress={() => {
            toggleWebcam();
          }}
          buttonText={'Toggle Webcam'}
          backgroundColor={'#1178F8'}
        />
        <ButtonCom
          onPress={() => {
            toggleMic();
          }}
          buttonText={'Toggle Mic'}
          backgroundColor={'#1178F8'}
        />
        <ButtonCom
          onPress={() => {
            leave();
            socket.emit("reject-call", {
                meetingId: roomId,
                callerId: receiverId,
                });
            navigate(`/users`)
          }}
          buttonText={'Leave'}
          backgroundColor={'#FF0000'}
        />
      </View>
    );
  }

  function MeetingView() {
    // Get `participants` from useMeeting Hook
    const {join, leave, toggleWebcam, toggleMic, participants,meetingId} = useMeeting({});
  
    const participantsArrId = [...participants.keys()];
    return (
      <View style={{flex: 1}}>
        {meetingId ? (
          <Text style={{fontSize: 18, padding: 12}}>Meeting Id :{meetingId}</Text>
        ) : null}
        
      <ParticipantList participants={participantsArrId} />
        <ControlsContainer
          join={join}
          leave={leave}
          toggleWebcam={toggleWebcam}
          toggleMic={toggleMic}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Call Screen</Text>
      <Button title="Go to Users" onPress={() => navigate(`/users`)} />
      <Button
        style={styles.loginButton}
        labelStyle={styles.loginButtonText}
        mode="contained"
        onPress={() => navigate(`/users`)}
      >
        User List
      </Button>
      {
        roomId && callToken ? (
            <SafeAreaView style={{flex: 1, backgroundColor: '#F6F6FF'}}>
            <MeetingProvider
              config={{
                meetingId : roomId,
                micEnabled: false,
                webcamEnabled: true,
                name: 'Test User',
              }}
              token={callToken}>
              <MeetingView />
            </MeetingProvider>
          </SafeAreaView>
        ) : null
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_WHITE,
  },
  loginButton: {
    backgroundColor: COLOR_FB_SECONDARY,
    height: 48,
    borderRadius: 0,
  },
  loginButtonText: {
    paddingTop: 8,
    fontSize: 24,
  },
});

export default CallScreen;
