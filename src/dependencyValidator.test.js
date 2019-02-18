import Immutable from 'immutable';
import DependencyValidator from './dependencyValidator';

const pebbleWatchface = {
  name:  "Nightscout for Pebble",
  configurations: [[
      "Nightscout",
      "Pebble Classic"
    ],
    [
      "Nightscout",
      "Pebble Steel"
    ],
    [
      "Nightscout",
      "Pebble Time"
    ],
    [
      "Nightscout",
      "Pebble Time Steel"
  ]]
};
const autotune = {
  "name": "OpenAPS Autotune",
  "configurations": [
    [
      "Nightscout",
      "OpenAPS"
    ],
    [
      "Nightscout",
      "Loop"
    ]
  ]
}
const openOmni = {
  "name": "OpenOmni",
  "configurations": [
    [
      "RFCat",
      "Omnipod"
    ],
    [
      "TI USB Stick",
      "cc-debugger",
      "Omnipod"
    ]
  ]
}
const baseData = () => ({
  projects: {
    Watchfaces: [pebbleWatchface],
    Experimental: [openOmni, autotune],
}})

describe('DependencyValidator', () => {
  describe('flattenProjects', () => {
    it('flattens projects into a single set', () => {
      const validator = new DependencyValidator(baseData());
      expect(validator.projects).toEqual(Immutable.Set([
        pebbleWatchface, openOmni, autotune
      ]));
    });
  });

  describe('considerDependencies', () => {
    it('returns empty sets for no projects', () => {
      const validator = new DependencyValidator([]);
      expect(validator.considerDependencies()).toEqual({
        all: new Immutable.Set(),
        some: new Immutable.Set(),
        none: new Immutable.Set(),
      });
    });
    it('returns all as empty with no user deps', () => {
      const validator = new DependencyValidator(baseData());
      expect(validator.considerDependencies()).toEqual({
        all: new Immutable.Set(),
        some: new Immutable.Set(),
        none: new Immutable.Set([pebbleWatchface, openOmni, autotune]),
      });
    });
    it('returns mapped projects with met dependencies', () => {
      const validator = new DependencyValidator(baseData());
      expect(validator.considerDependencies(["Nightscout", "Loop"])).toEqual({
        all: new Immutable.Set([autotune]),
        some: new Immutable.Set([pebbleWatchface]),
        none: new Immutable.Set([openOmni]),
      });
    });
  });
});
