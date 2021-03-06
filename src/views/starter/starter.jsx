import React from 'react';
import {
    Row,
    Col
} from 'reactstrap';
import { SalesSummary, Projects, Feeds, SocialCards } from 'components/dashboard-components';
import firebase from 'firebase';
import ThemeRoutes from '../../routes/routing.jsx';
class Starter extends React.Component {
    constructor(props){
        super(props);
        this._isMounted = false;
        this.mypage = this.mypage.bind(this);
        this.state = {keys:[], myroutine:[]};
    }
    componentWillUnmount() {
		this._isMounted = false;
	 }
    componentDidMount(){

        this._isMounted = true;
        var ref = firebase.database().ref().child('routine');
        var uid = null;
        var n = 4;
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                ThemeRoutes[n]['name'] = 'Logout';
                ThemeRoutes[n]['icon'] = 'mdi mdi-logout';
                uid = user.uid;
            }else{
                ThemeRoutes[n]['name'] = 'LogIn';
                ThemeRoutes[n]['icon'] = 'mdi mdi-login';
            }
        });

        var user = firebase.auth().currentUser;
        if(user){
            ThemeRoutes[n]['name'] = 'Logout';
            ThemeRoutes[n]['icon'] = 'mdi mdi-logout';
            uid = user.uid;
        }else{
            ThemeRoutes[n]['name'] = 'LogIn';
            ThemeRoutes[n]['icon'] = 'mdi mdi-login';
        }

        ref.on('value', snap => {
            var val = snap.val();
            if(val!=null & this._isMounted){
                var keys = [];
                var myroutine = [];
                for(var key in val){
                    if(val[key]['uid'] == uid){
                            myroutine.push(key);
                    }
                    else{
                        keys.push(key)
                    }
                }
                this.setState({keys: keys, myroutine: myroutine});
            }
        })
    }

    mypage(){
        return(
            <div>
            <h5 className="mb-3">My Page</h5>
            <Row>
                {this.state.myroutine.map((key, index) => {
                    return(
                        <Col sm={6} lg={4}><Projects props={key} detail={true} my={true}/></Col>)
                })}
            </Row>
            </div>
        );
    }
    render(){
        var user = firebase.auth().currentUser;
        var mypage = null;
        if (user != null){
            mypage = <this.mypage/>;
        }

    return (
        <div>
            {mypage}
            <h5 className="mb-3">Explore routines</h5>
            <Row>
                {this.state.keys.map((key, index) => {
                    return(
                <Col sm={6} lg={4}>
                    <Projects props={key} detail={false} my={false}/>
                </Col>
                )})}
            </Row>
        </div>
    )}
}

export default Starter;