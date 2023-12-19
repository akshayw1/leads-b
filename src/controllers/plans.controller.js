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

export { createPlan };
