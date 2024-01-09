import { Plan } from '../models/plan';

const createPlan = async (req, res) => {
  try {
    const { name, price, duration, searchQueriesPerDay, leadsPerDay } =
      req.body;
    const plan = new Plan({
      name,
      price,
      duration,
      searchQueriesPerDay,
      leadsPerDay,
    });
    await plan.save();
    return res.status(201).json({ plan, message: 'plan created successfully' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'An error occurred while creating plan' });
  }
};

const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    return res.status(200).json({ data: plans });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'something went wrong' });
  }
};
const deletePlan = async (req, res) => {
  try {
    const planId = req.params.id; // Assuming you are passing the plan ID as a parameter
    const deletedPlan = await Plan.findByIdAndDelete(planId);

    if (!deletedPlan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    return res.status(200).json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while deleting plan' });
  }
};

const updatePlan = async (req, res) => {
  try {
    const planId = req.params.id;
    const { name, price, duration, searchQueriesPerDay, leadsPerDay } = req.body;

    const updatedPlan = await Plan.findByIdAndUpdate(
      planId,
      { name, price, duration, searchQueriesPerDay, leadsPerDay },
      { new: true } // Returns the modified document rather than the original
    );

    if (!updatedPlan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    return res.status(200).json({ plan: updatedPlan, message: 'Plan updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while updating plan' });
  }
};

export { createPlan, getPlans,deletePlan ,updatePlan};
