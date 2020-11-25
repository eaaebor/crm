import React, { Component } from 'react';
import { CustomerContext } from './Contexts/CustomerProvider';


class CustomerReload extends Component {

    async componentDidMount() {
        await this.context.getCustomers()
    }

    render() {

        return (
            <>

            </>
        );
    }
}

CustomerReload.contextType = CustomerContext;

export default CustomerReload;
