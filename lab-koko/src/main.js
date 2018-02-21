import './styles/main.scss'
import React from 'react'
import ReactDom from 'react-dom'
import superagent from 'superagent'

const API_URL = 'http://www.reddit.com/r'

class SearchForm extends React.Component {
  constructor(props){ 
    super(props)
    this.state = {
      topic: '',
      limit: '',
    }
    this.handleInputTopic = this.handleInputTopic.bind(this);
    this.handleInputLimit = this.handleInputLimit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
}
  handleInputTopic(e) {
    this.setState({topic: e.target.value})
  }
  handleInputLimit(e) {
    this.setState({limit: e.target.value})
  }
  handleSubmit(e) {
    e.preventDefault()
    this.props.update_state(this.state.topic, this.state.limit)
  }
  render() {
    return (
      <form 
        className="search-form" 
        onSubmit= {this.handleSubmit}>
       <input className={this.props.error ? 'error' : 'input'}
          type="text"
          name="topic-search"
          value={this.state.topic}
          onChange={this.handleInputTopic}
          placeholder="Topic"/>
     <input className={this.props.error ? 'error' : 'input'}
          type="limit"
          name="limit-search"
          value={this.state.limit}
          onChange={this.handleInputLimit}
          min="0"
          max="99"
          placeholder="Limit"/>
        <button type="submit">Search</button>
      </form>
    )
  }
}

class SearchResultList extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="results">
        {this.props.topic ?
          <section className="topic-data">
          <h2>{this.props.value}</h2>
            {this.props.topic.data.children.map(ele => <li><a href ={ele.data.url}>{ele.data.title}</a><p>{ele.data.ups}</p></li>)}
          </section>
          :
          undefined
        }
        {this.props.error ?
          <section className="topic-error">
            <h2>You broke it.</h2>
          </section>
          :
          undefined
        }
      </div>
    )

  }
}

class App extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
      topic: null,
      searchError: null,
      limit: null,
    }
    this.searchAPI = this.searchAPI.bind(this)
    this.updateState = this.updateState.bind(this)
  }
  updateState(name, limit){
    this.searchAPI(name, limit)
     .then(res => this.setState({topic: res.body, searchError: null}))
     .catch(err => this.setState({topic:null, searchError: err}))
  }
  searchAPI(name, limit) {
    return superagent.get(`${API_URL}/${name}.json?limit=${limit}`)
  }
    render() {
      return (
        <div className="app">
          <h2>Search Topic</h2>
          <SearchForm update_state={this.updateState}/>
          <SearchResultList topic={this.state.topic} error={this.state.searchError}/>
        </div>
      );
    }
}
ReactDom.render(<App />, document.getElementById('root'));