import React, { Component } from 'react';
import { CustomerContext } from './Contexts/CustomerProvider';
import { UserContext } from './Contexts/UserProvider';
import moment from 'moment';
import EditCustomer from './EditCustomer';


class Customer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: null,
            style: {
                display: "none"
            },
            tooltip: {
                display: "none"
            }
        }
    }

    async componentDidMount() {
        await this.context.getCustomers()
        await this.context.getCustomer(this.props.id)
    }

    async fetchNewData(){
        await this.context.getCustomers()
        await this.context.getCustomer(this.props.id)
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    async newComment(context) {
        if (this.state.comment !== null) {
            let comment = {
                comment: this.state.comment,
                username: context.username,
                fullname: context.fullname,
                date: Date.now(),
                imageurl: context.imageurl,
            }
            await this.context.newComment(this.context.state.customer._id, comment)
            document.querySelector(".commentInput").value = ""
            await this.context.getCustomers()
            await this.context.getCustomer(this.props.id)
        }
    }

    editCustomer(event) {
        let position = event.currentTarget.getBoundingClientRect()
        event.preventDefault()
        this.setState({
            oldValue: event.currentTarget.textContent,
            style: {
                position: "absolute",
                left: position.x,
                top: position.y - 5
            },
            overlay: {
                width: "100vw",
                height: "100vw",
                top: 0,
                left: 0,
                position: "fixed"
            },
            updateValue: {
                name: event.target.getAttribute("name"),
                id: this.context.state.customer._id,
                newValue: ""
            }
        })
    }

    updateField(event) {
        this.setState({
            updateValue: {
                ...this.state.updateValue,
                newValue: event.target.value
            }
        })
    }

    async updateFieldRequest(event) {
        event.preventDefault()
        // Load the updated customers through context
        await this.context.updateCustomer(this.state.updateValue)
        await this.context.getCustomers()
        await this.context.getCustomer(this.props.id)
        // Hide the input field
        this.setState({
            style: { display: "none" }
        })
        // Set the input field value to empty
        document.getElementById("updateCustomer").value = ""
    }

    closeEdit(event) {
        // Close the overlay on click outside of the update field
        if (event.target === document.getElementsByClassName("editContainerOverlay")[0]) {
            this.setState({
                overlay: {
                    display: "none"
                }
            })
        }
    }

    async deleteComment(commentid, customerid){
        await this.context.deleteComment(commentid, customerid)
        await this.context.getCustomers()
        await this.context.getCustomer(this.props.id)
    }

    allowEdit(){
        this.setState({
            allowEdit: true,
            editEnabled: {
                display: "none"
            }
        })
    }

    disableEdit(){
        this.setState({
            allowEdit: false,
            editEnabled: {
                display: "grid"
            }
        })
    }

    render() {

        return (
            <>
                <CustomerContext.Consumer>
                    {(context) => (
                        <>
                            <div className="tooltip" style={this.state.tooltip}>
                                <span className="tooltipPointer"></span>
                                <p>Højreklik på et felt for at opdatere det. Klik på ikonet for at se hvilke felter der kan redigeres.</p>
                                <span className="closeTooltip" onClick={() => this.closeTooltip()}>x</span>
                            </div>

                            <div className="editContainerOverlay" style={this.state.overlay} onClick={(event) => this.closeEdit(event)}>
                                <div className="editContainer" style={this.state.style}>
                                    <div className="editContent">
                                        <form>
                                            <input id="updateCustomer" placeholder={this.state.oldValue} type="text" defaultValue={this.state.edit} onChange={(event) => this.updateField(event)}></input>
                                            <button type="submit" onClick={(event) => this.updateFieldRequest(event)}>Gem</button>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            {this.state.allowEdit ?
                                <EditCustomer
                                    id={this.props.id}
                                    disableEdit={() => this.disableEdit()}
                                    update={() => this.fetchNewData()}>
                                </EditCustomer> : <></>}

                            <div className="gridContainer" style={this.state.editEnabled}>
                                <div className="customerProfile">
                                    <h1 className="customerTitle">{context.state.customer.company}</h1>
                                    <span className="editBtn material-icons-outlined" onClick={(event) => this.allowEdit(event)}>post_add</span>

                                    <div className="customerUrl"><span className="material-icons-outlined customerLink">exit_to_app</span><a href={context.state.customer.url}> {context.state.customer.url}</a></div>
                                    <h3><span className="material-icons-outlined">subject</span> Kundeoplysninger</h3>
                                    <div className="customerDetails">
                                        <span className="customerLabel">Virksomhed</span><span className="edit" name="company" onContextMenu={event => this.editCustomer(event)}>{context.state.customer.company}</span>
                                        <span className="customerLabel">CVR</span><span className="edit" name="cvr" onContextMenu={event => this.editCustomer(event)}>{context.state.customer.cvr}</span>
                                        <span className="customerLabel">Adresse</span><span className="edit" name="address" onContextMenu={event => this.editCustomer(event)}>{context.state.customer.address}</span>
                                        <span className="customerLabel">Kontaktperson</span><span className="edit" name="contactpersonname" onContextMenu={event => this.editCustomer(event)}>{context.state.customer.contactpersonname}</span>
                                        <span className="customerLabel">Kontaktperson telefon</span><span className="edit"><a name="contactpersonphone" onContextMenu={event => this.editCustomer(event)} href={`tel:${context.state.customer.contactpersonphone}`}>{context.state.customer.contactpersonphone}</a></span>
                                        <span className="customerLabel">Kontaktperson email</span><span className="edit"><a name="contactpersonemail" onContextMenu={event => this.editCustomer(event)} href={`mailto:${context.state.customer.contactpersonemail}`}>{context.state.customer.contactpersonemail}</a></span>
                                        <span className="customerLabel">Hjemmeside</span><span className="edit"><a name="url" onContextMenu={event => this.editCustomer(event)} target="_blank" rel="noopener noreferrer" href={context.state.customer.url}>{context.state.customer.url}</a></span>
                                    </div>
                                </div>

                                <div className="customerSub">
                                    <div>
                                        <h2>Abonnement &#38; priser</h2>
                                        <div className="customerDetails">
                                            <span className="customerLabel">Antal timer</span><span className="edit" name="hours" onContextMenu={event => this.editCustomer(event)}>{context.state.customer.hours}</span>
                                            <span className="customerLabel">Timepris</span><span className="edit" name="hourprice" onContextMenu={event => this.editCustomer(event)}>{context.state.customer.hourprice}</span>
                                            <span className="customerLabel">Omsætning i alt</span><span>{context.state.customer.hourprice * context.state.customer.hours} kr/måneden</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h2>Sociale medier</h2>
                                        <div className="customerDetails">
                                            <span className="customerLabel">Facebook</span><span className="edit"><a name="facebook" onContextMenu={event => this.editCustomer(event)} target="_blank" rel="noopener noreferrer" href={context.state.customer.facebook}>{context.state.customer.facebook}</a></span>
                                            <span className="customerLabel">Instagram</span><span className="edit"><a name="instagram" onContextMenu={event => this.editCustomer(event)} target="_blank" rel="noopener noreferrer" href={context.state.customer.instagram}>{context.state.customer.instagram}</a></span>
                                            <span className="customerLabel">LinkedIn</span><span className="edit"><a name="linkedin" onContextMenu={event => this.editCustomer(event)} target="_blank" rel="noopener noreferrer" href={context.state.customer.linkedin}>{context.state.customer.linkedin}</a></span>
                                            <span className="customerLabel">Pinterest</span><span className="edit"><a name="pinterest" onContextMenu={event => this.editCustomer(event)} target="_blank" rel="noopener noreferrer" href={context.state.customer.pinterest}>{context.state.customer.pinterest}</a></span>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <UserContext.Consumer>
                                {(context) => (
                                    <>  <h2>Tilføj kommentar</h2>
                                        <div className="newComment clearfix">
                                            <img alt="Medarbejderbillede" src={context.state.loggedInUser.imageurl} className="newCommentImg"></img>
                                            <textarea className="commentInput" type="text" placeholder="Skriv en kommentar" name="comment" onChange={event => this.handleChange(event)}></textarea>
                                            <button className="commentBtn" onClick={() => this.newComment(context.state.loggedInUser)}>Tilføj kommentar</button>
                                        </div>
                                    </>)}
                            </UserContext.Consumer>

                            <div className="allComments">
                                <h2>Kommentarer</h2>
                                {context.state.customer.comments.map(comment =>
                                    <div className="commentContainer">
                                        <div className="commentAuthor">
                                            <span style={{float: "right", cursor: "pointer"}} onClick={() => this.deleteComment(comment._id, context.state.customer._id)}>x</span>
                                            <div className="commentImg"><img alt="Medarbejderbillede" src={comment.imageurl}></img></div>
                                            <span className="commentName">{comment.fullname}</span>
                                            <span className="commentDate">{moment(comment.date).fromNow()}</span>
                                            <div className="commentContent">{comment.comment}</div>
                                        </div>
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

Customer.contextType = CustomerContext;

export default Customer;
