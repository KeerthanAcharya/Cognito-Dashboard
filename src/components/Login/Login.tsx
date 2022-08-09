import React, { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";

import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";

import "./Login.css";
import Signup from "./Signup";

const Login = ({ setUser }: { setUser: Function }) => {

	const [action, setAction] = useState('Login')

	return (
		<Container fluid>
			<Row className='rowContainer'>
				<Col className='leftside'>
					<LeftPanel />
				</Col>
				<Col className='rightside'>
					<RightPanel setUser={setUser} />
				</Col>

			</Row>

		</Container>
	);
};

export default Login;
