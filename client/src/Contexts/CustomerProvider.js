import React, { Component } from 'react';
import AuthService from '../AuthService';

export const CustomerContext = React.createContext();


class CustomerProvider extends Component {
    API_URL = process.env.REACT_APP_API_URL;

    constructor(props) {
        super(props);
        this.Auth = new AuthService(`${this.API_URL}/user/authenticate`);
        this.state = {
            customers: [],
            customer: {
                comments: [],
            }
        }
    }

    render() {


        return (
            <CustomerContext.Provider value={{
                state: this.state,
                getCustomers: async () => {
                    let response = await this.Auth.fetch(`${this.API_URL}/customer/all-customers`)
                    let customers = await response.json()
                    this.setState({ customers: customers })
                },
                getCustomer: async (id) => {
                    let company = await this.state.customers.find(customer => customer._id === id)
                    company.comments.reverse()
                    this.setState({ customer: company })
                },
                newCustomer: async (customer) => {
                    for (const [key, value] of Object.entries(customer)) {
                        if (value === undefined) {
                            customer = {
                                ...customer,
                                [key]: "Ikke opgivet"
                            }
                        }
                    }
                    await this.Auth.fetch(`${this.API_URL}/customer/new-customer`, {
                        method: 'POST',
                        mode: 'cors',
                        body: JSON.stringify({
                            customer: customer,
                            byuser: localStorage.getItem("userid"),
                            date: Date.now()
                        })
                    })
                },
                updateCustomer: async (object) => {
                    await this.Auth.fetch(`${this.API_URL}/customer/edit-customer`, {
                        method: 'PUT',
                        mode: 'cors',
                        body: JSON.stringify({
                            object: object,
                            byuser: localStorage.getItem("userid"),
                            date: Date.now()
                        })
                    })
                },
                updateFullCustomer: async (object, id) => {
                    await this.Auth.fetch(`${this.API_URL}/customer/edit-full-customer`, {
                        method: 'PUT',
                        mode: 'cors',
                        body: JSON.stringify({
                            object: object,
                            id: id,
                            byuser: localStorage.getItem("userid"),
                            date: Date.now()
                        })
                    })
                },
                newComment: async (id, comment) => {
                    await this.Auth.fetch(`${this.API_URL}/customer/new-comment`, {
                        method: 'POST',
                        mode: 'cors',
                        body: JSON.stringify({
                            id: id,
                            comment: comment,
                            byuser: localStorage.getItem("userid")
                        })
                    })
                },
                deleteCustomer: async (id) => {
                    await this.Auth.fetch(`${this.API_URL}/customer/delete-customer`, {
                        method: 'DELETE',
                        mode: 'cors',
                        body: JSON.stringify({
                            id: id,
                            byuser: localStorage.getItem("userid"),
                            date: Date.now()
                        })
                    })
                },
                deleteComment: async (commentid, customerid) => {
                    await this.Auth.fetch(`${this.API_URL}/customer/delete-comment`, {
                        method: 'DELETE',
                        mode: 'cors',
                        body: JSON.stringify({
                            commentid: commentid,
                            customerid: customerid,
                            byuser: localStorage.getItem("userid"),
                            date: Date.now()
                        })
                    })
                },
                displayCustomer: (id) => {
                    let customer = this.state.customers.find(customer => customer._id === id)
                    if (customer !== undefined) {
                        return (
                            <div className="customerProfile">
                                <h1 className="customerTitle linebreak">Kundeoplysninger</h1>
                                <div className="customerDetails">
                                    <span className="customerLabel">Virksomhed</span><span>{customer.company}</span>
                                    <span className="customerLabel">CVR</span><span>{customer.cvr}</span>
                                    <span className="customerLabel">Adresse</span><span>{customer.address}</span>
                                    <span className="customerLabel">Kontaktperson</span><span>{customer.contactpersonname}</span>
                                    <span className="customerLabel">Kontaktperson telefon</span><span> <a href={`tel:${customer.contactpersonphone}`}>{customer.contactpersonphone}</a></span>
                                    <span className="customerLabel">Kontaktperson email</span><span><a href={`mailto:${customer.contactpersonemail}`}>{customer.contactpersonemail}</a></span>
                                    <span className="customerLabel">Hjemmeside</span><span><a name="url" target="_blank" rel="noopener noreferrer" href={customer.url}>{customer.url}</a></span>
                                </div>
                            </div>
                        )
                    }

                }
            }}>
                {this.props.children}
            </CustomerContext.Provider>
        )
    }
}

export default CustomerProvider;