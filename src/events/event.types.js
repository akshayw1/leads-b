import EventEmitter from 'events';

const myEmmiter = new EventEmitter();

export const knownEvents = {
  SubscriptionCreated: 'SubscriptionCreated',
  UpdateUserAcess: 'UpdateUserAcess',
  UserMadeSearch: 'UserMadeSearch',
};

export const subscribe = (eventName, callback) => {
  myEmmiter.on(eventName, callback);
};

export const eventEmit = (eventName, data) => {
  myEmmiter.emit(eventName, data);
};
