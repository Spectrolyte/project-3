import React from "react";
import './login.css';
import FacebookLogin from 'react-facebook-login';
import Cookies from 'universal-cookie';
import Home from "./home.js";
import axios from "axios";
import { GoogleLogin } from 'react-google-login';
const cookies = new Cookies();

  class Login extends React.Component {

  state={
    loggedin: false
  };

  responseGoogle = (response) => {

    var id_token = response.getAuthResponse().id_token;
    axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${id_token}`)
    .then( googleUser => this.validate(googleUser.data) )
  
  };


  validate = (response) => {

    var id = response.sub

    axios.get('/user/' + id)
      .then(user => {

        if (user.data === null) {

          var newUser = {
            usernameId: response.sub,
            username: response.name,
            image: response.picture
          }

          axios.post('/newUser', { newUser })
            .then(user => {
                cookies.set('name', user.data.username);
                cookies.set('id', user.data.usernameId);
                this.setState({loggedin: true})
                this.props.history.push('/');
            })
        } 
        else {
          console.log('id: ', id)
           axios.put('/find/' + id)
            .then( data  => {
          console.log('111111111111 made it here')
            cookies.set('name', response.name);
            cookies.set('id', response.sub);
            this.setState({ loggedin: true });
            this.props.history.push('/');

            } )

        }
      })
  }

    componentDidMount(){
    }


    render() {

      

      return (this.state.loggedin === true ? (<Home/>): 

        (
              <div className="backgroundy">

                  <div className="container loginContainer">
                    <div className="row loginRow">
                        <div className="col s12">
                          <div className="loginCard card blue-grey darken-1">
                            <div className="loginContent card-content white-text">
                               <div className="center loginButton">
                                    <GoogleLogin
                                      clientId="1057993298286-11clhhie8id2del793p0usgcb1vh3spu.apps.googleusercontent.com"
                                      buttonText="Login with Google"
                                      onSuccess={this.responseGoogle}
                                      onFailure={this.responseGoogle}
                                      icon="fa fa-google"
                                    />
                                </div>             
                            </div>
                            
                          </div>
                        </div>
                      </div>


                      <div className="descriptionRow center row">
                        <div className=" col s4 m4 l4">
                          <div className="loginCard card">
                              <div className="card-image">
                                <img src="https://media.giphy.com/media/ZnbIrqkXGKfgk/giphy.gif"/>
                                <span className="cardText card-title">Form Groups with your friends!</span>
                              </div>
                              <div className="card-content">
                                <p>Add your friends and form a group!</p>
                              </div>
                              
                            </div>
                        </div>
                        <div className=" col s4 m4 l4">
                           <div className="loginCard card">
                              <div className="card-image">
                                <img src="https://media.giphy.com/media/ZnbIrqkXGKfgk/giphy.gif"/>
                                <span className="cardText card-title">Vote on events!</span>
                              </div>
                              <div className="card-content">
                                <p>In your groups, you can search for events and vote. The highest voted event will make it to the top of the groups page.</p>
                              </div>
                              
                            </div>
                        </div>
                        <div className=" col s4 m4 l4">
                           <div className="loginCard card">
                              <div className="card-image">
                                <img src="https://media.giphy.com/media/ZnbIrqkXGKfgk/giphy.gif"/>
                                <span className="cardText card-title">Have fun!</span>
                              </div>
                              <div className="card-content">
                                <p>Enjoy!</p>
                              </div>
                              
                            </div>
                        </div>
                       </div> 
                              
                     </div> 
                   </div>  

         ) )

    }
  }

export default Login;