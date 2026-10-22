// Combines all handlers.
import { detailsHandlers } from './details.handlers';
import { identityHandlers } from './identity.handlers';
import { livenessHandlers } from './liveness.handlers';
import { sessionHandlers } from './session.handlers';

export const handlers = [
  ...identityHandlers,
  ...livenessHandlers,
  ...sessionHandlers,
  ...detailsHandlers,
];
