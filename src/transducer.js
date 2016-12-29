import Immutable from 'immutable';

import * as data from '../data/data.json';

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
   * @returns {[Immutable.Set, Immutable.Set, Immutable.Set]}
   */
  considerDependencies(userDeps) {
    const projects = this.projects;
    let all = new Immutable.Set();
    let some = new Immutable.Set();
    let none = new Immutable.Set();
    for (let p of projects.values()) {
      for (let deps of p.configurations) {
        const projectDeps = Immutable.Set(deps);
        const intersection = projectDeps.intersect(userDeps);
        if (this.haveAllDependencies(projectDeps, userDeps, intersection))
          all = all.add(p);
        else if (this.haveSomeDependencies(projectDeps, userDeps, intersection))
          some = some.add(p);
        else if (this.haveNoDependencies(projectDeps, userDeps, intersection))
          none = none.add(p);
      }
    }
    return [all, some, none];
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
