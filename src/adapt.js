import React from 'react';
import {
  Divider, Item, Button, Header, Icon, Container, Segment, Grid, Checkbox, List, Image
} from 'semantic-ui-react';
import Immutable from 'immutable';

import Transducer from './transducer.js';
import data from './data.json';

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
        <Header as="h1" textAlign="center">
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

class Configuration extends React.Component {
  render() {
    const configuration = Immutable.Set(this.props.configuration);
    const selected = Immutable.Set(this.props.selectedTexts);
    const configuration_have = selected.intersect(configuration);
    const configuration_need = configuration.subtract(configuration_have);

    const have_list = Immutable.List(configuration_have)
      .interpose('+').map((e, i) =>
        e === '+'
        ? <strong key={'have+'+i}> + </strong>
        : <span key={e} className='green'>{e}</span>);
    const need_list = Immutable.List(configuration_need)
      .interpose('+').map((e, i) =>
        e === '+'
        ? <strong key={'need+'+i}> + </strong>
        : <span key={e}>{e}</span>);

    return (
      <List.Item key={configuration}>
        <div className='text-left'>
          {have_list}
        </div>
        <div className='text-right'>
          {need_list}
        </div>
        <Divider />
      </List.Item>
    );
  }
}

class ConfigurationsSection extends React.Component {
  render() {
    var configurations = this.props.configurations
      .map(configuration =>
                <Configuration
                  key={configuration}
                  configuration={configuration}
                  selectedTexts={this.props.selectedTexts}
                />
            );
    return (
      <div>
        <Icon name='sliders' />
        <Header>Configurations</Header>
        <List celled>
          {configurations}
        </List>
      </div>
    );
  }
}

class ProjectCardSection extends React.Component {
  render() {
    var icon = null;
    var title = this.props.attribute;
    var value = this.props.value;

    if (this.props.attribute === "name"){
      return null;
    }
    if (this.props.value === null) {
      return null;
    }
    if (this.props.attribute === "image"){
      return <Image src={value} centered shape='rounded' />;
    }
    if (this.props.attribute === "github"){
      icon = <Icon name='github' />
      title = "Github";
      value = <a href={value}>Link</a>;
    }
    if (this.props.attribute === "pebble_store"){
      icon = <Icon name='cart' />
      title = "Pebble Store";
      value = <a href={value}>Link</a>;
    }
    if (this.props.attribute === "category"){
      icon = <Icon name='zip' />
      title = "Category";
    }
    if (this.props.attribute === "website"){
      icon = <Icon name='linkify' />
      title = "Website";
      value = <a href={value}>{value}</a>;
    }
    if (this.props.attribute === "configurations"){
      return <List.Item key={this.props.attribute}>
                <ConfigurationsSection
                  configurations={value}
                  selectedTexts={this.props.selectedTexts}
                  />
             </List.Item>
    }
    return (
      <List.Item key={this.props.attribute}>
      <div>
        {icon}
        <Header>{title}</Header>
        {value}
      </div>
      </List.Item>
    );
  }
}


class ProjectCard extends React.Component {
  render() {
    let project_info = "";
    if (this.props.selectedProject !== {}) {
      project_info = Object.keys(this.props.selectedProject).map((key, i) => {
      return (
        <ProjectCardSection
          key={i}
          attribute={key}
          value={this.props.selectedProject[key]}
          selectedTexts={this.props.selectedTexts}
          />
      )
      });
    }


    return (
      <Segment color="teal">
          <Header as="h2">
            {this.props.selectedProject.name}
          </Header>
          <List celled>
            {project_info}
          </List>
      </Segment>
    );
  }
}

class Project extends React.Component {
  render() {
    let color = 'black';
    if (this.props.deps.all.has(this.props.project)) {
      color = 'green';
    }
    else if (this.props.deps.some.has(this.props.project)) {
      color = 'blue';
    }
    else if (this.props.deps.none.has(this.props.project)) {
      color = 'black';
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

class ProjectLegend extends React.Component {
  render() {
    return (
      <div>
        <Segment textAlign='center' color="teal" compact>
        <Button.Group>
        <Button size='small' color='green'>
          You have everything you need.
        </Button>
        <Button size='small' color='blue'>
          You have some of what you need.
        </Button>
        <Button size='small' color='black'>
          You have none of what you need.
        </Button>
        </Button.Group>
      </Segment>
      </div>
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
      <div>
        <Header textAlign='center' as="h1">Open-Source Projects</Header>
        <center>
          <ProjectLegend />
        </center>
        <Divider/>
        <Grid divided stackable centered columns={2}>
          <Grid.Row>
            <Grid.Column>
              <Segment.Group compact>
                {projects}
              </Segment.Group>
            </Grid.Column>
            <Grid.Column>
              <ProjectCard
                selectedTexts={this.props.selectedTexts}
                selectedProject={this.props.selectedProject}
                />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
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
    this.transducer = new Transducer(data);
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
    const project = this.transducer.projects.filter(p => p.name === name).first();
    this.setState({
      selectedProject: project,
    });
  }

  render() {
    const selectedTexts = Object.keys(this.state.selected).filter((key) =>
      this.state.selected[key]
    );
    const userDeps = Immutable.Set(selectedTexts);
    const depGroups = this.transducer.considerDependencies(userDeps);
    return (
      <div>
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
        <Container>
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
                selectedTexts={selectedTexts}
                onProjectClick={this.onProjectClick}
              />
          <Header></Header>
        </Container>
      </div>
    );
  }
}

export default Adapt;
