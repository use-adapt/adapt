import Immutable from 'immutable';

import * as data from './data.json';

/*
 * Stupid name for a thing that takes a list of selected requirements and
 * determines which projects can be built with the given list.
 */
class Transducer {
  constructor() {
    this.projects = Transducer.flattenProjects();
  }

  /*
   * In `data.json`, projects are nested by category. This flattens the list.
   * @returns {Immutable.Set}
   */
  static flattenProjects() {
    const projects = Immutable.Map(data.projects);
    return projects.reduce(((acc, projects, category) =>
      acc.union(Immutable.Set(projects))),
      Immutable.Set());
  }

  /*
   * Determine which projects for which we have all, some, and no dependencies.
   * @param {Immutable.Set} userDeps - the set of selected requirements.
   * @returns {all: Immutable.Set, some: Immutable.Set, none: Immutable.Set}
   */
  considerDependencies(userDeps) {
    const empty = Immutable.Map({
      all: new Immutable.Set(),
      some: new Immutable.Set(),
      none: new Immutable.Set()
    });
    const grouped = this.projects.groupBy(p => this.categorizeProject(p, userDeps));
    return empty.concat(grouped).toObject();
  }

  /*
   * Which group does `project` belong to?
   * @param {Object} project
   * @param {string} project.name
   * @param {string} project.github
   * @param {string} project.website
   * @param {string} project.category
   * @param {string[]} project.configurations - list of lists of dependencies.
   * @returns {string} all, some, or none.
   */
  categorizeProject(project, userDeps) {
    let some = false;
    for (let conf of project.configurations) {
      const projectDeps = Immutable.Set(conf);
      const intersection = projectDeps.intersect(userDeps);
      if (this.haveAllDependencies(projectDeps, userDeps, intersection))
        return "all";
      else if (this.haveSomeDependencies(projectDeps, userDeps, intersection))
        some = true;
    }
    return some ? "some" : "none";
  }

  /*
   * Does userDeps contain all requirements in projectDeps?
   * @param {Immutable.Set} projectDeps - dependencies for a project
   * @param {Immutable.Set} userDeps - selected requirements
   * @param {Immutable.Set} intersection - projectDeps ⋂ userDeps
   * @returns {bool}
   */
  haveAllDependencies(projectDeps, userDeps, intersection) {
    if (projectDeps.equals(intersection))
      return true;
    else
      return false;
  }

  /*
   * Does userDeps contain some requirements in projectDeps?
   * @param {Immutable.Set} projectDeps - dependencies for a project
   * @param {Immutable.Set} userDeps - selected requirements
   * @param {Immutable.Set} intersection - projectDeps ⋂ userDeps
   * @returns {bool}
   */
  haveSomeDependencies(projectDeps, userDeps, intersection) {
    if (!projectDeps.equals(intersection) && !intersection.isEmpty())
      return true;
    else
      return false;
  }

  /*
   * Does userDeps contain no requirements in projectDeps?
   * @param {Immutable.Set} projectDeps - dependencies for a project
   * @param {Immutable.Set} userDeps - selected requirements
   * @param {Immutable.Set} intersection - projectDeps ⋂ userDeps
   * @returns {bool}
   */
  haveNoDependencies(projectDeps, userDeps, intersection) {
    if (projectDeps.isEmpty())
      return true;
    else
      return false;
  }
}

export default Transducer;
