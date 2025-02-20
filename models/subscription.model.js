import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription Name is required'],
        trim: true,
        minLength: [3, 'Name must be at least 3 characters.'],
        maxLength: [100, 'Name must be at most 50 characters.'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be at least 0.'],
        max: [100000, 'Price must be at most 100000.'],
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP'],
        default: 'USD',
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
    },
    category: {
        type: String,
        enum: ['sports', 'news', 'entertainment', 'technology', 'science', 'business', 'health', 'other'],
        required: [true, 'Category is required'],
    },
    paymentMethod: {
        type: String,
        required: [true, 'Payment Method is required'],
        trim: true,
    },

    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: [true, 'Start Date is required'],
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Start Date must be in the past.',
        },
    },
    renewalDate: {
        type: Date,
        //required: true,
        validate: {
            validator: function (value) {
                return value > this.startDate;
            },
            message: 'Renewal date must be after the start date.',
        },
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
        index: true,
    },

}, { timestamps: true });

//Auto Calculate Renewal Date if missing.
subscriptionSchema.pre('save', function (next) {
    if (!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    //Auto-update the status if renewal date is in the past or has passed.
    if (this.renewalDate < new Date()) {
        this.status = 'expired';
    }

    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);  // Create a model

export default Subscription;  // Export the model