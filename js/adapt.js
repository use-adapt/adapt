import React from 'react';
import { Button, Header, Table } from 'semantic-ui-react'
// import FlatButton from 'material-ui/FlatButton';

import sampleData from './sample.json';

class Project extends React.Component {
  render() {
    return (
      //<FlatButton label={this.props.project.name} />
      <Button>
      foobar
      </Button>
    );
  }
}

class ProjectCategory extends React.Component {
  render() {
    var elements = [];
    var name = Object.keys(this.props.category)[0];
    this.props.category[name].forEach((proj) => {
      elements.push(<Project project={proj} />)
    });
    return (
      <Table.Row textAlign='center' >
        <Table.Cell>{elements}</Table.Cell>
      </Table.Row>
    );
  }
}

class ProjectSection extends React.Component {
  render() {
    var categories = [];
    var category_names = Object.keys(this.props.projects);
    this.props.projects.forEach((proj_category) => {
      categories.push(
        <Table.Row textAlign='center'>
          <Table.Cell>{Object.keys(proj_category)[0]}</Table.Cell>
        </Table.Row>
      );
      categories.push(
        <ProjectCategory category={proj_category} />
      );
    });
    return (
      <div>
      <Header>Projects</Header>
      <Table compact celled>
        <Table.Body>
          {categories}
        </Table.Body>
      </Table>
      </div>
    );
  }
}

class Requirement extends React.Component {
  render() {
    return (
      <Button>
        {this.props.name}
      </Button>
    );
  }
}

class RequirementCategory extends React.Component {
  render() {
    var elements = [];
    this.props.category[this.props.name].forEach((requirement) => {
      elements.push(<Requirement name={requirement} />)
    });
    return (
      <Table.Row textAlign='center'>
        <Table.Cell>{elements}</Table.Cell>
      </Table.Row>
    );
  }
}

class RequirementSection extends React.Component {
  render() {
    const children = Object.keys(this.props.requirements).map((name) => {
      const reqs = this.props.requirements[name];
      return (
        <div key={name}>
          <h3>{name}</h3>
          {reqs.map((req) => (
            <Button
              key={req}
              name={req}
              onClick={this.props.onButtonClick}
              active={this.props.selectStatus[req]}
            >
              {req}
            </Button>
          ))}
        </div>
      )
    });

    return (
      <div>
      {children}
      </div>
    );
    //
    // var categories = []
    //
    // this.props.requirements.forEach((req_category) => {
    //   var key = Object.keys(req_category)[0]
    //
    //   categories.push(
    //     <Table.Row textAlign='center'>
    //       <Table.Cell>{key}</Table.Cell>
    //     </Table.Row>
    //   );
    //   categories.push(
    //     <RequirementCategory key={key} name={key} category={req_category} />
    //   );
    // });
    // return (
    //   <div>
    //   <Header>Requirements</Header>
    //   <Table compact celled>
    //     <Table.Body>
    //       {categories}
    //     </Table.Body>
    //   </Table>
    //   </div>
    // );
  }
}

class Adapt extends React.Component {
  constructor(props) {
    super(props);
    const selected = {};
    Object.keys(props.data.requirements).forEach((name) => {
      props.data.requirements[name].forEach((item) => {
        selected[item] = false;
      });
    });

    this.state = { selected };
  }

  onButtonClick = (e) => {
    const name = e.target.name;

    this.setState({
      selected: {
        ...this.state.selected,
        [name]: !this.state.selected[name],
      },
    });
  }

  render() {
    const selectedTexts = Object.keys(this.state.selected).filter((key) => {
      return this.state.selected[key];
    });
    return (
      <div>
        <RequirementSection
          requirements={this.props.data.requirements}
          selectStatus={this.state.selected}
          onButtonClick={this.onButtonClick}
        />
        {selectedTexts.join(', ')}
        {/* <ProjectSection projects={this.props.data.projects} /> */}
      </div>
    );
  }
}

export default Adapt;

/*ReactDOM.render(
  <Adapt data={DATA} />,
  document.getElementById('Adapt')
);*/
