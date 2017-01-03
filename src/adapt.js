import React from 'react';
import { Header, Icon, Divider, Container, Segment, Grid, Checkbox, List} from 'semantic-ui-react'
import Immutable from 'immutable';

import Transducer from './transducer.js';


class Requirement extends React.Component {
  render() {
    return (
      <Checkbox
        key={this.props.name}
        name={this.props.name}
        label={<label name={this.props.name}>{this.props.name}</label>}
        onChange={this.props.onButtonClick}
        checked={this.props.selectStatus[this.props.name]}
        />
    );
  }
}

class RequirementCategory extends React.Component {
  render() {
    var elements = this.props.reqs.map((req) => (
      <List.Item key={req}>
        <Requirement
        name={req}
        onButtonClick={this.props.onButtonClick}
        selectStatus={this.props.selectStatus}
        />
      </List.Item>
    ));
    return (
      <div>
        <h3>{this.props.name}</h3>
        <List>
        {elements}
        </List>
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
          <Grid.Column verticalAlign='middle' key={this.props.name}>
          <Segment>
          <RequirementCategory
            name={name}
            reqs={reqs}
            selectStatus={this.props.selectStatus}
            onButtonClick={this.props.onButtonClick}
            />
          </Segment>
          </Grid.Column>
        </div>
      )
    });
    return (
      <Grid columns='equal' centered stackable stretched doubling verticalAlign='middle'>
        {children}
      </Grid>
    );
  }
}

class Project extends React.Component {
  render() {
    if (this.props.deps.all.has(this.props.project)) {
      return <div className='green'>{this.props.name}</div>;
    }
    else if (this.props.deps.some.has(this.props.project)) {
      return <div className='yellow'>{this.props.name}</div>;
    }
    else if (this.props.deps.none.has(this.props.project)) {
      return <div className='gray'>{this.props.name}</div>;
    }
    else {
      return <div className='gray'>{this.props.name}</div>;
    }
  }
}

class ProjectCategory extends React.Component {
  render() {
    const items = this.props.projects.map(project =>
          <List.Item key={project.name}>
            <Project
              name={project.name}
              project={project}
              deps={this.props.deps}
            />
          </List.Item>
      );
    return (
      <Segment>
        <h3>{this.props.name}</h3>
        <List>{items}</List>
      </Segment>
    );
  }
}

class ProjectSection extends React.Component {
  render() {
    const projects = Immutable.Map(this.props.projects)
          .map((categoryProjects, categoryName) =>
              <Grid.Column verticalAlign='middle' key={categoryName}>
                <ProjectCategory
                  name={categoryName}
                  projects={categoryProjects}
                  deps={this.props.deps}
                />
              </Grid.Column>
          ).toList();
    return (
      <Grid columns='equal' centered stackable stretched doubling verticalAlign='middle'>
        {projects}
      </Grid>
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
    const name = e.target.getAttribute('name');

    this.setState({
      selected: {
        ...this.state.selected,
        [name]: !this.state.selected[name],
      },
    });
  }

  render() {
    const selectedTexts = Object.keys(this.state.selected).filter((key) =>
      this.state.selected[key]
    );
    const transducer = new Transducer();
    const userDeps = Immutable.Set(selectedTexts);
    const depGroups = transducer.considerDependencies(userDeps);
    return (
      <div>
        <Container>
        <Header as="h1" icon textAlign='center'>
          <Icon name='checkmark box' circular />
          <Header.Content>
            Adapt
          </Header.Content>
          <Header.Subheader>
            A planning tool for using diabetes-related open source projects.
          </Header.Subheader>
        </Header>
        </Container>
        <Divider />
        <Container>
          <RequirementSection
            requirements={this.props.data.requirements}
            selectStatus={this.state.selected}
            onButtonClick={this.onButtonClick}
            />
        </Container>
        <Divider />
        <Container>

        {selectedTexts.join(', ')}

        <ProjectSection
          projects={this.props.data.projects}
          deps={depGroups}
          selected={this.state.selected}
        />
        </Container>
      </div>
    );
  }
}

export default Adapt;
