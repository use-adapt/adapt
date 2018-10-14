import Immutable from 'immutable'

/*
 * In `data.json`, projects are nested by category. This flattens the list.
 * @returns {Immutable.Set}
 */
const flattenProjects = data => {
  return Immutable.Map(data.projects).reduce((acc, projects) =>
    acc.union(Immutable.Set(projects)),
    Immutable.Set());
}

/*
 * Does userDeps contain all requirements in projectDeps?
 * @param {Immutable.Set} projectDeps - dependencies for a project
 * @param {Immutable.Set} userDeps - selected requirements
 * @param {Immutable.Set} intersection - projectDeps ⋂ userDeps
 * @returns {bool}
 */
const hasAll = (projectDeps, userDeps, intersection) => {
  return projectDeps.equals(intersection)
}

/*
 * Does userDeps contain some requirements in projectDeps?
 * @param {Immutable.Set} projectDeps - dependencies for a project
 * @param {Immutable.Set} userDeps - selected requirements
 * @param {Immutable.Set} intersection - projectDeps ⋂ userDeps
 * @returns {bool}
 */
const hasSome = (projectDeps, userDeps, intersection) => {
  return !projectDeps.equals(intersection) && !intersection.isEmpty()
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
const categorize = (project, userDeps) => {
  if (!project.configurations) return 'none';

  let some = '';
  for (const conf of project.configurations) {
    const projectDeps = Immutable.Set(conf);
    const intersection = projectDeps.intersect(userDeps);
    if (hasAll(projectDeps, userDeps, intersection))
      return 'all';
    if (hasSome(projectDeps, userDeps, intersection))
      some = 'some';
  }
  return some || 'none';
}


/*
 * Stupid name for a thing that takes a list of selected requirements and
 * determines which projects can be built with the given list.
 */
export default class Transducer {
  constructor(data) {
    this.projects = flattenProjects(data);
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
    return empty.concat(this.projects.groupBy(p => categorize(p, userDeps))).toObject();
  }
}
