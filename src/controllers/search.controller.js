import { User } from '../models/user';
import axios from 'axios';
import { eventEmit, knownEvents } from '../events/event.types';
import { parseHTML } from '../utils/search.util';

const userSearch = async (req, res) => {
  try {
    const { city, position,entriescount } = req.body;
    const { user } = req;

    const url = `http://43.205.206.18:5551/scrap/${position}/${city}/${entriescount}`;
   

    const foundUser = await User.findById(user._id);

    if (!foundUser.subscribedPlan)
      return res.status(403).json({
        message: 'You need to subscribe to a plan to use this feature',
      });

    if (foundUser.searchQueriesPerDay <= 0) {
      return res
        .status(403)
        .json({ message: 'You have exceeded your daily search limit' });
    }

    const downloadAndParse = (url, callback) => {
      axios
        .get(url)
        .then((response) => {
          setTimeout(() => {
            const htmlContent = response.data;
            console.log("this data",htmlContent);

            callback(null, { data: htmlContent });
          }, 1000); 
        })
        .catch((error) => {
          callback(error);
        });
    };
    downloadAndParse(url, (err, result) => {
      if (err) {
        return res.status(500).json({
          message: 'Error downloading or parsing webpage',
          error: err,
        });
      }

      console.log("scrapedata",scrappedData);
      const scrappedData = result.data;
      console.log("scrapedata",scrappedData);

      let leadsFound = scrappedData.length;

      if (foundUser.leadsPerDay <= 0) {
        eventEmit(knownEvents.UserMadeSearch, {
          userId: foundUser._id,
          leadsFound: 0,
        });
        return res
          .status(403)
          .json({ message: 'You have exceeded your daily leads limit' });
      }

      if (foundUser.leadsPerDay >= leadsFound) {
        eventEmit(knownEvents.UserMadeSearch, {
          userId: foundUser._id,
          leadsFound,
        });
        return res.status(200).json({ data: scrappedData, count: leadsFound });
      }

      const userLeads = scrappedData.slice(0, foundUser.leadsPerDay);

      eventEmit(knownEvents.UserMadeSearch, {
        userId: foundUser._id,
        leadsFound: userLeads.length,
      });
      return res.status(200).json({ data: userLeads, count: userLeads.length });
    });
  } catch (err) {
    console.error('Error searching for user:', err);
  }
};

const getUserStatistics = async (req, res) => {
  const { user } = req;
  const foundUser = await User.findById(user._id).populate('subscribedPlan');

  if (!foundUser)
    return res.status(404).json({ message: 'user is not existed' });

  return res.status(200).json({
    searchQueriesPerDay: foundUser.searchQueriesPerDay,
    leadsPerDay: foundUser.leadsPerDay,
    plan: foundUser.subscribedPlan,
    endDate: foundUser.subscriptionEnd,
  });
};

export { userSearch, getUserStatistics };
