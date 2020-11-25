import React, { Component } from 'react';
import { UserContext } from './Contexts/UserProvider';
import moment from 'moment';

class News extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    async componentDidMount() {
        await this.context.getUsers()
        await this.context.getUpdates()
    }

    findUser(id) {
        let user = this.context.state.users.find(u => u._id === id)
        if (user !== undefined) {
            return user.fullname
        }
    }



    render() {

        return (
            <>
                <h1>Opdateringer</h1>
                <UserContext.Consumer>
                    {(context) => (
                        <>
                            {context.state.updates.map(u =>
                                <div className="news">
                                    <span>{this.findUser(u.byuser)}</span>
                                    <span> {u.text}</span>
                                    <span>{u.about}</span>
                                    <span className="newsDate">{moment(parseInt(u.date)).fromNow()}</span>
                                </div>
                            )}
                        </>
                    )}
                </UserContext.Consumer>
            </>
        );
    }
}

News.contextType = UserContext;

export default News;
