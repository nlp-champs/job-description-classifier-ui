require('normalize.css/normalize.css');
require('styles/App.css');

// react and other 3rd party
import React from 'react';
import Notifications, {notify} from 'react-notify-toast';
import Highlighter from 'react-highlight-words';

// constants and colors
const red   = '#FF0000';
const white = '#FFFFFF';
let notifyColor = { background: red, text: white };

// images
var $ = require('jquery');


class AppComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      userInput: '...',
      highlightedSentences: null,
      year: new Date().getFullYear(),
      sButtonText: "CLASSIFY!",
      bButtonActive: true
    }
    this.onChangeUserInput = this.onChangeUserInput.bind(this);
    this.onClickClassifySentence = this.onClickClassifySentence.bind(this);
  }
  onChangeUserInput(e) {
    this.setState({userInput: e.target.value});
  }
  onClickClassifySentence() {
    // post to server
    this.setState({sButtonText: "WORKING...", bButtonActive: false});
    var that = this;
    var data = JSON.stringify({
      userInput: this.state.userInput
    });
    if (typeof window !== 'undefined') {
     $.ajax({
        url: '/classify',
        type: 'POST',
        dataType: 'json',
        data: data,
        contentType: 'application/json',
        cache: false,
        timeout: 15000,
        success: function(oData) {
          console.log("in success!");
          if (oData.bNotFound) {
            notify.show('Unknown error with your input! Try again!', 'custom', 5000, notifyColor); // inform user of error
            this.setState({sButtonText: "CLASSIFY!", bButtonActive: true});
          } else {
            oData = JSON.parse(oData); // parse the returned json
            var aHighlightedSentences = []; // we will build an array of <span>s to put in the
            for (var i = 0; i < oData.results.length; i+=2) {
              if (i + 1 > oData.results.length) {
                break;
              }
              aHighlightedSentences.push(<div><span className={oData.results[i + 1]}>{oData.results[i]}</span><div>&nbsp;</div></div>); // setnences are on even positions in the retured array - the class IS the category name! (see eval_server.py)
            }
            console.log(aHighlightedSentences);
            that.setState({highlightedSentences: aHighlightedSentences, sButtonText: "CLASSIFY!", bButtonActive: true});
          }
        },
        error: function() {
          notify.show('Server error!', 'custom', 5000, notifyColor); // inform the user of the error
          this.setState({sButtonText: "CLASSIFY!", bButtonActive: true});
        }
      });
    }
  }
  render() {
    return (
      <div>
        <Notifications options={{zIndex: 9999999}}/>
        {/* Navigation */}
        <nav className="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
          <div className="container">
            <span className="navbar-brand js-scroll-trigger">CNNs for Classifying Job Descriptions</span>
          </div>
        </nav>
        {/* About Section */}
        <section className="contact" id="createASentence">
          <div className="container">
            <br/>
            <br/>
            <h2 className="text-center">Job Description Classifier!</h2>
            <hr className="star-primary" />
            <div className="row">
              <div className="col-lg-8 text-center">
                <textarea className="form-control" rows="8" id="comment" placeholder="Paste in any text from a job description... (Text with complete sentences ended with a period will be classified the best - we are working on handling more formats.)" onChange={this.onChangeUserInput}></textarea>
              </div>
              <div className="col-lg-4 text-center">
                <div className="dropdown">
                  <h3>Classifications:</h3>
                  <ul>
                    <li><span className="requiredSkill">Required Skill</span></li>
                    <li><span className="degree">Degree</span></li>
                    <li><span className="years">Years of Experience</span></li>
                    <li><span className="desiredSkill">Desired Skill</span></li>
                    <li><span className="benefits">Benefits</span></li>
                    <li><span className="company">Company Culture</span></li>
                    <li><span className="nA">N/A / No classification found</span></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 text-center">
                <div className="dropdown">
                  <button className="btn btn-primary btn-lg mx-auto" type="button" onClick={this.onClickClassifySentence} active={this.state.bButtonActive}>
                    {this.state.sButtonText}
                  </button>
                </div>
              </div>
            </div>
            <br/>
            <div className="row">
              <div className="col-lg-8 text-center">
                <div>
                  {this.state.highlightedSentences}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Contact Section */}
        <section id="whoDunIt">
          <div className="container">
            <h2 className="text-center">Who dun' it?!?!</h2>
            <hr className="star-primary" />
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <p>Why, NLP Champs my dear person! Who are the NLP Champ? NLP Champs are a bunch of bloggers who insist on making natural language processing (NLP) avaliable to all, from the champiest of champs, to the noobiest of noobs. You can start anywhere, just dive in! Don't know what NLP is? Don't want to be a champ? Don't care? It doesn't matter! Check out our NLP-beginner-and-expert friendly site <a href="https://nlp-champs.com">here</a>. (We made a <a href="http://npl-champs.com/a-convolutional-neaural-network-for-classifying-job-descriptions">blog post</a> about how we built this very app!)</p>
              </div>
            </div>
          </div>
        </section>
        {/* Footer */}
        <footer className="text-center">
          <div className="footer-above">
            <div className="container">
              <div className="row">
                <div className="footer-col col-md-8 mx-auto">
                  <h3>About NLP Champs</h3>
                  <p>NLP Champs is a community focused on developing and sharing natural language processing techniques. Check us out!<br/><a href="https://nlp-champs.com">nlp-champs.com</a></p>
                </div>
                <div className="footer-col col-md-8 mx-auto">
                  <h3>Credits and Thanks</h3>
                  <ul>
                    <li>Great character-level convolutional neural network (extended by me) from <a href="https://github.com/dennybritz/cnn-text-classification-tf">dennybritz's github repository</a>.</li>
                    <li>Favicon from <a href="http://www.favicon.cc/?action=icon&file_id=255991">lordeblader at favicon.cc</a></li>
                    <li>Of course, <a href="https://github.com/tensorflow/tensorflow">TensorFlow</a></li>
                    <li><a href="https://github.com/react-webpack-generators/generator-react-webpack">Yeoman React-Webpack Generator</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-below">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  Copyright © NLP-Champs {this.state.year}
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
