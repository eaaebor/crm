import React, { Component } from 'react';
import { CustomerContext } from './Contexts/CustomerProvider';

class AutocompleteCustomer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customer: {},
            style: {
                display: "none"
            }
        }
    }

    async componentDidMount() {
        await this.context.getCustomers()
    }

    handleChange(event) {
        this.setState({
            style: { display: "block" },
            [event.target.name]: event.target.value
        }, () => {
            let customer = this.context.state.customers.find(c => c.company.includes(this.state.company))
            if (customer) {
                this.setState({ customer: customer })
            } else {
                this.setState({ customer: {company: "Ingen resultater"}})
            }

        });
    }

    hideSuggestions(event, id) {
        this.props.addCustomer(id)
        let value = event.currentTarget.querySelector('span').innerHTML
        document.getElementById("company").value = value
        this.setState({ style: { display: "none" } })
    }

    render() {

        return (
            <>
                <div className="inputContainer">
                    <input id="company" autoComplete="off" className="suggestionInput" type="text" placeholder="Kundens navn" name="company" onChange={event => this.handleChange(event)}></input>
                </div>
                <div className="suggestionContainer">
                    <div className="suggestion" style={this.state.style} onClick={(event) => { this.hideSuggestions(event, this.state.customer._id) }}>
                        <span className="suggestionName">{this.state.customer.company}</span>
                    </div>
                </div>
            </>
        );
    }
}

AutocompleteCustomer.contextType = CustomerContext;

export default AutocompleteCustomer;
