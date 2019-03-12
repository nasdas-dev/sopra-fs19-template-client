import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import styled from "styled-components";

import {BaseContainer} from "../../helpers/layout";
import {Spinner} from "../../views/design/Spinner";
import User from "../shared/models/User";
import {getDomain} from "../../helpers/getDomain";
import {Button} from "../../views/design/Button";


const Table = styled.table`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  color: white;
  font-size: 16px;
  margin-bottom: 16px;
  max-width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
`;
const Td = styled.td`
    padding: 16px;
    line-height: 2;
    text-align: center;
    vertical-align: top;
`;
const Tr = styled.tr`
    padding: 8px;
    line-height: 2;
    text-align: center;
    vertical-align: top;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
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

const Title = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
`;

class UserProfile extends Component {
    state = {
        user: ""
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

    dashboard(){
        this.props.history.push("/game/dashboard")
    }
    editUser(id) {
        this.props.history.push(`/users/${id}/edit`);
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
            <ProfileContainer>
                {!this.state.user ? (
                    <Spinner/>
                ) : (
                    <React.Fragment>
                        <Table>
                            <tbody>
                            <Tr>
                                <Td>
                                    <Title>
                                        {this.state.user.username}
                                    </Title>
                                </Td>
                            </Tr>
                            <Tr>
                                <Td>Online Status:</Td>
                                <Td>{this.state.user.status}</Td>
                            </Tr>
                            <Tr>
                                <Td>Creation Date:</Td>
                                <Td>{UserProfile.formatDate(this.state.user.creationDate)}</Td>
                            </Tr>
                            <Tr>
                                <Td>Birthday:</Td>
                                <Td>{UserProfile.formatDate(this.state.user.birthday)}</Td>
                            </Tr>
                            </tbody>
                        </Table>
                        <ButtonContainer>
                            <Button
                                color="sky"
                                width="50%"
                                onClick={() => {
                                    this.editUser(this.state.user.id);
                                }}
                            >
                                EDIT
                            </Button>
                        </ButtonContainer>
                        <ButtonContainer>
                            <Button
                                width="50%"
                                onClick={() => {
                                    this.dashboard();
                                }}
                            >
                                Dashboard
                            </Button>
                        </ButtonContainer>


                            {/*{this.state.canEdit ? (
                            <React.Fragment>
                                <ButtonToolbar>
                                    <Button
                                        variant="primary"
                                        onClick={() => this.setState({showEditDialog: true})}
                                    >
                                        Edit
                                    </Button>
                                </ButtonToolbar>
                                {this.state.showEditDialog ? (
                                    <EditUserDialog
                                        user={this.getUser()}
                                        onClose={evt => this.handleCloseModal(evt)}
                                    />
                                ) : null}
                            </React.Fragment>
                        ) : null}*/}
                    </React.Fragment>
                )}
            </ProfileContainer>
        );
    }


}

export default withRouter(UserProfile);
