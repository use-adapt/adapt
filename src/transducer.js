let Immutable = require('immutable');

let data = require('../data/example_data.json');

let things_we_have = Immutable.Set(["pebble time", "nightscout"]);
let everything = []
let none = []
let some = []

//data is pulled from example_data.json which isincluded in index.html
for (let project of data.projects) {
  console.log(project);
  for (let dependencies of project.configurations) {
	  let dep = Immutable.Set(dependencies);

	  let intersection = dep.intersect(things_we_have)
	  //intersection of have,dep = dep => everything
	  if (intersection.equals(dep)){
		  console.log("Everything")
      everything.push(project.name)
	  }
	  //intersection of have,dep is empty => none
	  else if(intersection.isEmpty()) {
		  console.log("None")
      none.push(project.name)
	  }
	  //intersection of have,dep is subset of r => some
	  else if(intersection.isSubset(dep)){
		  console.log("Some")
      some.push(project.name)
	  }
  }
}

console.log("everything")
console.log(everything)
console.log("none")
console.log(none)
console.log("some")
console.log(some)
