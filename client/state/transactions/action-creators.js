import _ from 'lodash';
import xhr from 'xhr';
import actionTypes from './action-types';
import authActionTypes from '../auth/action-types';

export function resetCreateTransactionResolution() {
  return {
    type: actionTypes.CREATE_TRANSACTION_RESET_RESOLUTION
  };
}

export function createTransaction(resource) {
  resource.type = 'transactions';

  return dispatch => {
    dispatch({
      type: actionTypes.CREATE_TRANSACTION,
      resource
    });

    const req = xhr.post(
      '/api/transactions',
      {
        body: JSON.stringify({
          data: resource
        }),
        headers: {
          'Content-Type': 'application/vnd.api+json'
        }
      },
      (err, res, body) => {
        if (req.aborted) {
          dispatch({
            type: actionTypes.CREATE_TRANSACTION_ABORTED,
            resource
          });
        } else if (res.statusCode === 401) {
          dispatch({type: authActionTypes.UNAUTHORIZED});
        } else if (err || res.statusCode >= 400) {
          dispatch({type: actionTypes.CREATE_TRANSACTION_FAILURE, resource});
        } else {
          dispatch({
            type: actionTypes.CREATE_TRANSACTION_SUCCESS,
            resource: JSON.parse(body).data
          });
        }
      }
    );

    return req;
  };
}

export function resetRetrieveTransactionsResolution() {
  return {
    type: actionTypes.RETRIEVE_TRANSACTIONS_RESET_RESOLUTION
  };
}

export function retrieveTransactions() {
  return (dispatch) => {
    dispatch({type: actionTypes.RETRIEVE_TRANSACTIONS});

    const req = xhr.get(
      '/api/transactions',
      {
        headers: {
          'Content-Type': 'application/vnd.api+json'
        }
      },
      (err, res, body) => {
        if (req.aborted) {
          dispatch({type: actionTypes.RETRIEVE_TRANSACTIONS_ABORTED});
        } else if (res.statusCode === 401) {
          dispatch({type: authActionTypes.UNAUTHORIZED});
        } else if (err || res.statusCode >= 400) {
          dispatch({type: actionTypes.RETRIEVE_TRANSACTIONS_FAILURE});
        } else {
          dispatch({
            type: actionTypes.RETRIEVE_TRANSACTIONS_SUCCESS,
            resources: JSON.parse(body).data
          });
        }
      }
    );

    return req;
  };
}

export function resetUpdateTransactionResolution(resourceId) {
  return {
    type: actionTypes.UPDATE_TRANSACTION_RESET_RESOLUTION,
    resourceId
  };
}

export function updateTransaction(resource) {
  resource.type = 'transactions';

  return (dispatch, getState) => {
    const {id} = resource;

    const resourceList = getState().transactions.resources;
    const resourceToUpdate = _.find(resourceList, {id});

    dispatch({
      type: actionTypes.UPDATE_TRANSACTION,
      resource
    });

    const req = xhr.patch(
      `/api/transactions/${id}`,
      {
        body: JSON.stringify({data: resource}),
        headers: {
          'Content-Type': 'application/vnd.api+json'
        }
      },
      (err, res) => {
        if (req.aborted) {
          dispatch({
            type: actionTypes.UPDATE_TRANSACTION_ABORTED,
            resource
          });
        } else if (res.statusCode === 401) {
          dispatch({type: authActionTypes.UNAUTHORIZED});
        } else if (err || res.statusCode >= 400) {
          dispatch({
            type: actionTypes.UPDATE_TRANSACTION_FAILURE,
            resource
          });
        } else {
          dispatch({
            type: actionTypes.UPDATE_TRANSACTION_SUCCESS,
            resource: {
              ...resourceToUpdate,
              ...resource
            }
          });
        }
      }
    );

    return req;
  };
}

export function deleteTransaction(id) {
  return (dispatch, getState) => {
    const resourceList = getState().transactions.resources;
    const resourceToDelete = _.find(resourceList, {id});

    dispatch({
      type: actionTypes.DELETE_TRANSACTION,
      resource: resourceToDelete
    });

    const req = xhr.del(
      `/api/transactions/${id}`,
      {
        headers: {
          'Content-Type': 'application/vnd.api+json'
        }
      },
      (err, res) => {
        if (req.aborted) {
          dispatch({
            type: actionTypes.DELETE_TRANSACTION_ABORTED,
            resource: resourceToDelete
          });
        } else if (res.statusCode === 401) {
          dispatch({type: authActionTypes.UNAUTHORIZED});
        } else if (err || res.statusCode >= 400) {
          dispatch({
            type: actionTypes.DELETE_TRANSACTION_FAILURE,
            resource: resourceToDelete
          });
        } else {
          dispatch({
            type: actionTypes.DELETE_TRANSACTION_SUCCESS,
            resource: resourceToDelete
          });
        }
      }
    );

    return req;
  };
}