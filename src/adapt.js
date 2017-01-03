import React from 'react';
import { Card, Item, Button, Header, Icon, Divider, Container, Segment, Grid, Checkbox, List} from 'semantic-ui-react'
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
        <h3>{this.props.name}</h3>
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
      <Segment>
        <Header as="h2" textAlign="center">
          Requirements
        </Header>
        <Grid columns='equal' centered stackable stretched doubling verticalAlign='middle'>
          {children}
        </Grid>
        <Header as="h2" textAlign="center"></Header>
      </Segment>
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
      return <Button size="small" color='gray'>{this.props.name}</Button>;
    }
    else {
      return <Button size="small" color='gray'>{this.props.name}</Button>;
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
      <Card>
        <Card.Content>
          <Card.Header textAlign="center">{this.props.name}</Card.Header>
          <List>{items}</List>
        </Card.Content>
      </Card>
    );
  }
}

class ProjectInfoCard extends React.Component {
  render() {
    return (
      <Card>
        <Card.Content>
          <Card.Header>
            This is where the project header goes.
          </Card.Header>
          This is where the project info goes.
        </Card.Content>
      </Card>
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
    <Grid columns={2} divided>
      <Grid.Row>
        <Grid.Column textAlign="center">
          <Header as="h2" textAlign="center">Projects</Header>
          <Card.Group>
            {projects}
          </Card.Group>
        </Grid.Column>
        <Grid.Column>
          <ProjectInfoCard />
        </Grid.Column>
      </Grid.Row>
    </Grid>
    );
  }
}

class UserSelection extends React.Component {
  render() {
    return (
      <Segment size="massive">
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
          <Segment color="blue" tertiary inverted>
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
