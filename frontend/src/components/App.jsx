import { Component, useRef, useState } from 'react';
import Guid from 'guid';
import {
    Row,
    Col,
    Form,
    FormControl,
    Button,
    ListGroup,
    ListGroupItem,
    Nav,
    Navbar,
    NavItem,
    InputGroup,
    Modal,
} from 'react-bootstrap';
import RealtimeClient from '../helpers/RealtimeClient';

const getClientId = () => 'web-client:' + Guid.raw();
const getMessageId = () => 'message-id:' + Guid.raw();

const User = user => (
    <ListGroupItem key={user.clientId}>{ user.username }</ListGroupItem>
);

const Users = ({ users }) => (
    <div id="sidebar-wrapper">
        <div id="sidebar">
            <ListGroup>
                <ListGroupItem key='title'><i>Connected users</i></ListGroupItem>
                { users.map(User) }
            </ListGroup>
        </div>
    </div>
);

const Message = message => (
    <ListGroupItem key={message.id}><b>{message.username}</b> : {message.message}</ListGroupItem>
);

const ChatMessages = ({ messages }) => (
    <div id="messages">
        <ListGroup>
            <ListGroupItem key='title'><i>Messages</i></ListGroupItem>
            { messages.map(Message) }
        </ListGroup>
    </div>
);

const ChatHeader = ({ isConnected }) => (
    <Navbar fixedTop>
        
            <Navbar.Brand>
               Serverless IoT chat demo
            </Navbar.Brand>
        
        <Nav>
            <NavItem>{ isConnected ? 'Connected' : 'Not connected'}</NavItem>
        </Nav>
    </Navbar>
);

const ChatInput = ({ onSend }) => {
    const [inputText, setInputText] = useState('');
    const handleInputChange = event => {
        console.warn(event.target.value)
        setInputText(event.target.value);
    };
    const handleSubmit = event => {
        onSend(inputText);
        setInputText('');
        event.preventDefault();
    };
    return (

                    <div>
                        <input
                            type="text"
                            onChange={handleInputChange}
                            placeholder="Type your message"
                            value={inputText}
                        />
                        <Button type="submit" onClick={handleSubmit}>Send</Button>
                    </div>

    );
};

const ChatWindow = ({ users, messages, onSend }) => (
    <div>
            <Row>
                <Col xs={3}>
                    <Users
                        users={ users }
                    />
                </Col>
                <Col xs={9}>
                    <ChatMessages
                        messages={ messages }
                    />
                </Col>
            </Row>
        <ChatInput onSend={ onSend }/>
    </div>
);

const UserNamePrompt = ({
    onPickUsername,
}) => {
    const [inputText, setInputText] = useState('');
    const handleInputChange = event => {
        console.warn(event.target.value)
        setInputText(event.target.value);
    };
    const handleSubmit = event => {
        onPickUsername(inputText);
        setInputText('');
        event.preventDefault();
    };
    return (
            <Form inline>
                <Modal.Header closeButton>
                    <Modal.Title>Pick your username</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        type="text"
                        onChange={handleInputChange}
                        placeholder="Type your username"
                        value={inputText}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit" onClick={handleSubmit}>Ok</Button>
                </Modal.Footer>
            </Form>
    );
}

export default class App extends Component {
    constructor(props) {
        super(props);

        this.onSend = this.onSend.bind(this);
        this.connect = this.connect.bind(this);

        this.state = {
            users: [],
            messages: [],
            clientId: getClientId(),
            isConnected: false,
        };
    }

    // componentDidMount() {
    //     setTimeout(() => {
    //         this.connect('ninja')
    //     }, 5000);
    // }

    connect(username) {
        this.setState({ username });

        console.warn(`
            connect attempt!
            username is: ${username}
            `)

        this.client = new RealtimeClient({
            clientId: this.state.clientId,
            username,
        });

        this.client.connect()
            .then(() => {
                this.setState({ isConnected: true });
                this.client.onMessageReceived((topic, message) => {
                    if (topic === "client-connected") {
                        this.setState({ users: [...this.state.users, message] })
                    } else if (topic === "client-disconnected") {
                        this.setState({ users: this.state.users.filter(user => user.clientId !== message.clientId) })
                    } else {
                        this.setState({ messages: [...this.state.messages, message] });
                    }
                })
            })
    }

    onSend(message) {
        this.client.sendMessage({
            username: this.state.username,
            message: message,
            id: getMessageId(),
        });
    };

    render() {
        return (
            <div>
                <ChatHeader
                    isConnected={ this.state.isConnected }
                />
                <ChatWindow
                    users={ this.state.users }
                    messages={ this.state.messages }
                    onSend={ this.onSend }
                />
                <UserNamePrompt
                    onPickUsername={ this.connect }
                />
            </div>
        );
    }
}

