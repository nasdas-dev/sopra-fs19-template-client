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

class UserProfile extends Component {

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

    handleCloseModal(successful) {
        this.setState({showEditDialog: false});
        if (successful) {
            this.fetchUserDate();
        }
    }

    showUser(id) {
        this.props.history.push(`/users/${id}`);
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
                    this.setState({user});

                    // EDIT
                    // DataService.postRequest(`/edit`, {
                    //     id: id,
                    //     token: localStorage.getItem("token")
                    // })
                    //     .then(async res => {
                    //     if (!res.ok) {
                    //         const error = await res.json();
                    //         alert(error.message);
                    //     } else {
                    //         this.setState({
                    //             canEdit: await res.json()
                    //         });
                    //     }
                    // });
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

    static formatDate(dateTime) {
        const date = new Date(dateTime);
        const day = date.getDate();
        const monthIndex = date.getMonth() + 1; // Index 0 is january
        const year = date.getFullYear();

        return `${day}. ${monthIndex}. ${year}`;
    }

    getUser() {
        return this.state.user;
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
                            type="date"
                            placeholder="Enter here.."
                            onChange={e => {
                                this.handleInputChange("birthday", e.target.value);
                            }}
                        />
                        <ButtonContainer>
                            <Button
                                disabled={!this.state.username || !this.state.password}
                                width="50%"
                                onClick={() => {
                                    this.login();
                                }}
                            >
                                Save Changes
                            </Button>
                        </ButtonContainer>
                        <ButtonContainer>
                            <Button
                                color="sky"
                                width="50%"
                                onClick={() => {
                                    this.showUser(this.state.user.id);
                                }}
                            >
                                Cancel
                            </Button>
                        </ButtonContainer>
                    </Form>
                </FormContainer>
            </BaseContainer>
        );
    }
}

export default withRouter(UserProfile);
