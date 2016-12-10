import React from 'react';
import { Checkbox, Header } from 'semantic-ui-react'

/*class Project extends React.Component {
  render() {
    return (
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
}*/

class Requirement extends React.Component {
  render() {
    return (
      <Checkbox
        key={this.props.name}
        name={this.props.name}
        label={this.props.name}
        onClick={this.props.onButtonClick}
        active={this.props.selectStatus[this.props.name]}
        />
    );
  }
}

class RequirementCategory extends React.Component {
  render() {
    var elements = this.props.reqs.map((req) => (
      <Requirement
        key={req}
        name={req}
        onButtonClick={this.props.onButtonClick}
        selectStatus={this.props.selectStatus}
        />
    ));
    return (
      <div key={name}>
        <h3>{name}</h3>
        {elements}
      </div>
    );
  }
}

class RequirementSection extends React.Component {
  render() {
    const children = Object.keys(this.props.requirements).map((name) => {
      const reqs = this.props.requirements[name];
      return (
        <div key={name}>
          <RequirementCategory
            name={name}
            reqs={reqs}
            selectStatus={this.props.selectStatus}
            onButtonClick={this.props.onButtonClick}
            />
        </div>
      )
    });

    return (
      <div>
        {children}
      </div>
    );
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
