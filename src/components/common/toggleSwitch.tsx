import React from "react";
import "./ToggleSwitch.css";

interface Props{
    label: boolean;
	handleStatus: Function;
}
const ToggleSwitch = ({label, handleStatus}:Props ) => {
return (
	<div className="container">
	{/* {label}{" "} */}
	<div className="toggle-switch">
		<input type="checkbox" className="checkbox mb-3"
			name="Status" checked={label} value="Status" onChange={() => handleStatus()} id="status" />
		<label className="label" htmlFor="status">
		<span className="inner" />
		<span className={label?'active-switch':'switch'} />
		</label>
	</div>
	</div>
);
};

export default ToggleSwitch;
