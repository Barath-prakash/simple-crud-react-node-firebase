import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { MSG } from 'shared/commonMessages/messages';

//React-Notification
import NotificationSystem from 'react-notification-system';

// Import dependent components
import EmployeeList from 'components/pages/employees/EmployeeList';
import FormModal from 'components/forms/employees/FormModal';

// Action
import { fetchAllEmployees, employeeFormMoalOpen, employeeFormMoalClose, 
         addEmployee, fetchEmployee, updateEmployee, deleteEmployee, deleteMultipleEmployees } from 'action/employeeAction';

const notifyStyle = {
    NotificationItem: { // Override the notification item
        DefaultStyle: { // Applied to every notification, regardless of the notification level
            margin: '100px 5px 5px 5px',
            padding: '20px 5px 15px 5px',
            fontSize: 17,
            textAlign: 'center'      
        }
    }
}
           
class EmployeePage extends Component {
    state = {
        mDeleteEmpArr: []
    }

    componentDidMount() {
        this.props.fetchAllEmployees();
    }

    employeeFromMoalOpen = () => {
        this.props.employeeFormMoalOpen();
    }

    employeeFormMoalClose = () => {
        return this.props.employeeFormMoalClose();
    }

    addEmployee = (data) => {
        return this.props.addEmployee(data).then(res => {
            this.props.fetchAllEmployees();
            this.setState({ mDeleteEmpArr: [] });
            this.refs.notificationSystem.addNotification({
                position: "tc",
                message: MSG['added_success'],
                level: 'success'
            });
        })
    }

    editEmployee = (empId) => {
       this.props.fetchEmployee(empId).then(res => {
            this.props.employeeFormMoalOpen();
      })
    }

    updateEmployee = (data) => {
        return this.props.updateEmployee(data).then(res => {
            this.props.fetchAllEmployees();
            this.setState({ mDeleteEmpArr: [] });
            this.refs.notificationSystem.addNotification({
                position: "tc",
                message: MSG['updated_success'],
                level: 'success',
            });
        })
    }

    deleteEmployee = (empId) => {
        return this.props.deleteEmployee(empId).then(res => {
            this.props.fetchAllEmployees();
            this.setState({ mDeleteEmpArr: [] });
            this.refs.notificationSystem.addNotification({
                position: "tc",
                message: MSG['removed_success'],
                level: 'success'
            });
        })  
    }

    deleteEmployeeConfirm = (empId) => {
        let id = empId;
        this.refs.notificationSystem.addNotification({
            position: "tc",
            level: 'error',
            message: 'Are you sure you want to delete this employee?',
            autoDismiss: 0,
            action: {
                label: 'Ok',
                callback: () => {
                  this.deleteEmployee(id);
                }
              }
        })
    }

    mDeleteEmpId = (empData) => {
      let empIdArr = [...this.state.mDeleteEmpArr];
      if(empData.checked) {
        empIdArr.push(empData.empId);
      } else {
        let existIdInx = empIdArr.findIndex(data => data === empData.empId)
        if(existIdInx > -1) {
           empIdArr.splice(existIdInx, 1);
        }
      }
      this.setState({ mDeleteEmpArr: empIdArr });
    }

    deleteMultipleEmployeesConfirm = () => {
        this.refs.notificationSystem.addNotification({
            position: "tc",
            level: 'error',
            message: 'Are you sure you want to delete multiple employees?',
            autoDismiss: 0,
            action: {
                label: 'Ok',
                callback: () => {
                  this.deleteMultipleEmployees();
                }
              }
        })
        
    }

    deleteMultipleEmployees = () => {
        return this.props.deleteMultipleEmployees(this.state.mDeleteEmpArr)
        .then(res => {
            this.setState({ mDeleteEmpArr: [] });
            this.props.fetchAllEmployees();
            this.refs.notificationSystem.addNotification({
                position: "tc",
                message: MSG['removed_success'],
                level: 'success'
            });
        })
    }

    render() {
        const { employees } = this.props;
        const { mDeleteEmpArr } = this.state;
        return (
            <div className="container">
            <NotificationSystem ref="notificationSystem" style={notifyStyle}/>
            <div>
                <h4 style={{float: 'left'}}>Employees List</h4>
                <Button variant="primary" style={{float: 'right'}} onClick={this.employeeFromMoalOpen}>Add employee</Button>
            </div><br/><br/>
                <EmployeeList 
                    employees={employees} 
                    editEmployee={this.editEmployee} 
                    deleteEmployee={this.deleteEmployeeConfirm} 
                    mDeleteEmpId={this.mDeleteEmpId} 
                    mDelete={mDeleteEmpArr.length > 1 ? true : false}
                    deleteMultipleEmployees={this.deleteMultipleEmployeesConfirm}
                    />
                <FormModal 
                    employeeFormMoalClose={this.employeeFormMoalClose} 
                    addEmployee={this.addEmployee} 
                    updateEmployee={this.updateEmployee}
                    />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    let employees = state.employees.employees ? state.employees.employees : []
    return {
        employees
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllEmployees: () => dispatch(fetchAllEmployees()),
        employeeFormMoalOpen: () => dispatch(employeeFormMoalOpen()),
        employeeFormMoalClose: () => dispatch(employeeFormMoalClose()),
        addEmployee: (data) => dispatch(addEmployee(data)),
        fetchEmployee: (empId) => dispatch(fetchEmployee(empId)),
        updateEmployee: (data) => dispatch(updateEmployee(data)),
        deleteEmployee: (empId) => dispatch(deleteEmployee(empId)),
        deleteMultipleEmployees: (empIdArr) => dispatch(deleteMultipleEmployees(empIdArr))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmployeePage);