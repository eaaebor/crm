import React, { Component } from 'react';
import { CustomerContext } from './Contexts/CustomerProvider';

class EditCustomer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updatedCustomer: {

            }
        }
    }

    handleChange(event) {
        this.setState({
            updatedCustomer: {
                ...this.state.updatedCustomer,
                [event.target.name]: event.target.value
            }

        });
    }

    showModal(event) {
        if ("modalOverlay".includes(event.target.classList[0])) {
            this.props.hideModal()
        }
    }

    async updateCustomer() {
        await this.context.updateFullCustomer(this.state.updatedCustomer, this.props.id)
        await this.props.update()
        this.props.disableEdit()
    }

    render() {

        return (
            <>

                <CustomerContext.Consumer>
                    {(context) => (
                        <>
                            <div className="gridContainer">
                                <div className="customerProfile">
                                    <h1 className="customerTitle">{context.state.customer.company}</h1>
                                    <span className="editBtn material-icons-outlined highlightExit" onClick={() => this.props.disableEdit()}>close</span>
                                    <span title="Gem ændringer" className="editBtn material-icons-outlined highlightSave" onClick={() => this.updateCustomer()}>save</span>
                                    <h3><span className="material-icons-outlined">subject</span> Kundeoplysninger</h3>
                                    <div className="customerDetails">
                                        <span className="customerLabel">Virksomhed</span><input onChange={event => this.handleChange(event)} className="editInput" name="company" defaultValue={context.state.customer.company}></input>
                                        <span className="customerLabel">CVR</span><input onChange={event => this.handleChange(event)} className="editInput" name="cvr" defaultValue={context.state.customer.cvr}></input>
                                        <span className="customerLabel">Adresse</span><input onChange={event => this.handleChange(event)} className="editInput" name="address" defaultValue={context.state.customer.address}></input>
                                        <span className="customerLabel">Kontaktperson</span><input onChange={event => this.handleChange(event)} className="editInput" name="contactpersonname" defaultValue={context.state.customer.contactpersonname}></input>
                                        <span className="customerLabel">Kontaktperson telefon</span><input onChange={event => this.handleChange(event)} className="editInput" name="contactpersonphone" defaultValue={context.state.customer.contactpersonphone}></input>
                                        <span className="customerLabel">Kontaktperson email</span><input onChange={event => this.handleChange(event)} className="editInput" name="contactpersonemail" defaultValue={context.state.customer.contactpersonemail}></input>
                                        <span className="customerLabel">Hjemmeside</span><input onChange={event => this.handleChange(event)} className="editInput" name="url" defaultValue={context.state.customer.url}></input>
                                    </div>
                                </div>

                                <div className="customerSub">
                                    <div>
                                        <h2>Abonnement &#38; priser</h2>
                                        <div className="customerDetails">
                                            <span className="customerLabel">Antal timer</span><input onChange={event => this.handleChange(event)} className="editInput" name="hours" defaultValue={context.state.customer.hours}></input>
                                            <span className="customerLabel">Timepris</span><input onChange={event => this.handleChange(event)} className="editInput" name="hourprice" defaultValue={context.state.customer.hourprice}></input>
                                            <span className="customerLabel">Omsætning i alt</span><span>{context.state.customer.hourprice * context.state.customer.hours} kr/måneden</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h2>Sociale medier</h2>
                                        <div className="customerDetails">
                                            <span className="customerLabel">Facebook</span><input onChange={event => this.handleChange(event)} className="editInput" name="facebook" defaultValue={context.state.customer.facebook}></input>
                                            <span className="customerLabel">Instagram</span><input onChange={event => this.handleChange(event)} className="editInput" name="instagram" defaultValue={context.state.customer.instagram}></input>
                                            <span className="customerLabel">LinkedIn</span><input onChange={event => this.handleChange(event)} className="editInput" name="linkedin" defaultValue={context.state.customer.linkedin}></input>
                                            <span className="customerLabel">Pinterest</span><input onChange={event => this.handleChange(event)} className="editInput" name="pinterest" defaultValue={context.state.customer.pinterest}></input>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </>
                    )}
                </CustomerContext.Consumer>
            </>
        );
    }
}

EditCustomer.contextType = CustomerContext;

export default EditCustomer;
