import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import BoxList from './BoxList.js'
import Typography from '@material-ui/core/Typography';
import Card from "@material-ui/core/Card";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

//const GitHub = require('github-api');
const { Octokit } = require("@octokit/rest");

const TOKEN = "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";
const REPOSITORY_OWNER = "celinashen";
const REPOSITORY_NAME = "Flock"




const useStyles = makeStyles((theme) => ({
  typographyCard: {
    "fontFamily": "Poppins",
    "fontSize": 20,
    "color": "#979B82"
  },
  outstandingBoxContainer:{
    backgroundColor: "#769E76",
    borderRadius: "20px",
    minWidth: 900,
    maxHeight: 320,
    marginLeft: 120,
    marginBottom: 200,
    overflowY: 'scroll',
    overflowX: 'hidden',
    height: "100%",
    '&::-webkit-scrollbar': {
      width: '0.45em',
      height: '0.1em',
      scrollMarginTop: '10px'
      
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      scrollMarginTop: '10px'
    },
    '&::-webkit-scrollbar-thumb': {
      height: '6px',
      backgroundColor: 'rgba(0,0,0,.3)',
      outline: '1px solid slategrey',
      borderRadius: '10px',
      scrollMarginTop: '10px'
    },
  },
  card:{
    borderRadius: 10,
    maxWidth: "200%"
  },
  minListWidth:{
    maxWidth: 1500,
    maxHeight: 500
  },
  typographyOutstandingTitle:{
    "fontFamily": "Poppins",
    "fontSize": 25,
    "color": "#979B82", 
    textAlign: 'center'
  },
}));


class Input extends React.Component {      
  constructor(props) {
      super(props);
      this.state = {value: ''};

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
      this.setState({value: event.target.value});
  }

  handleSubmit(event) {
      //alert('A name was submitted: ' + this.state.value);
      event.preventDefault();
      //process data here
  }

  render() {
  return (
      <form onSubmit={this.handleSubmit}>
      <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
      </label>
      <input type="submit" value="Submit" />
      </form>
  );
  }
}



const ListItem=(props)=> {
  const classes = useStyles();
  return (
    <Card className = {classes.card} style={{boxShadow: "none"}}>
      <Typography className = {classes.typographyCard} style={{fontWeight: 500}}>
        {props.item.Author} | {props.item.Branch} | {props.item.Date}
        <br />
        {props.item.Message}
        <br />
        -----------------------------------
      </Typography>
    </Card>
  );
}



const OutstandingBox=()=>{
  const classes = useStyles();

  const [AllActivity, setAllActivity] = useState('');
  //const [DataArray, setDataArray] = useState('')

  const octokit = new Octokit({
    auth: TOKEN,
  });
  const user = octokit.rest.users.getAuthenticated();



  useEffect(() => {
    async function fetchData() {
      var temp = await octokit.rest.activity.listRepoEvents({ owner: REPOSITORY_OWNER, repo: REPOSITORY_NAME })
      setAllActivity(temp);
    }
    fetchData()
  }, []);



  function processAllActivity() {
    //format into object data structure: {Author: "", Message: "", Branch: "", Date: ""}
    var finalArray = [];
    var tempObject;
    //console.log(AllActivity.data)
    AllActivity.data.map(doc => {
      tempObject = {Author: "", Message: "", Branch: "", Date: ""};
      if (doc.type=="PushEvent")
        doc.payload.commits.map(commit => {
          tempObject["Author"] = commit.author.name;
          tempObject["Message"] += " "+commit.message;
        })
      tempObject["Branch"] = doc.payload.ref;
      tempObject["Date"] = doc.created_at.substring(0,10);
      if (tempObject["Message"].trim() == "")
        tempObject["Message"] = "New Branch Push"
      finalArray.push(tempObject);
    })
    return finalArray;
  }


  return(
    <div>
      <Box pt = {6} ml = {20}>
        <Typography className = {classes.typographyOutstandingTitle} style={{fontWeight: 500}}>
          All Recent Commits
        </Typography>
      </Box>
      <Grid>
        <Grid direction = "column" justify = "center" alignItems = "center" className = {classes.outstandingBoxContainer} >
          <Box pl = {2.5} pr = {2.5} pt = {2.5}>
            {AllActivity
              ? processAllActivity().map(item => {
                return (<ListItem item={item}/>)
              })
              : console.log("Null")
            }
          </Box>
        </Grid>
      </Grid>
    </div>
       
  );
}



function App() {

  return (
    <div className="App">
      <header className="App-header">
        <OutstandingBox/>
      </header>
      <body>
      </body>
    </div>
  );
}

export default App;