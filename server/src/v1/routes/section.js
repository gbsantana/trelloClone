const router = require('express').Router({ mergeParams: true });
const { param } = require('express-validator');
const tokenHandler = require('../handlers/tokenHandler');
const sectionController = require('../controllers/section');
const validation = require('../handlers/validation');

router.post(
  '/',
  param('boardId').custom((value) => {
    if (!validation.isObjectId(value)) {
      console.error(`Invalid boardId: ${value}`); // Log invalid IDs
      return Promise.reject('Invalid board ID');
    }
    return Promise.resolve();
  }),
  validation.validate,
  tokenHandler.verifyToken,
  sectionController.create
);

router.put(
  '/:sectionId',
  param('boardId').custom((value) => {
    if (!validation.isObjectId(value)) {
      console.error(`Invalid boardId: ${value}`);
      return Promise.reject('Invalid board ID');
    }
    return Promise.resolve();
  }),
  param('sectionId').custom((value) => {
    if (!validation.isObjectId(value)) {
      console.error(`Invalid sectionId: ${value}`); // Log invalid IDs
      return Promise.reject('Invalid section ID');
    }
    return Promise.resolve();
  }),
  validation.validate,
  tokenHandler.verifyToken,
  sectionController.update
);

router.delete(
  '/:sectionId',
  param('boardId').custom((value) => {
    if (!validation.isObjectId(value)) {
      console.error(`Invalid boardId: ${value}`);
      return Promise.reject('Invalid board ID');
    }
    return Promise.resolve();
  }),
  param('sectionId').custom((value) => {
    if (!validation.isObjectId(value)) {
      console.error(`Invalid sectionId: ${value}`); // Log invalid IDs
      return Promise.reject('Invalid section ID');
    }
    return Promise.resolve();
  }),
  validation.validate,
  tokenHandler.verifyToken,
  sectionController.delete
);

module.exports = router;
