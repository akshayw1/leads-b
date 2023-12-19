import { User } from '../models/user';
import developers from '../../developers.json';
import { eventEmit, knownEvents } from '../events/event.types';

const userSearch = async (req, res) => {
  try {
    const { city, techStack } = req.body;
    const { user } = req;

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

    const filteredDevelopers = developers.filter(
      (developer) =>
        developer.city.toLowerCase().includes(city.toLowerCase()) &&
        developer.techStack.toLowerCase().includes(techStack.toLowerCase())
    );

    let leadsFound = filteredDevelopers.length;

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
      return res
        .status(200)
        .json({ leads: filteredDevelopers, count: leadsFound });
    }

    const userLeads = filteredDevelopers.slice(0, foundUser.leadsPerDay);

    eventEmit(knownEvents.UserMadeSearch, {
      userId: foundUser._id,
      leadsFound: userLeads.length,
    });
    return res.status(200).json({ leads: userLeads, count: userLeads.length });
  } catch (err) {
    console.error('Error searching for user:', err);
  }
};

export { userSearch };
