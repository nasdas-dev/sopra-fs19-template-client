import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import styled from "styled-components";

import {BaseContainer} from "../../helpers/layout";
import {Spinner} from "../../views/design/Spinner";
import User from "../shared/models/User";
import {getDomain} from "../../helpers/getDomain";
import {Button} from "../../views/design/Button";

const ProfileContainer = styled(BaseContainer)`
  color: white;
  text-align: center;
  width: 100%;
  margin: auto;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  width: 60%;
  margin: auto;
  height: 500px;
  font-size: 16px;
  font-weight: 300;
  padding-top: 40px;
  padding-left: 40px;
  padding-right: 40px;
  border-radius: 5px;
  background: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
  height: 35px;
  padding-left: 15px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;

const Title = styled.label`
  color: white;
  font-size: 32px;
  margin-bottom: 16px;
`;


const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const ButtonView = styled.div`
  margin-top: 75px;
`;

class UserEdit extends Component {

    state = {
        user: "",
        username: "",
        birthday: ""
        // showEditDialog: false,
        // canEdit: false
    };


    componentDidMount() {
        this.fetchUserDate();
    }


    showUser(id) {
        this.props.history.push(`/users/${id}`);
    }


    handleInputChange(key, value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        this.setState({ [key]: value });
    }

    fetchUserDate() {
        const {id} = this.props.match.params;
        fetch(`${getDomain()}/users/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(async res => {
            if (!res.ok) {
                const error = await res.json();
                alert(error.message);
                this.props.history.push("/game");
            } else {
                const user = new User(await res.json());
                this.setState({user: user});
                this.setState({username: user.username});
                this.setState({birthday: this.formatDate(this.state.user.birthday)})
            }
        })
        .catch(err => {
            if (err.message.match(/Failed to fetch/)) {
                alert("The server cannot be reached. Did you start it?");
            } else {
                alert(`Something went wrong during the login: ${err.message}`);
            }
        });
    }


    updateUser() {
        const {id} = this.props.match.params;
        fetch(`${getDomain()}/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body : JSON.stringify({
                username: this.state.username,
                birthday: this.state.birthday
            })
        })
        .then(async res => {
            if (!res.ok) {
                const error = await res.json();
                alert(error.message);
                this.setState({ username: "" });
                this.setState({ birthday: "" });
            } else {
                this.showUser(id);
            }
        })
        .catch(err => {
            if (err.message.match(/Failed to fetch/)) {
                alert("The server cannot be reached. Did you start it?");
            } else {
                alert(`Something went wrong during the login: ${err.message}`);
            }
        });
    }

    formatDate(dateTime) {
        const date = new Date(dateTime);
        let day = date.getDate();
        let monthIndex = date.getMonth() + 1; // Index 0 is january
        let year = date.getFullYear();

        if (monthIndex<10){
            monthIndex = '0'+monthIndex;
        }
        if (day<10){
            day = '0'+day;
        }

        return `${year}-${monthIndex}-${day}`;
    }
    static isValid(birthday) {
        const date = new Date(birthday);
        return date.getFullYear() >= 1000;
    }

    render() {
        return (
            <BaseContainer>
                <FormContainer>
                    <Form>
                        <Title>Edit Your Profile</Title>
                        <Label>Username</Label>
                        <InputField
                            value={this.state.username}
                            placeholder="Enter here.."
                            onChange={e => {
                                this.handleInputChange("username", e.target.value);
                            }}
                        />
                        <Label>Birthday</Label>
                        <InputField
                            value={this.state.birthday}
                            type="date"
                            placeholder="Enter here.."
                            onChange={e => {
                                this.handleInputChange("birthday", e.target.value);
                            }}
                        />
                        <ButtonView>
                            <ButtonContainer>
                                <Button
                                    disabled={!this.state.username || !this.state.birthday}
                                    width="50%"
                                    onClick={() => {
                                        if (UserEdit.isValid(this.state.birthday)) {
                                            this.updateUser();
                                        } else {
                                            alert("Please choose a valid birthday.")
                                        }
                                    }}
                                >
                                    Save Changes
                                </Button>
                            </ButtonContainer>
                            <ButtonContainer>
                                <Button
                                    color="rgb(255,87,51)"
                                    width="50%"
                                    onClick={() => {
                                        this.showUser(this.state.user.id);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </ButtonContainer>
                        </ButtonView>
                    </Form>
                </FormContainer>
            </BaseContainer>
        );
    }
}

export default withRouter(UserEdit);
