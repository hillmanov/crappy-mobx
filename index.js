const person = {
  firstName: "Jimmy",
  lastName: "Cozza",
  age: 18
};

const crappyMobx = {
  observable(obj) {
    const handler = {
      observers: {},
      get(target, name) {
        if (crappyMobx.observer) {
          this.observers[name] = this.observers[name] || [];
          this.observers[name].push(crappyMobx.observer);
        }
        return target[name];
      },
      set(target, name, value) {
        if (target[name] !== value) {
          target[name] = value;
          if (this.observers[name]) {
            this.observers[name].forEach(fn => fn());
          }
        }
      }
    };
    return new Proxy(obj, handler);
  },

  autorun(observer) {
    crappyMobx.observer = observer;
    observer();
    crappyMobx.observer = null;
  },

  reaction(register, reactionFn) {
    crappyMobx.observer = reactionFn;
    register();
    crappyMobx.observer = null;
  }
};

const observablePerson = crappyMobx.observable(person);

crappyMobx.autorun(() => {
  console.log(
    "This one",
    observablePerson.firstName,
    observablePerson.lastName
  );
});

crappyMobx.reaction(
  () => [observablePerson.firstName, observablePerson.lastName],
  () =>
    console.log("Someone changed the first name", observablePerson.firstName)
);

observablePerson.firstName = "rewrewrew";
observablePerson.firstName = "rewrewrew";
observablePerson.firstName = "rewrewrew";
observablePerson.firstName = "Scott";
// observablePerson.lastName = "r32432432432";
