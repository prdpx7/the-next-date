import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import TweetEmbed from 'react-tweet-embed';

function EmbedTweets(props){
  const html_tweets = props.tweets.map((tweet, idx) => {
    return (
          <div>
          <div className="gap-3x"></div>
          <Row><a href={tweet.article_url} key={idx+1} target="_blank" rel="noopener noreferrer"><div className="well well-sm">{idx+1}</div></a><TweetEmbed id={tweet.tweet_id}/></Row>
          </div>
    )
  })
return (
  <div>
    <div className="panel-group">
      {html_tweets}
    </div>
  </div>
)
    
}
const ForkRibbon = () => (
      <div>
        <a href="https://github.com/prdpx7/the-next-date/" target="_blank" rel="noopener noreferrer">
        <img className="ribbon" src="https://camo.githubusercontent.com/365986a132ccd6a44c23a9169022c0b5c890c387/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f7265645f6161303030302e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_red_aa0000.png"/>
        </a>
      </div>
  );

const Row = (props) => (
  <div className="row">
    <div className="col-md-2"></div>
    <div className="col-md-8">{props.children}</div>
    <div className="col-md-2"></div>
  </div>
);

// const CreditImage = () => (
//   <img className="img-responsive" src="https://i.imgur.com/wDrkuqp.png"/>
// )

const AppIcon = () => (
  <a href="https://twitter.com/TimFederle/status/659798794863775744" rel="noopener noreferrer" target="_blank" className="popup">
    <img className="img-responsive" src="https://i.imgur.com/PSlOjJl.png" alt="app-logo"/>
    <span>
    <img className="img-responsive" src="https://i.imgur.com/wDrkuqp.png" alt="app-idea"/>
    </span>
  </a>
);

const ShowError = (props) => (
  <div className="alert alert-info">
    <strong>{props.errorMsg}</strong>
  </div>
);

class Search extends Component{
  constructor(props){
    super(props);
    this.state = {
      username:'jack',
      userprofile:'https://twitter.com/jack/',
      tweets:[],
      showTweets: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  handleInputChange(event){
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]:value
    })

  }
  handleClick(event){
    event.preventDefault();
    console.log("current state is");
    this.setState({
      tweets:[],
      showTweets:true,
      isError: false,
      errorMsg:'',
    })
    // console.log(this.state);
    axios.get(`https://thenextdate.herokuapp.com/twitter/${this.state.username}/5`)
    .then(resp => {
      console.log(resp);
      if(resp.data.hasOwnProperty('shared_articles')){
        if(resp.data.shared_articles.length === 0){
          this.setState({
            isError:true,
            errorMsg: 'Can\'t find enough tweets! :(',
            showTweets: false,
          })
        }
        else{
          resp.data.shared_articles.forEach(tweet => {
            this.setState({
              tweets: this.state.tweets.concat([tweet]),
              showTweets:true
            })
          })
        }
      }
      else if (resp.data[0].code && resp.data[0].code === 34){
        this.setState({
          isError: true,
          errorMsg: resp.data[0].message,
          showTweets: false,
        })
      }
    })
    .catch(err => {
      console.log(err);
    })
  }
  render(){
    return(
      <div>
        <form className="form-horizontal" onSubmit={this.handleClick}>
          <div className="input-group">
            <input className="form-control" type="text" name="username" placeholder="Twitter Username" onChange={this.handleInputChange}/>
            <div className="input-group-btn">
              <button className="btn btn-default" type="submit" name="Search" value="Search">
                <i className="glyphicon glyphicon-search"></i>
              </button>
            </div>
          </div>
        </form>
        
        {this.state.showTweets ? <EmbedTweets tweets={this.state.tweets} /> : this.state.isError ? <ShowError errorMsg={this.state.errorMsg}/>  : null}
      </div>
    )
  }
}
class App extends Component {
  render() {
    return (
      <div className="container">
        <ForkRibbon/>
        <Row>
          <div className="gap-3x"></div>
          <AppIcon/>
        </Row>
        <div className="gap"></div>
        <Row>
          <Search/>
        </Row>
      </div>
    );
  }
}

export default App;
