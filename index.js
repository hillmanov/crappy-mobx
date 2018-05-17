const person = {
  firstName: "Jimmy",
  lastName: "Cozza",
  age: 18
};

const crappyMobx = {
  inObserver: false,

  observable(obj) {
    const handler = {
      observers: {},
      get(target, name) {
        if (crappyMobx.inObserver) {
          this.observers[name] = this.observers[name] || [];
          this.observers[name].push(crappyMobx.observer);
        }
        return target[name];
      },
      set(target, name, value) {
        if (!crappyMobx.inAction) {
          throw Error("Must be called in action");
        }
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
    crappyMobx.inObserver = true;
    crappyMobx.observer = observer;
    observer();
    crappyMobx.inObserver = false;
    crappyMobx.observer = null;
  },

  reaction(register, reactionFn) {
    crappyMobx.inObserver = true;
    crappyMobx.observer = reactionFn;
    register();
    crappyMobx.inObserver = false;
    crappyMobx.observer = null;
  },

  action(fn) {
    crappyMobx.inAction = true;
    fn();
    crappyMobx.inAction = false;
  }
};

const observablePerson = crappyMobx.observable(person);

// crappyMobx.autorun(() => {
//   console.log(observablePerson.firstName, observablePerson.lastName);
// });

crappyMobx.reaction(
  () => [observablePerson.firstName, observablePerson.lastName],
  () =>
    console.log("Someone changed the first name", observablePerson.firstName)
);

crappyMobx.action(() => {
  observablePerson.firstName = "rewrewrew";
  observablePerson.firstName = "rewrewrew";
  observablePerson.firstName = "rewrewrew";
  observablePerson.firstName = "Scott";
  // observablePerson.lastName = "r32432432432";
});
