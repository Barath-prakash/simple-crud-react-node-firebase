import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import moment from 'moment';
import Datepicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Validator from 'validator';
import { MSG } from 'shared/commonMessages/messages';

class FormModal extends Component {
    state = {
        data: {
            empId: "",
            firstName: "",
            lastName: "",
            email: "",
            gender: "",
            dateOfBirth: "",
            age: ""
        },
        errors: {},
        loading: false
    }

    componentDidUpdate(prevProps, prevState) {
       if(prevProps.employee !== this.props.employee) {
          let employee = this.props.employee;
          this.setState({
            data: {
                empId: employee.empId,
                firstName: employee.firstName,
                lastName: employee.lastName,
                email: employee.email,
                gender: employee.gender,
                dateOfBirth: employee.dateOfBirth,
                age: employee.age
            }
          })
       }
    }

    handleCloseFormModal = () => {
        this.resetForm();
        this.props.employeeFormMoalClose();
    }

    handleChange = (e) => this.setState({ data: {...this.state.data, [e.target.name]: e.target.value } })
    
    handleDateChange = (date) => {
        if(date !== null && date !== "Invalid date") {
            this.setState({ data: { ...this.state.data, dateOfBirth: date } }, () => {
                this.setState({ data: { ...this.state.data, age: moment().diff(moment(this.state.data.dateOfBirth).format('L'), 'years') } })
            })
        } else {
            this.setState({ data: { ...this.state.data, dateOfBirth: "", age: "" } })
        }
    }
    
    handleSubmit = (e) => {
        e.preventDefault();
        let data = this.state.data;
        const errors = this.validate(data);
        this.setState({ errors });
        if(Object.keys(errors).length === 0) {
            this.setState({ loading: true })
            if(this.state.data.empId) {
                return this.props.updateEmployee(data).then(res => this.handleCloseFormModal()).catch(err => this.setState({ loading: false }))
            } else {
                return this.props.addEmployee(data).then(res => this.handleCloseFormModal()).catch(err => this.setState({ loading: false }))
            }
        }
    }

    validate = (data) => {
        const errors = {};

        if(Validator.isEmpty(data.firstName)) {
           errors['firstName'] = MSG['firstName_cannot_empty'];
        } else if(!Validator.isLength(data.firstName, { min: 3 })) {
           errors['firstName'] = MSG['firstName_length'];
        }

        if(Validator.isEmpty(data.lastName)) {
            errors['lastName'] = MSG['lastName_cannot_empty'];
        } else if(!Validator.isLength(data.lastName, { min: 2 })) {
            errors['lastName'] = MSG['lastName_length'];
        }

        if(Validator.isEmpty(data.email)) {
            errors['email'] = MSG['email_cannot_empty'];
        } else if(!Validator.isEmail(data.email)) {
            errors['email'] = MSG['email_invalid'];
        }

        if(Validator.isEmpty(data.gender)) {
            errors['gender'] = MSG['gender_cannot_empty'];
        }

        if(Validator.isEmpty(data.dateOfBirth.toString().trim())) {
            errors['dateOfBirth'] = MSG['dob_cannot_empty'];
        }

        if(Validator.isEmpty(data.age.toString().trim()) || data.age === 0) {
            errors['age'] = MSG['age_cannot_empty'];
        }

        return errors;
    }
    
    resetForm = () => {
       this.setState({
           data: {
            firstName: "",
            lastName: "",
            email: "",
            gender: "",
            dateOfBirth: "",
            age: ""
           },
           errors: {},
           loading: false
       })
    }

    render() {
        const { employeeFormModal } = this.props;
        const { data, loading, errors } = this.state;
        return (
            <Modal size="lg" show={employeeFormModal} onHide={this.handleCloseFormModal} backdrop="static">
            
                <Modal.Header closeButton>
                    <Modal.Title>{data.empId ? "Update employee" : "Add employee"}</Modal.Title>
                </Modal.Header>
                <form onSubmit={this.handleSubmit}>
                <Modal.Body>
                    <div className="form-group">
                        <label htmlFor="firstName">First name:</label>
                        <input type="text" className="form-control" name="firstName" value={data.firstName ? data.firstName: ""} onChange={this.handleChange} placeholder="Enter first name" maxLength="75"/>
                        {errors.firstName && <span className="fld-error">{errors.firstName}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last name:</label>
                        <input type="text" className="form-control" name="lastName" value={data.lastName ? data.lastName: ""} onChange={this.handleChange} placeholder="Enter last name" maxLength="50"/>
                        {errors.lastName && <span className="fld-error">{errors.lastName}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" className="form-control" name="email" value={data.email ? data.email: ""} onChange={this.handleChange} placeholder="Enter email address" maxLength="200"/>
                        {errors.email && <span className="fld-error">{errors.email}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Gender:</label>
                            <label className="btn btn-default" style={{marginTop: 5}}>
                                <input type="radio" name="gender" value="male" onChange={this.handleChange} checked={data.gender && data.gender === "male"}/> Male
                            </label> 
                            <label className="btn btn-default" style={{marginTop: 5}}>
                                <input type="radio" name="gender" value="female" onChange={this.handleChange} checked={data.gender && data.gender === "female"}/> Female
                            </label><br/> 
                        {errors.gender && <span className="fld-error">{errors.gender}</span>}
                    </div>  
                    <div>
                    <label htmlFor="dateOfBirth">Date of birth:</label><br/>
                    <Datepicker
                        selected={(data.dateOfBirth && data.dateOfBirth !== "Invalid date") ? new Date(data.dateOfBirth) : null}
                        onChange={this.handleDateChange}
                        peekNextMonth={true}
                        showMonthDropdown={true}
                        showYearDropdown={true}
                        dropdownMode="select"
                        placeholderText="DD-MM-YYYY"
                        dateFormat="dd-MM-yyyy"
                        shouldCloseOnSelect={true}
                        isClearable={true}
                        maxDate={new Date()}
                    />
                    <br/>
                    {errors.dateOfBirth && <span className="fld-error">{errors.dateOfBirth}</span>}
                    </div>
                    <div className="loading"></div>
                    <div className="form-group" style={{marginTop: 10}}>
                        <label htmlFor="age">Age:</label>
                        <input type="text" className="form-control" value={data.age ? data.age: ""} maxLength="2" readOnly placeholder="Select your date of birth to fill this field"/>
                        {errors.age && <span className="fld-error">{errors.age}</span>}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleCloseFormModal} disabled={loading}>Close</Button>
                    <Button type="submit" variant="primary" disabled={loading}>Save</Button>
                </Modal.Footer>
                </form> 
            </Modal>
        )
    }
}

const mapStateToProps = (state) => {
    let employeeFormModal = state.employees.employeeFormModal ? state.employees.employeeFormModal : false;
    let employee = state.employees.employee ? state.employees.employee : {};
    return {
        employeeFormModal, employee
    }
}

export default connect(mapStateToProps, null)(FormModal);