import React from 'react';
import { Card, Item, Button, Header, Icon, Container, Segment, Grid, Checkbox, List} from 'semantic-ui-react'
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

class ProjectInfoCard extends React.Component {
  render() {
    return (
      <Card>
        <Card.Content>
          <Card.Header>
            {this.props.selectedProject}
          </Card.Header>
          This is where the project info goes.
        </Card.Content>
      </Card>
    );
  }
}

class Project extends React.Component {
  render() {
    if (this.props.deps.all.has(this.props.project)) {
      return <Button size="small" color='green'>{this.props.name}</Button>;
    }
    else if (this.props.deps.some.has(this.props.project)) {
      return <Button size="small" color='yellow'>{this.props.name}</Button>;
    }
    else if (this.props.deps.none.has(this.props.project)) {
      return <Button size="small" color='grey'>{this.props.name}</Button>;
    }
    else {
      return <Button size="small" color='grey'>{this.props.name}</Button>;
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
          <ProjectInfoCard data={this.props.data} selectedProject={this.props.selectedProject}/>
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
              />
          <Header></Header>
        </Container>
      </div>
    );
  }
}

export default Adapt;
