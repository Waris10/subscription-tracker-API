import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { createSubscription, getUserSubscriptions, deleteSubscription, getSubscriptionById, getAllSubscriptions } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/', getAllSubscriptions);
subscriptionRouter.get('/:id', getSubscriptionById);
subscriptionRouter.post('/', authorize, createSubscription);
//subscriptionRouter.put('/:id', (req, res) => res.send({ title: 'UPDATE a subscription information' }));
subscriptionRouter.delete('/:id', deleteSubscription);
subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);
//subscriptionRouter.put('/:id/cancel', (req, res) => res.send({ title: 'CANCEL subscription' }));
//subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send({ title: 'GET upcoming renewals' }));

export default subscriptionRouter;