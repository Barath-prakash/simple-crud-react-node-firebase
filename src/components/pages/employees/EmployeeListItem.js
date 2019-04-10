import React, { Component } from 'react';
import moment from 'moment';
import { Button } from 'react-bootstrap';

class EmployeeListItem extends Component {
    state={}

    handleEmpChecked = (e) => {
        this.setState({ ...this.state, [e.target.id]: e.target.checked });
        this.props.mDeleteEmpId({checked: e.target.checked, empId: e.target.id });
    }
    
    render() {
        const { employee } = this.props;
        return (
            <tr>
                <td style={{textAlign: "center"}}>
                    <input type="checkbox" checked={this.state[employee.empId] ? true : false} id={employee.empId} onChange={this.handleEmpChecked}/>
                </td>
                <td>{employee.firstName +" "+ employee.lastName}</td>
                <td>{employee.email}</td>
                <td>{employee.gender}</td>
                <td>{moment(employee.dateOfBirth).format("DD-MM-YYYY")}</td>
                <td>{employee.age}</td>
                <td>
                <Button variant="success" onClick={() => this.props.editEmployee(employee.empId)}>Edit</Button>
                <Button variant="danger" style={{marginLeft: 5}} onClick={() => this.props.deleteEmployee(employee.empId)}>Delete</Button>
                </td>
            </tr>
        )
    }
}

export default EmployeeListItem;