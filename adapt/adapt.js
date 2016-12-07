var DATA = require('../data/example_data.json');

class Project extends React.Component {
  render() {
    return (
      <button>
        <h3>{this.props.project.name}</h3>
      </button>
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
      <div>
        <h3>{name}</h3>
        {elements}
      </div>
    );
  }
}

class ProjectSection extends React.Component {
  render() {
    var categories = [];
    var category_names = Object.keys(this.props.projects);
    this.props.projects.forEach((proj_category) => {
      categories.push(
        <ProjectCategory category={proj_category} />
      );
    });
    return (
      <div>
        <h2>Projects</h2>
        {categories}
      </div>
    );
  }
}

class Requirement extends React.Component {
  render() {
    return (
      <button>
        <h3>{this.props.name}</h3>
      </button>
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
      <div>
        <h3>{this.props.name}</h3>
        {elements}
      </div>);
  }
}

class RequirementSection extends React.Component {
  render() {
    var categories = []
    this.props.requirements.forEach((req_category) => {
      var key = Object.keys(req_category)[0]
      categories.push(
        <RequirementCategory name={key} category={req_category} />
      );
    });
    return (
      <div>
        <h2>Requirements</h2>
        {categories}
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (<div>This is the app.</div>);
  }
}

class Adapt extends React.Component {
  render() {
    return (
      <div>
        <RequirementSection requirements={this.props.data.requirements} />
        <ProjectSection projects={this.props.data.projects} />
      </div>
    );
  }
}

ReactDOM.render(
  <Adapt data={DATA} />,
  document.getElementById('Adapt')
);


