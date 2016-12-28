import React from 'react';
import { Container, Segment, Grid, Checkbox, List} from 'semantic-ui-react'

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
      <List.Item>
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
    var half_length = Math.ceil(children.length / 2);
    var leftSide = children.slice(0,half_length);
    var rightSide = children.slice(half_length, children.length);
    return (
      <Grid columns='equal' stretched doubling verticalAlign='middle'>
        <Grid.Row verticalAlign='middle'>
        {leftSide}
        </Grid.Row>
        <Grid.Row>
        {rightSide}
        </Grid.Row>
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
    const selectedTexts = Object.keys(this.state.selected).filter((key) => {
      return this.state.selected[key];
    });
    return (
      <div>
        <Container>
        <RequirementSection
          requirements={this.props.data.requirements}
          selectStatus={this.state.selected}
          onButtonClick={this.onButtonClick}
          />
        {selectedTexts.join(', ')}
        </Container>
        {/* <ProjectSection projects={this.props.data.projects} /> */}
      </div>
    );
  }
}

export default Adapt;
