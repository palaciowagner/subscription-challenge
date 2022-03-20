import App from '@/app';
import IndexRoute from '@routes/index.route';
import validateEnv from '@utils/validateEnv';
import SubscriptionsRoute from '@routes/subscription.route';

validateEnv();

const app = new App([new IndexRoute(), new SubscriptionsRoute()]);

app.listen();
