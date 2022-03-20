import App from '@/app';
import validateEnv from '@utils/validateEnv';
import SubscriptionsRoute from '@routes/subscriptions.route';

validateEnv();

const app = new App([new SubscriptionsRoute()]);

app.listen();
