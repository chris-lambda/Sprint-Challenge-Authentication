import React, { Component } from 'react';
import axios from 'axios';

const keyName = process.env.REACT_APP_TOKEN_ITEM;
const url = process.env.REACT_APP_API_URL;

class Jokes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jokes: [],
            isLoggedIn: false,
        }
    }

    componentDidMount() {
        this.authenticate();
    }

    authenticate = () => {
        const token = localStorage.getItem(keyName);

        if(token) {
            const options = {
                headers: { 
                    Authorization: token
                }
            };
            axios.get(`${url}/api/jokes`, options)
            .then(res => {
                if (res.status === 200) {
                    this.setState({isLoggedIn: true, jokes: res.data});
                } else {
                    throw new Error();
                }
            })
            .catch(err => console.log(err));
        }
    }
    
    render() {

        return this.state.isLoggedIn
        ?
            <div>
                <h1>
                    logged in
                </h1>
                {
                    this.state.jokes.map((joke, index) => {
                        return (
                            <div key={index}>
                                <span> Setup: </span><span>{joke.setup}</span>
                                <br/>
                                <span> Punchline: </span><span>{joke.punchline}</span>
                                <br />
                            </div>
                        )
                    })
                }
            </div>
        :
            <div>
                <h1>
                    not logged in
                </h1>
            </div>
    }
}

export default Jokes;
