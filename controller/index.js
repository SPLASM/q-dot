const db = require('../database/index.js');
const { ne, lt, gt } = db.Sequelize.Op;
const helpers = require('../helpers/helpers.js');

//find info for one restaurant with current queue information
const findInfoForOneRestaurant = (restaurantId) => {
  return db.Restaurant.find({
    where: {
      id: restaurantId
    },
    include: [{
      model: db.Queue,
      where: {
        position: {
          [ne]: null
        },
        status: 'Waiting'
      },
      include: [db.Customer],
      required: false
    }]
  });
};

//find info for all restaurants with current queue information
const findInfoForAllRestaurants = (city) => {
  return db.Restaurant.findAll(
    { include: [db.Queue, db.Announcement],
      where: {
        address: {
          $like: `%${city}%`
        }
      }
    })
    .then(restaurants => {
      restaurants.forEach(restaurant => {
        restaurant.dataValues.queues = restaurant.queues.filter(row => row.position !== null);
      });
      return restaurants;
    });
};

//update restaurant open/close status
const updateRestaurantStatus = (info) => {
  return db.Restaurant.update({status: info.status}, {where: {id: info.restaurantId}});
};

const updateRestaurantImage = (link, restaurantId) => {
  return db.Restaurant.update({ image: link }, { where: { id: restaurantId } });
};

// find/add customer to database
const findOrAddCustomer = (params) => {
  let queryParams = {};
  let mobile;
  let name;
  if (params.managerId) {
    queryParams.managerId = params.managerId;
  }
  if (params.mobile) {
    mobile = helpers.phoneNumberFormatter(params.mobile);
    name = helpers.nameFormatter(params.name);
    queryParams.mobile = mobile;
  }
  return db.Customer.findOne({where: queryParams})
    .then(customer => {
      if (customer === null) {
        const customer = {
          name: name,
          mobile: mobile
        };

        if (params.email) {
          customer.email = params.email;
        }
        if (params.managerId) {
          customer.managerId = params.managerId;
        }

        return db.Customer.create(customer);
      } else if (params.managerId && !customer.managerId) {
        db.Customer.update({
          name: name,
          email: params.email,
          username: params.username
        }, {
          where: { id: customer.id }
        });
      } else {
        return customer;
      }
    });
};

const addRewardData = managerId => {
  return db.Reward.create({ managerId: managerId });
};

const findLoggedCustomer = loggedId => {
  return db.Customer.findOne({where: {managerId: loggedId}});
};

// get current queue info for one restaurant
const getQueueInfo = (restaurantId, customerId, customerPosition) => {
  return db.Queue.findAndCountAll({
    where: {
      restaurantId: restaurantId,
      position: {
        [ne]: null,
        [lt]: customerPosition
      }
    }
  });
};

const getWaitTime = (restaurantId, customerId, customerPosition) => {
  return db.Queue.findAll({
    where: {
      restaurantId: restaurantId,
      position: {
        $ne: null,
        $lt: customerPosition
      }
    },
    attributes: ['wait']
  });
}

const updateQueue = (queueId, newPos) => {
  return db.Queue.update({position: newPos}, {where: {id: queueId}});
}

//add a customer to a queue at a restaurant
const addToQueue = (params) => {
  const queueInfo = {
    size: params.size,
  };
  const response = {};

  return findOrAddCustomer(params)
    .then(customer => {
      queueInfo.customerId = customer.id;
      queueInfo.name = customer.name;
      return db.Queue.findOne({where: {customerId: customer.id,
        status: 'Waiting'}});
    })
    .then(row => {
      if (row !== null) {
        return row;
      } else {
        return findInfoForOneRestaurant(params.restaurantId);
      }
    })
    .then(restaurant => {
      if (restaurant.status === 'Open') {
        queueInfo.position = restaurant.nextPosition + 1;
        queueInfo.wait = Math.round((restaurant.average_wait * queueInfo.size) / 4.5);
        queueInfo.restaurantId = restaurant.id;
        let totalWait = restaurant.total_wait + queueInfo.wait;
        return db.Restaurant.upsert({'nextPosition': queueInfo.position, 'total_wait': totalWait, phone: restaurant.phone});
      } else {
        throw new Error('Restaurant has closed the queue');
      }
    })
    .then(result => {
      if (params.createdAt) {
        queueInfo.createdAt = params.createdAt;
        queueInfo.removedAt = params.removedAt;
      }
      return db.Queue.create(queueInfo);
    })
    .then(result => {
      response.wait = result.wait;
      response.queueId = result.id;
      response.size = result.size;
      response.position = result.position;
      return getQueueInfo(result.restaurantId, result.customerId, queueInfo.position);
    })
    .then(result => {
      response.queueList = result.rows;
      response.queueCount = result.count;
      return response;
    });
};

// get queue info for one customer
const getCustomerInfo = (queueId) => {
  return db.Queue.findOne({
    where: {
      id: queueId
    },
    include: [db.Customer, db.Restaurant]
  });
};

const getCustomerQueueHistory = customerId => {
  return db.Queue.findAll({
    where: {
      customerId: customerId,
      status: 'Seated'
    }
  });
};

// get info for one manager
const getCustomerLoginInfo = (username) => {
  return db.Customer.findOne({
    where: {
      username: username
    }
  });
};

const getCustomerRewardInfo = userId => {
  return db.Reward.findOne({
    where: { managerId: userId }
  });
};

// get info for one manager
const getManagerInfo = (username) => {
  return db.Manager.findOne({
    where: {
      username: username
    }
  });
};

//remove customer from queue
const removeFromQueue = (queueId, status) => {
  let restaurant;
  let queueInfo;
  return db.Queue.find({where: {id: queueId}, include: [db.Restaurant]})
    .then(row => {
      if (!row.position && !row.wait) {
        throw new Error('Already removed');
      } else {
        queueInfo = row;
        restaurant = row.restaurant;
        return db.Queue.findAll({where: {position: {[ne]: null, [gt]: row.position}}});
      }
    })
    .then(result => result.map(row => db.Queue.upsert({id: row.id})))
    .then(() => db.Restaurant.upsert({'total_wait': restaurant.total_wait - Math.round((restaurant.average_wait * queueInfo.size) / 4), phone: restaurant.phone}))
    .then(() => db.Queue.upsert({position: null, wait: null, status: status, id: queueId}))
    .then(() => getQueueInfo(restaurant.id, 0, restaurant.nextPosition + 1));
};

module.exports = {
  findInfoForAllRestaurants,
  findInfoForOneRestaurant,
  findOrAddCustomer,
  addToQueue,
  updateRestaurantStatus,
  getQueueInfo,
  getCustomerInfo,
  getCustomerLoginInfo,
  getManagerInfo,
  removeFromQueue,
  updateQueue,
  findLoggedCustomer,
  getCustomerQueueHistory,
  getCustomerRewardInfo,
  addRewardData,
  updateRestaurantImage,
  getWaitTime
};
