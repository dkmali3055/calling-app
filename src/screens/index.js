import {useContext, useState} from 'react';
import {View} from 'react-native';
import {NativeRouter, Route, Routes} from 'react-router-native';
import LoginScreen from './login';
import UserScreen from './users';
import CallScreen from './call';
import CallingScreen from './calling';

const Screens = () => {

  return (
    <NativeRouter>
        <Routes>

          {/* {<Route path="/receive-call" element={<ReceiveCallScreen />} />}
//
          <Route path="/chat/:friendId" element={<ChatScreen />} />

          <Route path="/call/:callId" element={<CallScreen />} /> */}
      
          <Route path="/" element={<LoginScreen />} />
          <Route path="/users" element={<UserScreen />} />
          <Route path="/call/:id" element={<CallScreen />} />
          <Route path="/calling/:id" element={<CallingScreen />} />
           {/*<Route path="/register" element={<RegisterScreen />} /> */}
          <Route path="/login" element={<LoginScreen />} />
        </Routes>
    </NativeRouter>
  );
};

export default Screens;
