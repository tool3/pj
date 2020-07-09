import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import './App.css';

const code = `{ 
  "hello": "world",
  "books": ["cool", "stuff"],
  "objects": {
    "name": {
      "nested": true,
      "origin": null,
      "next": 22 
    }
  }
}
`;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { code, checked: false, theme: 'okaidia' };
    this.setChecked = this.setChecked.bind(this);
    this.setTheme = this.setTheme.bind(this);
  }

  parseJson() {
    try {
      const json = JSON.parse(this.state.code);
      const keys = Object.keys(json);
      const formatted = keys.map(key => `${key}=${JSON.stringify(json[key])}`).join("&");
      const showLineNumbers = this.state.checked ? "&showLineNumbers=true" : ""
      const theme = this.state.theme ? `&theme=${this.state.theme}` : ""
      window.open(`/json?${formatted}${showLineNumbers}${theme}`, "_blank");
    } catch (error) {
      alert('invalid json', error);
    }
  }

  setChecked() {
    this.setState({ checked: !this.state.checked });
  }

  setTheme(e) {
    console.log(e.target.value);
    this.setState({ theme: e.target.value });
  }
  render() {
    return (
      <div className="editor">
        <Editor
          tabSize={2}
          insertSpaces={true}
          autoCorrect={"true"}
          autoFocus={true}
          value={this.state.code}
          onValueChange={code => {
            this.setState({ code });
          }}
          highlight={code => highlight(code, languages.json)}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 20,
          }}
        />
        <div className="preview_options">
          <div className="checkbox">
            <input style={{ backgroundColor: "#5655ff" }} className="box" type="checkbox" checked={this.state.checked} onChange={this.setChecked} />
            <span width="5px" /> show line numbers
        </div>
          <div className="theme">
            <label className="theme_select--label" htmlFor="theme_select">theme</label>
            <select name="themes" id="theme_select" onChange={this.setTheme}>
              <option value="dark">dark</option>
              <option value="coy">coy</option>
              <option value="okaidia">okaidia</option>
              <option value="funky">funky</option>
              <option value="solarizedlight">solarizedlight</option>
              <option value="tomorrow">tomorrow</option>
              <option value="twilight">twilight</option>
            </select>
          </div>
        </div>

        <button className="button" onClick={() => this.parseJson()} rel="noopener noreferrer" target="_blank">Try It</button>
      </div>
    );
  }
}