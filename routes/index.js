import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';
import UsersController from '../controllers/UsersController';
import { basicAuthenticate, xTokenAuthenticate } from '../middlewares/auth';
import { APIError, errorResponse } from '../middlewares/error';

/**
 * Binds the routes to the appropriate handler in the
 * given Express application.
 * @param {Express} app The Express application.
 */
const mapRoutes = (app) => {
  app.get('/status', AppController.getStatus);
  app.get('/stats', AppController.getStats);

  app.get('/connect', basicAuthenticate, AuthController.getConnect);
  app.get('/disconnect', xTokenAuthenticate, AuthController.getDisconnect);

  app.post('/users', UsersController.postNew);
  app.get('/users/me', xTokenAuthenticate, UsersController.getMe);

  app.post('/files', xTokenAuthenticate, FilesController.postUpload);
  app.get('/files:id', xTokenAuthenticate, FilesController.getShow);
  app.get('/files', xTokenAuthenticate, FilesController.getIndex);
  app.put('/files/:id/publish', xTokenAuthenticate, FilesController.putPublish);
  app.put('/files/:id/unpublish', xTokenAuthenticate, FilesController.putUnpublish);
  app.get('/files/:id/data', FilesController.getFile);

  app.all('*', (req, res, next) => {
    errorResponse(new APIError(404, `Cannot ${req.method} ${req.url}`), req, res, next);
  });
  app.use(errorResponse);
};

export default mapRoutes;
