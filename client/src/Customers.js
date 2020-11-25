import React, { Component } from 'react';
import { CustomerContext } from './Contexts/CustomerProvider';
import { Link } from "@reach/router";


class Customers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            counter: 0,
            steps: {
                first: true,
                second: false,
                third: false,
                fourth: false
            },
            warning: {
                display: "none"
            }

        }
    }

    async componentDidMount() {
        this.context.getCustomers()
    }

    showModal(event) {
        if (["newBtn", "modalOverlay"].includes(event.target.classList[0])) {
            this.setState({ showModal: !this.state.showModal })

        }
    }

    async nextStep() {

        if (this.state.counter === 3) {
            let customer = {
                company: this.state.name,
                address: this.state.address,
                cvr: this.state.cvr,
                url: this.state.url,
                description: this.state.description,
                contactpersonname: this.state.contactpersonname,
                contactpersonphone: this.state.contactpersonphone,
                contactpersonemail: this.state.contactpersonemail,
                facebook: this.state.facebook,
                instagram: this.state.instagram,
                linkedin: this.state.linkedin,
                pinterest: this.state.pinterest,
                hours: this.state.hours,
                hourprice: this.state.hourprice,
                paymentoptions: this.state.paymentoptions
            }
            this.setState({ showModal: !this.state.showModal })
            await this.context.newCustomer(customer)
            await this.context.getCustomers()

        } else {
            let steps = ["first", "second", "third", "fourth"]
            this.setState({
                steps: {
                    ...this.state.steps,
                    [steps[this.state.counter]]: false,
                    [steps[this.state.counter + 1]]: true
                },
                counter: this.state.counter + 1
            })
        }
    }

    showWarning(event, id) {
        let position = event.target.getBoundingClientRect()
        this.setState({
            warning: {
                left: position.x + 40,
                top: position.y - 40
            },
            deleteCustomer: id
        })
    }

    closeWarning() {
        this.setState({
            warning: {
                display: "none"
            }
        })
    }

    async deleteCustomer(id) {
        this.setState({
            warning: {
                display: "none"
            }
        })
        await this.context.deleteCustomer(id)
        await this.context.getCustomers()
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {

        return (
            <>

                <CustomerContext.Consumer>
                    {(context) => (
                        <>
                            <div className="warningBox" style={this.state.warning}>
                                <span className="warningPointer"></span>
                                <p>Du er ved at slette en kunde. Er du sikker?</p>
                                <span className="closeWarning" onClick={() => this.closeWarning()}>x</span>
                                <button onClick={() => this.deleteCustomer(this.state.deleteCustomer)}>Slet kunde</button>
                            </div>

                            <span className="inlineWrapper"><h1>Kundeoversigt</h1><button className="newBtn" onClick={event => this.showModal(event)}><i className="material-icons-outlined">person_add</i>OPRET NY KUNDE</button></span>
                            {this.state.showModal ? <>
                                <div className="modal">
                                    <div className="modalOverlay" onClick={event => this.showModal(event)}>
                                        <div className="modalContent">
                                            <h2 className="modalTitle">Ny kunde</h2>
                                            <div className={this.state.steps.first ? "" : "step"}>
                                                <p>Opret en ny kunde</p>
                                                <input className="modalInput" type="text" placeholder="Virksomhedens navn" name="name" onChange={event => this.handleChange(event)}></input>
                                                <input className="modalInput" type="text" placeholder="Virksomhedens adresse" name="address" onChange={event => this.handleChange(event)}></input>
                                                <input className="modalInput" type="text" placeholder="CVR nummer" name="cvr" onChange={event => this.handleChange(event)}></input>
                                                <input className="modalInput" type="text" placeholder="Kundens hjemmeside" name="url" onChange={event => this.handleChange(event)}></input>
                                                <textarea className="modalInput modalTextArea" type="text" placeholder="Kort beskrivelse af kunden" name="description" onChange={event => this.handleChange(event)}></textarea>
                                            </div>
                                            <div className={this.state.steps.second ? "" : "step"}>
                                                <p>Hvem er kontaktpersonen i virksomheden?</p>
                                                <input className="modalInput" type="text" placeholder="Navn på kontaktperson" name="contactpersonname" onChange={event => this.handleChange(event)}></input>
                                                <input className="modalInput" type="text" placeholder="Telefonnummer" name="contactpersonphone" onChange={event => this.handleChange(event)}></input>
                                                <input className="modalInput" type="text" placeholder="Email" name="contactpersonemail" onChange={event => this.handleChange(event)}></input>
                                            </div>
                                            <div className={this.state.steps.third ? "" : "step"}>
                                                <p>Kundens sociale medier</p>
                                                <input className="modalInput" type="text" placeholder="Facebook" name="facebook" onChange={event => this.handleChange(event)}></input>
                                                <input className="modalInput" type="text" placeholder="Instagram" name="instagram" onChange={event => this.handleChange(event)}></input>
                                                <input className="modalInput" type="text" placeholder="LinkedIn" name="linkedin" onChange={event => this.handleChange(event)}></input>
                                                <input className="modalInput" type="text" placeholder="Pinterest" name="pinterest" onChange={event => this.handleChange(event)}></input>
                                            </div>
                                            <div className={this.state.steps.fourth ? "" : "step"}>
                                                <p>Betaling &#x26; abonnement</p>
                                                <input className="modalInput" type="text" placeholder="Antal timer i måneden" name="hours" onChange={event => this.handleChange(event)}></input>
                                                <input className="modalInput" type="text" placeholder="Timepris" name="hourprice" onChange={event => this.handleChange(event)}></input>
                                                <textarea className="modalInput modalTextArea" type="text" placeholder="Betalingsbetingelser" name="paymentoptions" onChange={event => this.handleChange(event)}></textarea>
                                            </div>
                                            <button className="modalBtn" onClick={() => this.nextStep()}>NÆSTE <i class="material-icons">keyboard_arrow_right</i></button>
                                        </div>
                                    </div>
                                </div>
                            </> : <></>}
                            <div className="customerGrid">
                                {context.state.customers.map(customer =>
                                    <div className="customerContainer">
                                        <div className="customerName"><Link to={`/customer/${customer._id}`}><h3 className="customerTitle">{customer.company}</h3></Link><span onClick={(event) => this.showWarning(event, customer._id)} className="deleteCustomer">x</span></div>
                                        <div className="customerUrl"><a href={customer.url}>{customer.url}</a></div>
                                        <div className="customerDesc">{customer.description}</div>
                                    </div>
                                )}
                            </div>

                        </>
                    )}
                </CustomerContext.Consumer>
            </>
        );
    }
}

Customers.contextType = CustomerContext;

export default Customers;
