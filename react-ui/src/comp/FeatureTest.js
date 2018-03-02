import React, { Component } from 'react';
import '../css/BearTest.css';

export default class BearsTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      features: [],
      fetching: true
    };
  }

  componentDidMount() {
    fetch('/api/features')
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        console.log(json);
        this.setState({
          features: json,
          fetching: false
        });
      }).catch(e => {
        this.setState({
          message: `API call failed: ${e}`,
          fetching: false
        });
      })
  }

  render() {
    return (
      <div className="FeatureTest">
        {this.state.features.length > 0 ?
          this.state.features.map((feature) => <p>{feature.name}</p>) :
          (<h2>no bears</h2>)
        }
      </div>
    );
  }
}
