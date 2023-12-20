import { User } from '../models/user';
import axios from 'axios';
import developers from '../../developers.json';
import { eventEmit, knownEvents } from '../events/event.types';
import { parseHTML } from '../utils/search.util';

const userSearch = async (req, res) => {
  try {
    const { city, position } = req.body;
    const { user } = req;

    const url = `https://www.justdial.com/${city}/${position}/nct-11035713/`;

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

            const directory = parseHTML(htmlContent);

            const jsonData = JSON.stringify(directory, null, 2);

            callback(null, { data: directory });
          }, 1000); // 10 seconds delay
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

      const scrappedData = result.data.slice(0, -2);

      let leadsFound = scrappedData.length;

      console.log('+++', leadsFound);

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
  const foundUser = await User.findById(user._id);

  if (!foundUser)
    return res.status(404).json({ message: 'user is not existed' });

  return res.status(200).json({
    searchQueriesPerDay: foundUser.searchQueriesPerDay,
    leadsPerDay: foundUser.leadsPerDay,
  });
};

export { userSearch, getUserStatistics };
