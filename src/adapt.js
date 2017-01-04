import React from 'react';
import { Card, Item, Button, Header, Icon, Container, Segment, Grid, Checkbox, List} from 'semantic-ui-react'
import Immutable from 'immutable';

import Transducer from './transducer.js';

var _ = require('lodash');


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
      <Item>
        <Item.Content>
        <Header textAlign="center">{this.props.name}</Header>
        <List>
          {elements}
        </List>
        </Item.Content>
      </Item>

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
        <Header as="h2" textAlign="center">
          Requirements
        </Header>
      <Segment color="teal">
        <Grid padded='vertically' divided columns='equal' stackable stretched doubling verticalAlign='middle'>
          {children}
        </Grid>
      </Segment>
      </div>
    );
  }
}

class ProjectCardSection extends React.Component {
  render() {

    return (
      <Grid.Row>
        <Header>{this.props.attribute}</Header>
        {this.props.value}
      </Grid.Row>
    );
  }
}


class ProjectCard extends React.Component {
  render() {
    var project_info = "";
    if (_.isEmpty(this.props.selectedProject)){
      project_info = "NO PROJECT SELECTED";
    }
    else {
      project_info = Object.keys(this.props.selectedProject).map((key) => {
        return (
          <div key={key}>
            <Grid>
            <ProjectCardSection
              attribute={key}
              value={this.props.selectedProject[key]}
              />
          </Grid>
          </div>
        )
      });
    }
    return (
      <Segment>
          <Header>
            {this.props.selectedProject.name}
          </Header>
          {project_info}
      </Segment>
    );
  }
}

class Project extends React.Component {
  render() {
    let color = 'grey';
    if (this.props.deps.all.has(this.props.project)) {
      color = 'green';
    }
    else if (this.props.deps.some.has(this.props.project)) {
      color = 'yellow';
    }
    else if (this.props.deps.none.has(this.props.project)) {
      color = 'grey';
    }
    return (
      <Button name={this.props.name} onClick={this.props.onProjectClick} size='small' color={color}>
        {this.props.name}
      </Button>
    );
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
              onProjectClick={this.props.onProjectClick}
            />
          </List.Item>
      );
    return (
      <Segment color="teal" compact>
          <Header textAlign="center">{this.props.name}</Header>
          <List>{items}</List>
      </Segment>
    );
  }
}

class ProjectSection extends React.Component {
  render() {
    const projects = Immutable.Map(this.props.projects)
          .map((categoryProjects, categoryName) =>
                <ProjectCategory
                  name={categoryName}
                  key={categoryName}
                  projects={categoryProjects}
                  deps={this.props.deps}
                  onProjectClick={this.props.onProjectClick}
                />
          ).toList();
    return (
    <Grid verticalAlign='middle' divided stackable centered columns={2}>
      <Header as="h2">Open-Source Projects</Header>
      <Grid.Row>
        <Grid.Column>
          <Segment.Group compact>
           {projects}
          </Segment.Group>
        </Grid.Column>
        <Grid.Column>
          <ProjectCard selectedProject={this.props.selectedProject}/>
        </Grid.Column>
      </Grid.Row>
    </Grid>
    );
  }
}

class UserSelection extends React.Component {
  render() {
    return (
      <Segment color="teal" size="massive">
        Selected: {this.props.selectedTexts.join(', ')}
      </Segment>
  );
  }
}

class Adapt extends React.Component {
  constructor(props) {
    super(props);
    const selected = {};
    const project = {};
    Object.keys(props.data.requirements).forEach((name) => {
      props.data.requirements[name].forEach((item) => {
        selected[item] = false;
      });
    });

    this.state = { selected, selectedProject: project };
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

  onProjectClick = (e) => {
    const name = e.target.getAttribute('name');
    const projects = Transducer.flattenProjects();
    const project = projects.filter(p => p.name === name).first();
    this.setState({
      selectedProject: project,
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
          <Segment color="teal" tertiary inverted>
            <Header as="h1" icon textAlign='center'>
              <Icon name='checkmark box' circular />
              <Header.Content>
                Adapt
              </Header.Content>
              <Header.Subheader>
                A planning tool for using diabetes-related open source projects.
              </Header.Subheader>
            </Header>
          </Segment>
          <RequirementSection
              requirements={this.props.data.requirements}
              selectStatus={this.state.selected}
              onButtonClick={this.onButtonClick}
              />
          <UserSelection selectedTexts={selectedTexts}></UserSelection>
          <ProjectSection
                projects={this.props.data.projects}
                deps={depGroups}
                selected={this.state.selected}
                selectedProject={this.state.selectedProject}
                onProjectClick={this.onProjectClick}
              />
          <Header></Header>
        </Container>
      </div>
    );
  }
}

export default Adapt;
