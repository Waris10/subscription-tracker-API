import { workflowClient } from '../config/upstash.js';
import Subscription from '../models/subscription.model.js';
import { SERVER_URL } from '../config/env.js';

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id
            },
            headers: {
                'content-type': 'application/json'
            },
            retries: 0,
        })

        res.status(201).json({ success: true, data: { subscription, workflowRunId } });
    } catch (error) {
        next(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        //Check if the user is the same as the one in the token
        if (req.user.id !== req.params.id) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access'
            });
        }
        const subscriptions = await Subscription.find({ user: req.params.id });

        res.status(200).json({
            success: true,
            data: subscriptions,
        });
    } catch (error) {
        next(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}