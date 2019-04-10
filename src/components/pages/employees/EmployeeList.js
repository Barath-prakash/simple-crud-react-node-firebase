import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import EmployeeListItem from 'components/pages/employees/EmployeeListItem';

class EmployeeList extends Component {

    render() {
        const { employees, editEmployee, deleteEmployee, mDeleteEmpId, mDelete } = this.props;

        const tableBodyDiv = (
            (employees !== undefined && employees.length > 0) &&
            employees.map((item, index) => <EmployeeListItem key={index} employee={item} editEmployee={editEmployee} deleteEmployee={deleteEmployee} mDeleteEmpId={mDeleteEmpId}/>)
        )

        const emptyDiv = <tr><td colSpan="7">No employees found</td></tr>

        return (
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Multiple delete</th>
                        <th>Employee name</th>
                        <th>Email</th>
                        <th>Gender</th>
                        <th>DOB</th>
                        <th>Age</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                     {(employees && employees.length > 0) ? tableBodyDiv : emptyDiv}
                     {mDelete &&
                     <tr>
                        <td style={{textAlign: "center"}}>
                            <Button variant="danger" style={{marginLeft: 5}} onClick={() => this.props.deleteMultipleEmployees()}>Delete</Button>
                        </td>
                        <td colSpan="6"></td>
                     </tr>
                     }
                    </tbody>
                </Table>
        )
    }
}

export default EmployeeList;