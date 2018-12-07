import React, { Component } from 'react';
import { Container, 
  Header, Button, Text, Content, Form, Item, Segment,
  Input, Label, Body, Icon, Tab, Tabs, Toast, Root 
} from 'native-base';
import {ImageBackground, StyleSheet, AsyncStorage, BackHandler} from 'react-native';
import bgSrc from './images/wallpaper.png';
import DatePicker from 'react-native-datepicker'; //alternate 'react-native-ui-xg' (still error)
import { withNavigation } from 'react-navigation';
import { sha256 } from 'react-native-sha256';


var FullName
var PhoneNumber
var Email
var Passwords
let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var emailstate = "error"
var hashedPassword
var hashedPasswordLogin
var EmailStore
var PasswordStore, KTPNumber, KKNumber, Rating, ActveStatus

class LoginApp extends React.Component {
  state = {
    full_name:'',
    birth_date:'Select your birthdate below',
    ktp_number:'',
    kk_number:'',
    phone_number:'',
    email:'',
    passwords:'',
    rating:0.0,
    active_status:1,
    email_valid:'',
    email_login:'',
    password_login:'',
  };

  async saveKey(value1){
    try{
      await AsyncStorage.setItem('user',value1);
    } catch(error){
      console.log(error)
    }
  }

  register = () => {
    if(this.state.full_name == '' || this.state.birth_date == 'Select your birthdate below' || this.state.phone_number == '' || this.state.email == '' || this.state.passwords == ''){
      Toast.show({
              text: 'All field must be filled',
              buttonText: 'Okay',
              duration : 3000
      })
    }
    else if(reg.test(this.state.email.toString()) === false || isNaN(this.state.phone_number)){
      this.setState({email_valid:'error'})
      Toast.show({
              text: 'Email or phone number not valid',
              buttonText: 'Okay',
              duration : 3000
            })
    }
    else{
      md5 = require('js-md5');
      hashedPassword = md5(this.state.passwords.toString())
      this.setState({email_valid:'success'})
      fetch('http://10.1.3.166:5000/driver_register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({
      FullName: this.state.full_name,
      BirthDate : this.state.birth_date,
      KTPNumber : this.state.ktp_number,
      KKNumber : this.state.kk_number,
      PhoneNumber: this.state.phone_number,
      Email: this.state.email,
      Passwords: hashedPassword,
      Rating : this.state.rating,
      ActveStatus : this.state.active_status,
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      var APIresponse = responseJson.status
      console.log(responseJson.status)
      if(APIresponse==200){
        Toast.show({
              text: 'Yay, you are registered now. Please Activate To Our Nearby Office',
              buttonText: 'Okay',
              duration : 7000
            })
      }
      else if(APIresponse==201){
        Toast.show({
              text: 'Phone number has been registered',
              buttonText: 'Okay',
              duration : 3000
            })
      }
    }).catch((error) =>{
        console.error(error);
      });;
    }
  }

  login = () => {
    if(this.state.email_login == '' || this.state.password_login == ''){
      Toast.show({
              text: 'Email and Password must be filled',
              buttonText: 'Okay',
              duration : 3000
            })
    }
    else{
      md5 = require('js-md5');
      hashedPasswordLogin = md5(this.state.password_login.toString())
      EmailLogin=this.state.email_login.toString()
      PasswordLogin=hashedPasswordLogin
      fetch('http://10.1.3.166:5000/driver_login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({
      EmailLogin: this.state.email_login,
      PasswordLogin: hashedPasswordLogin,
      }),
    }).then((response) => response.json())
    .then((responseJson) => {
      var APIresponse = responseJson.status
      if(APIresponse==300){
        Toast.show({
              text: 'Yay, you are logged in now.',
              buttonText: 'Okay',
              duration : 7000
            })
        let loginData = {
          Email: this.state.email_login,
          Pass: hashedPasswordLogin,
        }
        this.saveKey(JSON.stringify(loginData))
        this.props.navigation.navigate('Home')
      }
      else if(APIresponse==301){
        Toast.show({
              text: 'Email or password may be invalid',
              buttonText: 'Okay',
              duration : 4000
            })
      }
      else if(APIresponse==310){
        Toast.show({
              text: 'You must activate your ID. Please visit our nearby office',
              buttonText: 'Okay',
              duration : 4000
            })
      }
      else if(APIresponse==330){
        Toast.show({
              text: 'Your ID is temporary suspended',
              buttonText: 'Okay',
              duration : 4000
            })
      }
      else if(APIresponse==340){
        Toast.show({
              text: 'Your ID is permanently banned',
              buttonText: 'Okay',
              duration : 4000
            })
      }
    }).catch((error) =>{
        Toast.show({
              text: 'No internet Connection',
              buttonText: 'Okay',
              duration : 7000
            })
      });;
      }
    }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
    BackHandler.exitApp();
    return true;
  }

  render() {
    return (
      <Root>
        <Container>
            <Tabs>
                <Tab heading="Tab1">
                  <ImageBackground style={styles.picture} source={bgSrc}>
                    <Content padder>
                      <Form>
                        <Item stackedLabel>
                          <Label>Email</Label>
                          <Input onChangeText={(value) => this.setState({email_login: value})}/>
                        </Item>
                        <Item stackedLabel last>
                          <Label>Password</Label>
                          <Input onChangeText={(value) => this.setState({password_login: value})} secureTextEntry={true} />
                        </Item>
                      </Form>
                      <Button block light  onPress={() => 
                        this.login()
                      }>
                      <Text>Login</Text>
                      </Button>
                    </Content>
                  </ImageBackground>
                </Tab>

                <Tab heading="Tab2">
                  <Content padder>
                    <Form>
                      <Item stackedLabel>
                        <Label>Full Name</Label>
                        <Input onChangeText={(value) => this.setState({full_name: value})}/>
                      </Item>
                      <Text>
                          Birth Date: {this.state.birth_date.toString()}
                      </Text>
                      <DatePicker
                        style={{width: 200}}
                        date={this.state.date}
                        mode="date"
                        placeholder="select date"
                        format="YYYY-MM-DD"
                        minDate="1900-01-01"
                        maxDate="2200-12-31"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                          dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                          },
                          dateInput: {
                            marginLeft: 36
                          }
                          // ... You can check the source to find the other keys.
                        }}
                        onDateChange={(value) => this.setState({birth_date: value})} />
                      <Item stackedLabel>
                        <Label>KTP Number</Label>
                        <Input onChangeText={(value) => this.setState({ktp_number: value})}/>
                      </Item>
                      <Item stackedLabel>
                        <Label>KK Number</Label>
                        <Input onChangeText={(value) => this.setState({kk_number: value})}/>
                      </Item>
                      <Item stackedLabel>
                        <Label>Phone Number</Label>
                        <Input onChangeText={(value) => this.setState({phone_number: value})}/>
                      </Item>
                      <Item stackedLabel>
                        <Label>Email</Label>
                        <Input onChangeText={(value) => this.setState({email: value})}/>
                      </Item>
                      <Item stackedLabel last>
                        <Label>Password</Label>
                        <Input onChangeText={(value) => this.setState({passwords: value})}  secureTextEntry={true}/>
                      </Item>
                    </Form>
                    <Button block light onPress={() => 
                        this.register()
                      }>
                    <Text>Register</Text>
                    </Button>
                  </Content>
                </Tab>
            </Tabs>
        </Container>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  picture: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
});

export default withNavigation(LoginApp);