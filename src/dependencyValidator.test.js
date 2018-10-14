import Immutable from 'immutable';
import Transducer from './transducer';

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

describe('Transducer', () => {
  describe('flattenProjects', () => {
    it('flattens projects into a single set', () => {
      const transducer = new Transducer(baseData());
      expect(transducer.projects).toEqual(Immutable.Set([
        pebbleWatchface, openOmni, autotune
      ]));
    });
  });

  describe('considerDependencies', () => {
    it('returns empty sets for no projects', () => {
      const transducer = new Transducer([]);
      expect(transducer.considerDependencies()).toEqual({
        all: new Immutable.Set(),
        some: new Immutable.Set(),
        none: new Immutable.Set(),
      });
    });
    it('returns all as empty with no user deps', () => {
      const transducer = new Transducer(baseData());
      expect(transducer.considerDependencies()).toEqual({
        all: new Immutable.Set(),
        some: new Immutable.Set(),
        none: new Immutable.Set([pebbleWatchface, openOmni, autotune]),
      });
    });
    it('returns mapped projects with met dependencies', () => {
      const transducer = new Transducer(baseData());
      expect(transducer.considerDependencies(["Nightscout", "Loop"])).toEqual({
        all: new Immutable.Set([autotune]),
        some: new Immutable.Set([pebbleWatchface]),
        none: new Immutable.Set([openOmni]),
      });
    });
  });
});
