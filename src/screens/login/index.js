import {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';

import {Button} from 'react-native-paper';
import {useNavigate} from 'react-router-native';

import {
  COLOR_FB_PRIMARY,
  COLOR_FB_SECONDARY,
  COLOR_WHITE,
} from '../../shared/constants/colors';
import Input from '../../shared/components/Input';
import {OnLogin} from '../../shared/api/route';
const LoginScreen = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
  };

//   const onLogin = ({email, password}) => {

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.facebookText}>facebook</Text>

        <Input placeholder="Email" value={email} onChangeText={setEmail} />

        <Input
          secure
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.loginButtonContainer}>
          
            <Button
              style={styles.loginButton}
              labelStyle={styles.loginButtonText}
              mode="contained"
              onPress={async () => {
                await OnLogin(email, password);
                resetForm();
                navigate('/users');
              }}>
              Log In
            </Button>
        </View>
      </View>

      <Button
        labelStyle={styles.signUpText}
        onPress={() => navigate('/register')}>
        Sign Up for Facebook
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: COLOR_FB_PRIMARY,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  facebookText: {
    fontSize: 56,
    fontWeight: '700',
    color: COLOR_WHITE,
    marginBottom: 32,
  },
  loginButtonContainer: {
    marginTop: 16,
    width: '100%',
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
  signUpText: {
    color: COLOR_WHITE,
    fontSize: 16,
  },
});

export default LoginScreen;
